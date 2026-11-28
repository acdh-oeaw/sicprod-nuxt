<script setup lang="ts">
import BookOverview from "#/app/components/book-overview.vue";
import IiifViewer from "#/app/components/iiif-viewer.vue";

const t = useTranslations();

const route = useRoute();

usePageMetadata({
	title: t("Pages.iiif.title"),
});
</script>

<template>
	<main>
		<ClientOnly v-if="route.query.book">
			<IiifViewer />
		</ClientOnly>
		<BookOverview v-else class="max-w-container mx-auto my-8" />
	</main>
</template>
