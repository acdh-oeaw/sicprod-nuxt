<script lang="ts" setup>
import SearchPage from "@/components/search-page.vue";

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
		key: "alternative_label",
		label: t("Pages.searchviews.person.alternative_names"),
		sortable: true,
	},
];
</script>

<template>
	<SearchPage :endpoint="endpoint" :cols="columns" class-name="Person"></SearchPage>
</template>
