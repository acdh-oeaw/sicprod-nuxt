<script lang="ts" setup>
import SearchPage from "@/components/search-page.vue";

const t = useTranslations();

usePageMetadata({
	title: t("Pages.searchviews.event.title"),
});

const api = useApiClient();
const endpoint = api["apis_api_apis_ontology.event_list"];

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
	<main class="max-w-[100dvw]">
		<SearchPage class-name="Event" :cols="columns" :endpoint="endpoint" type="event">
			<h1 class="sr-only">{{ t("SearchEventsPage.title") }}</h1>
		</SearchPage>
	</main>
</template>
