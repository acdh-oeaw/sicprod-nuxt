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

definePageMeta({
	title: "Pages.searchviews.institution.title",
});

const { $api } = useNuxtApp();
const detailsEndpoint = "apis_api_apis_ontology.institution_retrieve";
const relationsEndpoint = "apis_api_apis_ontology.institution_relations_list";

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

const maxChipCount = 3;
const chipNames = computed(() => {
	if (data.value.relations.isLoading) return [];
	const fNames = [...new Set(data.value.relations.data?.place?.map((f) => f.to.name))];
	if (fNames.length <= maxChipCount) return fNames;
	const truncatedChipNames = [
		...fNames.slice(0, maxChipCount),
		t("DetailPage.andOthers", { count: fNames.length - maxChipCount }),
	];
	return truncatedChipNames;
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
	<DetailPage v-else model="Institution">
		<template #head>
			<h1 class="text-2xl text-neutral-800 xl:my-3 xl:text-4xl dark:text-inherit">
				{{ data.entity.data?.name }}
			</h1>
			<div class="flex justify-between">
				<div>
					<div
						v-for="f in chipNames"
						:key="f"
						class="mr-3 inline-block w-fit rounded-md bg-place-200 px-3 py-1.5 text-xs font-semibold uppercase dark:bg-place-900 dark:text-neutral-100"
					>
						{{ f }}
					</div>
				</div>
				<ReferenceButton
					v-if="Number(data.entity.data?.references?.length) > 0"
					:references="data.entity.data?.references"
					class="ml-auto inline-block size-7 w-fit"
					popup-position="left"
				></ReferenceButton>
			</div>
		</template>
		<template #base>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.institution.start_date") }}:</span>
			<span>
				{{ String(data.entity.data?.start_date_written || "").replace(/\<.*?\>/g, "") }}
			</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.institution.end_date") }}:</span>
			<span>
				{{ String(data.entity.data?.end_date_written || "").replace(/\<.*?\>/g, "") }}
			</span>
			<template v-if="Number(data.entity.data?.alternative_label?.length) > 0">
				<div class="col-span-2 my-2 border-t"></div>
				<span>{{ t("Pages.searchviews.person.alternative_names") }}:</span>
				<div>
					<span v-for="name in data.entity.data?.alternative_label" :key="name" class="block">
						{{ name }}
					</span>
				</div>
			</template>
		</template>
		<template #right>
			<div v-if="data.entity.data" class="flex flex-col gap-3">
				<DetailDisclosure
					v-if="data.entity.data?.relation_types.includes('person')"
					:title="t('Pages.searchviews.person.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data.relations.data?.person"
					:details-loading="data.relations.isLoading"
					model="person"
				/>
				<DetailDisclosure
					v-if="data.entity.data?.relation_types.includes('function')"
					:title="t('Pages.searchviews.function.label')"
					:headers="['to.name', 'start_date_written', 'end_date_written']"
					:rels="data.relations.data?.function"
					:details-loading="data.relations.isLoading"
					model="function"
				/>
				<DetailDisclosure
					v-if="data.entity.data?.relation_types.includes('institution')"
					:title="t('Pages.searchviews.institution.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data.relations.data?.institution"
					:details-loading="data.relations.isLoading"
					model="institution"
				/>
				<DetailDisclosure
					v-if="data.entity.data?.relation_types.includes('place')"
					:title="t('Pages.searchviews.place.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations.data?.place"
					:details-loading="data.relations.isLoading"
					model="place"
				/>
				<DetailDisclosure
					v-if="data.entity.data?.relation_types.includes('event')"
					:title="t('Pages.searchviews.event.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations.data?.event"
					:details-loading="data.relations.isLoading"
					model="event"
				/>
				<DetailDisclosure
					v-if="data.entity.data?.relation_types.includes('salary')"
					:title="t('Pages.searchviews.salary.label')"
					:headers="['name', 'to.name', 'start_date_written', 'end_date_written']"
					:rels="data?.relations.data?.salary"
					:details-loading="data.relations.isLoading"
					model="salary"
				/>
			</div>
		</template>
		<template #bottom>
			<Timeline v-if="!data.relations.isLoading" :relations="flattenedRelations"></Timeline>
		</template>
	</DetailPage>
</template>
