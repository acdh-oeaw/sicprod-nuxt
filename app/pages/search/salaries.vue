<script lang="ts" setup>
import SearchPage from "@/components/search-page.vue";

definePageMeta({
	title: "Pages.searchviews.salary.title",
});
const t = useTranslations();

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
	<SearchPage class-name="Salary" :cols="columns" :endpoint="endpoint"></SearchPage>
</template>
