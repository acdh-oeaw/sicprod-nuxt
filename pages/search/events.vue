<script lang="ts" setup>
import SearchPage from "@/components/search-page.vue";

definePageMeta({
	title: "Pages.searchviews.event.title",
});
const t = useTranslations();

const { $api } = useNuxtApp();
const endpoint = $api["apis_api_apis_ontology.event_list"];

const columns = [
	{
		key: "name",
		label: t("Pages.searchviews.event.name"),
		sortable: true,
	},
	{
		key: "start_date_written",
		label: t("Pages.searchviews.event.start_date"),
		sortable: true,
	},
	{
		key: "end_date_written",
		label: t("Pages.searchviews.event.end_date"),
		sortable: true,
	},
	{
		key: "type",
		label: t("Pages.searchviews.event.type"),
		sortable: true,
	},
];
</script>

<template>
	<SearchPage class-name="Event" :cols="columns" :endpoint="endpoint"></SearchPage>
</template>
