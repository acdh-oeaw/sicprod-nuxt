<script lang="ts" setup>
import SearchPage from "@/components/search-page.vue";

const t = useTranslations();

usePageMetadata({
	title: t("Pages.searchviews.institution.title"),
});

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
	<SearchPage class-name="Institution" :cols="columns" :endpoint="endpoint" type="institution">
		<h1 class="sr-only">{{ t("SearchInstitutionsPage.title") }}</h1>
	</SearchPage>
</template>
