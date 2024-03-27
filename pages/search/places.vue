<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";

definePageMeta({
	title: "Pages.searchviews.place.title",
});
const t = useTranslations();

const { $api } = useNuxtApp();
const endpoint = $api.apis_api_ontology_place_list;

const columns = [
	{
		key: "name",
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
	<SearchTable :endpoint="endpoint" :cols="columns" class-name="Place"></SearchTable>
</template>
