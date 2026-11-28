<script setup lang="ts">
import "tify/dist/tify.css";
import type { Manifest } from "@iiif/presentation-3";
import type Tify from "tify";

const t = useTranslations();

const route = useRoute();
const router = useRouter();

const container = useTemplateRef("tifyContainer");
let tify: Tify | undefined;

onBeforeUnmount(() => {
	tify?.destroy();
});

onMounted(async () => {
	const { book, page } = route.query;
	if (typeof book !== "string") {
		return;
	}

	const filename = decodeURI(book.replaceAll(/\(|\)/g, ""));
	const [{ default: manifestUrl }, { default: manifest }, { default: Tify }] = await Promise.all([
		import(`../../assets/manifests/${filename}.json?url`),
		import(`../../assets/manifests/${filename}.json`) as Promise<{ default: Manifest }>,
		import("tify"),
	]);
	if (container.value === null) {
		return;
	}

	const pageIndex = Math.max(
		0,
		manifest.items.findIndex((item) => {
			return item.label?.de?.[0] === page;
		}),
	);

	const viewer = new Tify({ container: container.value, manifestUrl, pages: [pageIndex + 1] });
	tify = viewer;

	await viewer.ready;
	if (container.value === null) {
		return;
	}

	viewer.viewer.addHandler("open", () => {
		const currentPage = viewer.options.pages[0] ?? 1;
		void router.replace({ query: { page: manifest.items[currentPage - 1]?.label?.de?.[0], book } });
	});
});
</script>

<template>
	<div class="relative h-full">
		<div id="tify" ref="tifyContainer" class="h-full" />
		<div
			class="absolute right-0 bottom-0 bg-neutral-100/70 p-3 text-sm md:max-w-96 dark:bg-neutral-900/70"
		>
			{{ t("Pages.iiif.disclaimer") }}
		</div>
	</div>
</template>
