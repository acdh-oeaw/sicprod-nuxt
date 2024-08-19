<script setup lang="ts">
import "tify/dist/tify.css";
import "tify";

const route = useRoute();
const router = useRouter();

const page = computed(() => {
	if (typeof route.query.page === "string")
		return parseInt([...route.query.page.matchAll(/.*-([0-9]+)r/g)][0]?.[1] ?? "");
	else return 1;
});

onMounted(async () => {
	let manifest;
	if (typeof route.query.book === "string")
		manifest = await import(`~/assets/manifests/${decodeURI(route.query.book)}.json?url`);
	//@ts-expect-error no Tify export
	const tify = new Tify({
		container: "#tify",
		manifestUrl: manifest.default,
		pages: [page.value],
	});
	tify.ready.then(() => {
		tify.viewer.addHandler("open", () => {
			const page = tify.options.pages[0] ?? 1;
			void router.replace({ query: { page: `${page - 1}v-${page}r`, book: route.query.book } });
		});
	});
});
</script>

<template>
	<div id="tify" class="h-full"></div>
</template>
