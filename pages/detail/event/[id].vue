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
	title: "Pages.searchviews.event.title",
});

const { $api } = useNuxtApp();
const endpoint = $api.apis_api_ontology_event_retrieve;

const { data, isLoading } = useQuery({
	queryKey: [endpoint, id],
	queryFn: () => endpoint({ params: { id } }),
});

const maxChipCount = 3;
const chipNames = computed(() => {
	if (isLoading.value) return [];
	const fNames = [...new Set(data.value?.relations.place?.map((f) => f.to.name))];
	if (fNames.length <= maxChipCount) return fNames;
	const truncatedChipNames = [
		...fNames.slice(0, maxChipCount),
		t("DetailPage.andOthers", { count: fNames.length - maxChipCount }),
	];
	return truncatedChipNames;
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
	<DetailPage v-else model="Event" :details-loading="isLoading">
		<template #head>
			<h1 class="text-2xl font-bold text-primary-700 xl:my-3 xl:text-4xl dark:text-inherit">
				{{ data?.first_name }} {{ data?.name }}
			</h1>
			<div
				v-for="f in chipNames"
				:key="f"
				class="mr-3 inline-block w-fit rounded-md bg-place-200 px-3 py-1.5 text-xs font-semibold uppercase dark:bg-place-900 dark:text-neutral-100"
			>
				{{ f }}
			</div>
		</template>
		<template #base>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.event.type") }}:</span>
			<span>
				{{ data?.type }}
			</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.event.start_date") }}:</span>
			<span>
				{{ String(data?.start_date_written || data?.start_date || "").replace(/\<.*?\>/g, "") }}
			</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.event.end_date") }}:</span>
			<span>
				{{ String(data?.end_date_written || data?.end_date || "").replace(/\<.*?\>/g, "") }}
			</span>
			<!-- <div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.event.gender") }}:</span>
			<span>{{ data?.gender }}</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.event.alternative_names") }}:</span>
			<span>{{ data?.alternative_label }}</span> -->
		</template>
		<template #right>
			<div v-if="data" class="flex flex-col gap-3">
				<DetailDisclosure
					v-if="data?.relations?.function"
					:title="t('Pages.searchviews.function.label')"
					:headers="['to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations?.function"
					model="function"
				/>
				<DetailDisclosure
					v-if="data?.relations?.person"
					:title="t('Pages.searchviews.person.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations?.person"
					model="person"
				/>
				<DetailDisclosure
					v-if="data?.relations?.institution"
					:title="t('Pages.searchviews.institution.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations?.institution"
					model="institution"
				/>
				<DetailDisclosure
					v-if="data?.relations?.place"
					:title="t('Pages.searchviews.place.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations?.place"
					model="place"
				/>
				<DetailDisclosure
					v-if="data?.relations?.event"
					:title="t('Pages.searchviews.event.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations?.event"
					model="event"
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
