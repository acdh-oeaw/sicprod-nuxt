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
	title: t("Pages.searchviews.institution.title"),
});

const { $api } = useNuxtApp();
const detailsEndpoint = "apis_api_apis_ontology.institution_retrieve";
const relationsEndpoint = "apis_api_apis_ontology.institution_relations_list";

const data = ref({
	entity: useQuery({
		queryKey: [detailsEndpoint, id],
		queryFn: () => {
			return $api[detailsEndpoint]({ params: { id } });
		},
	}),
	relations: useQuery({
		queryKey: [relationsEndpoint, id],
		queryFn: () => {
			return loadAndGroupRelations($api[relationsEndpoint], {
				params: { id: String(id) },
			});
		},
	}),
});

const maxChipCount = 3;
const chipNames = computed(() => {
	if (data.value.relations.isLoading) {
		return [];
	}
	const fNames = [
		...new Set(
			data.value.relations.data?.place?.map((f) => {
				return f.to.name;
			}),
		),
	];
	if (fNames.length <= maxChipCount) {
		return fNames;
	}
	const truncatedChipNames = [
		...fNames.slice(0, maxChipCount),
		t("DetailPage.andOthers", { count: fNames.length - maxChipCount }),
	];
	return truncatedChipNames;
});
const flattenedRelations = computed(() => {
	if (!data.value.relations.data) {
		return [];
	}
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
					class="ml-auto inline-block size-7 w-fit"
					popup-position="left"
					:references="data.entity.data?.references"
				/>
			</div>
		</template>
		<template #base>
			<div class="col-span-2 my-2 border-t" />
			<span>{{ t("Pages.searchviews.institution.start_date") }}:</span>
			<span>
				{{ String(data.entity.data?.start_date_written || "").replace(/\<.*?\>/g, "") }}
			</span>
			<div class="col-span-2 my-2 border-t" />
			<span>{{ t("Pages.searchviews.institution.end_date") }}:</span>
			<span>
				{{ String(data.entity.data?.end_date_written || "").replace(/\<.*?\>/g, "") }}
			</span>
			<template v-if="Number(data.entity.data?.alternative_label?.length) > 0">
				<div class="col-span-2 my-2 border-t" />
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
			<Timeline v-if="!data.relations.isLoading" :relations="flattenedRelations" />
		</template>
	</DetailPage>
</template>
