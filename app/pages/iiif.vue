<script setup lang="ts">
import BookOverview from "@/components/book-overview.vue";
import IiifViewer from "@/components/iiif-viewer.vue";

const t = useTranslations();

const route = useRoute();

usePageMetadata({
	title: t("Pages.iiif.title"),
});
</script>

<template>
	<main>
		<ClientOnly v-if="route.query.book">
			<IiifViewer></IiifViewer>
		</ClientOnly>
		<BookOverview v-else class="mx-auto my-8 max-w-container"></BookOverview>
	</main>
</template>
