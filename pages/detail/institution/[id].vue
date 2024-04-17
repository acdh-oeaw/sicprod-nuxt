<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";

import DetailPage from "@/components/detail-page.vue";
import Timeline from "@/components/timeline.vue";
import type { SimplifiedRelationType } from "@/lib/create-api-client";
import type { TimelineObject } from "@/types/timeline";

const t = useTranslations();
const route = useRoute();
const id = Number(route.params.id);

definePageMeta({
	title: "Pages.searchviews.institution.title",
});

const { $api } = useNuxtApp();
const endpoint = $api.apis_api_ontology_institution_retrieve;

const { data, isLoading } = useQuery({
	queryKey: [endpoint, id],
	queryFn: () => endpoint({ params: { id } }),
});

const maxFunctionCount = 3;
const functionNames = computed(() => {
	if (isLoading.value) return [];
	const fNames = [...new Set(data.value?.relations.function?.map((f) => f.to.name))];
	if (fNames.length <= maxFunctionCount) return fNames;
	const truncatedFunctionNames = [
		...fNames.slice(0, maxFunctionCount),
		t("DetailPage.andOthers", { count: fNames.length - maxFunctionCount }),
	];
	return truncatedFunctionNames;
});
const flattenedRelations = computed(() => {
	if (isLoading.value) return [];
	const res = Object.entries(data.value?.relations as Record<string, Array<SimplifiedRelationType>>)
		.map(([key, val]) =>
			val.map((entry) => {
				return { ...entry, class: key };
			}),
		)
		.flat()
		.filter((r): r is TimelineObject => Boolean(r.start_date))
		.sort((r) => new Date(r.start_date).valueOf());
	return res;
});
</script>

<template>
	<div v-if="isLoading">Loading...</div>
	<DetailPage v-else model="Institution" :details-loading="isLoading">
		<template #head>
			<h1 class="text-2xl font-bold text-primary-700 xl:my-3 xl:text-4xl dark:text-inherit">
				{{ data?.first_name }} {{ data?.name }}
			</h1>
			<div
				v-for="f in functionNames"
				:key="f"
				class="mr-3 inline-block w-fit rounded-md bg-function-200 px-3 py-1.5 text-xs font-semibold uppercase dark:bg-function-900 dark:text-neutral-100"
			>
				{{ f }}
			</div>
		</template>
		<template #base>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.institution.start_date") }}:</span>
			<span>
				{{ String(data?.start_date_written || data?.start_date || "").replace(/\<.*?\>/g, "") }}
			</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.institution.end_date") }}:</span>
			<span>
				{{ String(data?.end_date_written || data?.end_date || "").replace(/\<.*?\>/g, "") }}
			</span>
			<!-- <div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.institution.gender") }}:</span>
			<span>{{ data?.gender }}</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.institution.alternative_names") }}:</span>
			<span>{{ data?.alternative_label }}</span> -->
		</template>
		<template #right>
			<div v-if="data" class="flex flex-col gap-3">
				<DetailDisclosure
					v-if="data?.relations?.event"
					:title="t('Pages.searchviews.event.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations?.event"
					model="event"
				/>
				<DetailDisclosure
					v-if="data?.relations?.function"
					:title="t('Pages.searchviews.function.label')"
					:headers="['to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations?.function"
					model="function"
				/>
				<DetailDisclosure
					v-if="data?.relations?.institution"
					:title="t('Pages.searchviews.institution.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations?.institution"
					model="institution"
				/>
				<DetailDisclosure
					v-if="data?.relations?.person"
					:title="t('Pages.searchviews.person.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations?.person"
					model="person"
				/>
				<DetailDisclosure
					v-if="data?.relations?.place"
					:title="t('Pages.searchviews.place.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations?.place"
					model="place"
				/>
				<DetailDisclosure
					v-if="data?.relations?.salary"
					:title="t('Pages.searchviews.salary.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations?.salary"
					model="salary"
				/>
			</div>
		</template>
		<template #bottom>
			<Timeline :relations="flattenedRelations"></Timeline>
		</template>
	</DetailPage>
</template>
