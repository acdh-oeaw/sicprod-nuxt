<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";

definePageMeta({
	title: "Pages.searchviews.institution.title",
});
const t = useTranslations();

const { $api } = useNuxtApp();
const endpoint = $api["apis_api_apis_ontology.institution_list"];

const columns = [
	{
		key: "name",
		label: t("Pages.searchviews.institution.name"),
		sortable: true,
	},
	{
		key: "start_date_written",
		label: t("Pages.searchviews.institution.start_date"),
		sortable: true,
	},
	{
		key: "end_date_written",
		label: t("Pages.searchviews.institution.end_date"),
		sortable: true,
	},
	{
		key: "type",
		label: t("Pages.searchviews.institution.type"),
		sortable: true,
	},
];
</script>

<template>
	<SearchTable :endpoint="endpoint" :cols="columns" class-name="Institution"></SearchTable>
</template>
