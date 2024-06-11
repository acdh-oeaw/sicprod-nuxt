<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";

definePageMeta({
	title: "Pages.searchviews.person.title",
});
const t = useTranslations();

const { $api } = useNuxtApp();
const endpoint = $api["apis_api_apis_ontology.person_list"];

const columns = [
	{
		key: "first_name",
		label: t("Pages.searchviews.person.first_name"),
		sortable: true,
	},
	{
		key: "name",
		label: t("Pages.searchviews.person.name"),
		sortable: true,
	},
	{
		key: "start_date_written",
		label: t("Pages.searchviews.person.start_date"),
		sortable: true,
	},
	{
		key: "end_date_written",
		label: t("Pages.searchviews.person.end_date"),
		sortable: true,
	},
	{
		key: "gender",
		label: t("Pages.searchviews.person.gender"),
		sortable: true,
	},
];
</script>

<template>
	<SearchTable :endpoint="endpoint" :cols="columns" class-name="Person"></SearchTable>
</template>
