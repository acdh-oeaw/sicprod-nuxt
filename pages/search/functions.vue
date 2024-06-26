<script lang="ts" setup>
import SearchPage from "@/components/search-page.vue";

definePageMeta({
	title: "Pages.searchviews.function.title",
});
const t = useTranslations();

const { $api } = useNuxtApp();
const endpoint = $api["apis_api_apis_ontology.function_list"];

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
	<SearchPage :endpoint="endpoint" :cols="columns" class-name="Function"></SearchPage>
</template>
