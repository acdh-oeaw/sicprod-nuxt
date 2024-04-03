<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";

import DetailPage from "@/components/detail-page.vue";

const t = useTranslations();
const route = useRoute();
const id = Number(route.params.id);

definePageMeta({
	title: "Pages.searchviews.person.title",
});

const { $api } = useNuxtApp();
const endpoint = $api.apis_api_ontology_person_retrieve;

const { data, isLoading } = useQuery({
	queryKey: [endpoint, id],
	queryFn: () => endpoint({ params: { id } }),
});
</script>

<template>
	<div v-if="isLoading">Loading...</div>
	<DetailPage v-else model="Person" :details-loading="isLoading">
		<template #head>
			<h1 class="text-2xl font-bold text-primary-700 xl:my-3 xl:text-4xl dark:text-inherit">
				{{ data.first_name }} {{ data.name }}
			</h1>
			<div
				class="mr-3 inline-block w-fit rounded-md bg-primary-200 px-3 py-1.5 text-xs font-semibold uppercase dark:bg-primary-900 dark:text-neutral-100"
			>
				{{ data.gender }}
			</div>
			<div
				class="inline-block w-fit rounded-md bg-primary-200 px-3 py-1.5 text-xs font-semibold uppercase dark:bg-primary-900 dark:text-neutral-100"
			>
				Sample Chip
			</div>
		</template>
		<template #base>
			<div class="col-span-2 my-2 border-t"></div>

			<span>{{ t("Pages.searchviews.person.born") }}:</span>

			<span>
				{{ data.start_date_written || data.start_date }}
			</span>

			<div class="col-span-2 my-2 border-t"></div>

			<span>{{ t("Pages.searchviews.person.died") }}:</span>
			<span>
				{{ data.end_date_written || data.end_date }}
			</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.person.gender") }}:</span>
			<span>{{ data.gender }}</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.person.alternative_names") }}:</span>
			<span>{{ data.alternative_label }}</span>
		</template>
	</DetailPage>
</template>
