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
		key: "alternative_label",
		label: t("Pages.searchviews.function.alternative_label"),
		sortable: true,
	},
];
</script>

<template>
	<SearchPage :endpoint="endpoint" :cols="columns" class-name="Function"></SearchPage>
</template>
