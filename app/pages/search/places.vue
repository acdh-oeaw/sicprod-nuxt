<script lang="ts" setup>
import SearchPage from "@/components/search-page.vue";

const t = useTranslations();

usePageMetadata({
	title: t("Pages.searchviews.place.title"),
});

const { $api } = useNuxtApp();
const endpoint = $api["apis_api_apis_ontology.place_list"];

const columns = [
	{
		key: "label",
		label: t("Pages.searchviews.place.name"),
		sortable: true,
	},
	{
		key: "type",
		label: t("Pages.searchviews.place.type"),
		sortable: true,
	},
];
</script>

<template>
	<SearchPage class-name="Place" :cols="columns" :endpoint="endpoint" type="place">
		<h1 class="sr-only">{{ t("SearchPlacesPage.title") }}</h1>
	</SearchPage>
</template>
