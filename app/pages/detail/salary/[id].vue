<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";

import DetailPage from "@/components/detail-page.vue";
import Timeline from "@/components/timeline/timeline.vue";
import Loader from "@/components/ui/loader.vue";
import { loadAndGroupRelations } from "@/lib/group-relations.ts";
import { getFlattenedRelations } from "@/utils/timeline-utils";

const t = useTranslations();

const route = useRoute();
const id = Number(route.params.id);

usePageMetadata({
	title: t("Pages.searchviews.salary.title"),
});

const { $api } = useNuxtApp();
const detailsEndpoint = "apis_api_apis_ontology.salary_retrieve";
const relationsEndpoint = "apis_api_apis_ontology.salary_relations_list";

const data = ref({
	entity: useQuery({
		queryKey: [detailsEndpoint, id],
		queryFn: () => $api[detailsEndpoint]({ params: { id } }),
	}),
	relations: useQuery({
		queryKey: [relationsEndpoint, id],
		queryFn: () =>
			loadAndGroupRelations($api[relationsEndpoint], {
				params: { id: String(id) },
			}),
	}),
});

const flattenedRelations = computed(() => {
	if (!data.value.relations.data) return [];
	return getFlattenedRelations(data.value.relations.data);
});
</script>

<template>
	<div v-if="data.entity.isLoading" class="relative">
		<Centered>
			<Loader />
		</Centered>
	</div>
	<DetailPage v-else model="Salary">
		<template #head>
			<h1 class="text-2xl text-neutral-800 xl:my-3 xl:text-4xl dark:text-inherit">
				{{ data.entity.data?.name }}
			</h1>
			<div class="flex justify-between">
				<div
					v-if="data.entity.data?.repetitionType"
					class="mr-3 inline-block w-fit rounded-md bg-salary-200 px-3 py-1.5 text-xs font-semibold uppercase dark:bg-salary-900 dark:text-neutral-100"
				>
					{{ data.entity.data?.repetitionType }}
				</div>
				<ReferenceButton
					v-if="Number(data.entity.data?.references?.length) > 0"
					class="ml-auto inline-block size-7 w-fit"
					popup-position="left"
					:references="data.entity.data?.references"
				></ReferenceButton>
			</div>
		</template>
		<template #base>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.salary.type") }}:</span>
			<span>
				{{ data.entity.data?.typ }}
			</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.salary.repetition_type") }}:</span>
			<span>
				{{ data.entity.data?.repetitionType }}
			</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.salary.start_date") }}:</span>
			<span>
				{{ String(data.entity.data?.start_date_written || "").replace(/\<.*?\>/g, "") }}
			</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.salary.end_date") }}:</span>
			<span>
				{{ String(data.entity.data?.end_date_written || "").replace(/\<.*?\>/g, "") }}
			</span>
			<div class="col-span-2 my-2 border-t"></div>
		</template>
		<template #right>
			<div v-if="data.entity.data" class="flex flex-col gap-3">
				<DetailDisclosure
					v-if="data.entity.data?.relation_types.includes('person')"
					:details-loading="data.relations.isLoading"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					model="person"
					:rels="data.relations.data?.person"
					:title="t('Pages.searchviews.person.label')"
				/>
				<DetailDisclosure
					v-if="data.entity.data?.relation_types.includes('function')"
					:details-loading="data.relations.isLoading"
					:headers="['to.name', 'start_date_written', 'end_date_written']"
					model="function"
					:rels="data.relations.data?.function"
					:title="t('Pages.searchviews.function.label')"
				/>
				<DetailDisclosure
					v-if="data.entity.data?.relation_types.includes('institution')"
					:details-loading="data.relations.isLoading"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					model="institution"
					:rels="data.relations.data?.institution"
					:title="t('Pages.searchviews.institution.label')"
				/>
				<DetailDisclosure
					v-if="data.entity.data?.relation_types.includes('place')"
					:details-loading="data.relations.isLoading"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					model="place"
					:rels="data?.relations.data?.place"
					:title="t('Pages.searchviews.place.label')"
				/>
				<DetailDisclosure
					v-if="data.entity.data?.relation_types.includes('event')"
					:details-loading="data.relations.isLoading"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					model="event"
					:rels="data?.relations.data?.event"
					:title="t('Pages.searchviews.event.label')"
				/>
				<DetailDisclosure
					v-if="data.entity.data?.relation_types.includes('salary')"
					:details-loading="data.relations.isLoading"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					model="salary"
					:rels="data?.relations.data?.salary"
					:title="t('Pages.searchviews.salary.label')"
				/>
			</div>
		</template>
		<template #bottom>
			<Timeline v-if="!data.relations.isLoading" :relations="flattenedRelations"></Timeline>
		</template>
	</DetailPage>
</template>
