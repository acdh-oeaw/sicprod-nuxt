<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";

definePageMeta({
	title: "Pages.searchviews.salary.title",
});
const t = useTranslations();

const { $api } = useNuxtApp();
const endpoint = $api.apis_api_ontology_salary_list;

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
	<SearchTable :endpoint="endpoint" :cols="columns" class-name="Salary"></SearchTable>
</template>
