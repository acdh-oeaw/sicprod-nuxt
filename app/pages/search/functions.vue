<script lang="ts" setup>
import SearchPage from "@/components/search-page.vue";

const t = useTranslations();

usePageMetadata({
	title: t("Pages.searchviews.function.title"),
});

const { $api } = useNuxtApp();
const endpoint = $api["apis_api_apis_ontology.function_list"];

const columns = [
	{
		key: "name",
		label: t("Pages.searchviews.function.name"),
		sortable: true,
	},
	{
		key: "alternative_label",
		label: t("Pages.searchviews.function.alternative_label"),
		sortable: true,
	},
];
</script>

<template>
	<SearchPage class-name="Function" :cols="columns" :endpoint="endpoint">
		<h1 class="sr-only">{{ t("SearchFunctionsPage.title") }}</h1>
	</SearchPage>
</template>
