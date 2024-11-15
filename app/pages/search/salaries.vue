<script lang="ts" setup>
import SearchPage from "@/components/search-page.vue";

const t = useTranslations();

usePageMetadata({
	title: t("Pages.searchviews.salary.title"),
});

const { $api } = useNuxtApp();
const endpoint = $api["apis_api_apis_ontology.salary_list"];

const columns = [
	{
		key: "name",
		label: t("Pages.searchviews.salary.name"),
		sortable: true,
	},
	{
		//label inconsistency in APIS ("typ" instead of "type")
		key: "typ",
		label: t("Pages.searchviews.salary.type"),
		sortable: true,
	},
];
</script>

<template>
	<main class="max-w-[100dvw]">
		<SearchPage class-name="Salary" :cols="columns" :endpoint="endpoint" type="salary">
			<h1 class="sr-only">{{ t("SearchSalariesPage.title") }}</h1>
		</SearchPage>
	</main>
</template>
