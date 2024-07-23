<script lang="ts" setup>
import SearchPage from "@/components/search-page.vue";

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
		key: "type",
		label: t("Pages.searchviews.institution.type"),
		sortable: true,
	},
];
</script>

<template>
	<SearchPage :endpoint="endpoint" :cols="columns" class-name="Institution"></SearchPage>
</template>
