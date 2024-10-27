<script setup lang="ts">
import "tify/dist/tify.css";
import "tify";

import type { Manifest } from "@iiif/presentation-3";

const t = useTranslations();

const route = useRoute();
const router = useRouter();

const manifest = ref<Manifest>();

onMounted(async () => {
	let manifestUrl;
	const page = route.query.page;

	if (typeof route.query.book === "string") {
		const book = route.query.book.replaceAll(/\(|\)/g, "");
		manifestUrl = await import(`~/assets/manifests/${decodeURI(book)}.json?url`);
		manifest.value = await import(`~/assets/manifests/${decodeURI(book)}.json`);
	}
	if (manifest.value === undefined) return;
	const pageIdx = Math.max(
		0,
		manifest.value.items.findIndex((item) => item.label?.de?.[0] === page),
	);
	//@ts-expect-error no Tify export
	const tify = new Tify({
		container: "#tify",
		manifestUrl: manifestUrl.default,
		pages: [pageIdx + 1],
	});
	tify.ready.then(() => {
		tify.viewer.addHandler("open", () => {
			const page = tify.options.pages[0] ?? 1;
			void router.replace({
				query: { page: manifest.value?.items[page - 1]?.label?.de?.[0], book: route.query.book },
			});
		});
	});
});
</script>

<template>
	<div class="relative h-full">
		<div id="tify" class="h-full"></div>
		<div
			class="absolute bottom-0 right-0 bg-neutral-100/70 p-3 text-sm md:max-w-96 dark:bg-neutral-900/70"
		>
			{{ t("Pages.iiif.disclaimer") }}
		</div>
	</div>
</template>
