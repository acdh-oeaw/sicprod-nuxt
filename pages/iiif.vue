<script setup lang="ts">
import IiifViewer from "@/components/iiif-viewer.vue";

definePageMeta({
	title: "Pages.iiif.title",
});
</script>

<template>
	<main>
		<ClientOnly>
			<IiifViewer></IiifViewer>
		</ClientOnly>
	</main>
</template>
