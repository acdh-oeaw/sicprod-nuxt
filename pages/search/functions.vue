<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";

definePageMeta({
	title: "Pages.searchviews.function.title",
});
const t = useTranslations();

const { $api } = useNuxtApp();
const endpoint = $api.apis_api_ontology_function_list;

const columns = [
	{
		key: "name",
		label: t("Pages.searchviews.function.name"),
		sortable: true,
	},
	{
		key: "start_date_written",
		label: t("Pages.searchviews.function.start_date"),
		sortable: true,
	},
	{
		key: "end_date_written",
		label: t("Pages.searchviews.function.end_date"),
		sortable: true,
	},
];
</script>

<template>
	<SearchTable :endpoint="endpoint" :cols="columns" class-name="Function"></SearchTable>
</template>
