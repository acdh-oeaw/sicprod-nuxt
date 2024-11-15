<script lang="ts" setup>
import SearchPage from "@/components/search-page.vue";

const t = useTranslations();

usePageMetadata({
	title: t("Pages.searchviews.function.title"),
});

const api = useApiClient();
const endpoint = api["apis_api_apis_ontology.function_list"];

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
	<main class="max-w-[100dvw]">
		<SearchPage class-name="Function" :cols="columns" :endpoint="endpoint" type="function">
			<h1 class="sr-only">{{ t("SearchFunctionsPage.title") }}</h1>
		</SearchPage>
	</main>
</template>
