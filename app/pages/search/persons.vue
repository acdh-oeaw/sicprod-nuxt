<script lang="ts" setup>
import SearchPage from "@/components/search-page.vue";

const t = useTranslations();

usePageMetadata({
	title: t("Pages.searchviews.person.title"),
});

const api = useApiClient();
const endpoint = api["apis_api_apis_ontology.person_list"];

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
	<main class="max-w-[100dvw]">
		<SearchPage class-name="Person" :cols="columns" :endpoint="endpoint" type="person">
			<h1 class="sr-only">{{ t("SearchPersonsPage.title") }}</h1>
		</SearchPage>
	</main>
</template>
