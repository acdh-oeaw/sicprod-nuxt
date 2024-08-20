<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { SquareGanttChart } from "lucide-vue-next";

import DetailPage from "@/components/detail-page.vue";
import Timeline from "@/components/timeline/timeline.vue";
import VerticalTimeline from "@/components/timeline/vertical-timeline.vue";
import Loader from "@/components/ui/loader.vue";
import { loadAndGroupRelations } from "@/lib/group-relations.ts";
import { getFlattenedRelations } from "@/utils/timeline-utils";

const t = useTranslations();
const route = useRoute();
const id = Number(route.params.id);

definePageMeta({
	title: "Pages.searchviews.function.title",
});

const { $api } = useNuxtApp();
const detailsEndpoint = "apis_api_apis_ontology.function_retrieve";
const relationsEndpoint = "apis_api_apis_ontology.function_relations_list";

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
	const fNames = [...new Set(data.value.relations.data?.institution?.map((f) => f.to.name))];
	if (fNames.length <= maxChipCount) return fNames;
	const truncatedchipNames = [
		...fNames.slice(0, maxChipCount),
		t("DetailPage.andOthers", { count: fNames.length - maxChipCount }),
	];
	return truncatedchipNames;
});
const flattenedRelations = computed(() => {
	if (!data.value.relations.data) return [];
	return getFlattenedRelations(data.value.relations.data);
});
const showVerticalTimeline = ref(false);
function closeVerticalTimeline() {
	showVerticalTimeline.value = false;
}
function openVerticalTimeline() {
	showVerticalTimeline.value = true;
}
const needsFamilyTree = computed(() => {
	if (!data.value.relations.data) return false;

	const functionRelationNames = [
		"ist untergeordnet",
		"hat untergeordnete Funktion",
		"ist verbunden mit",
	];
	return Boolean(
		data.value.relations.data.function?.find((r) => functionRelationNames.includes(r.name)),
	);
});
</script>

<template>
	<div v-if="data.entity.isLoading" class="relative">
		<Centered>
			<Loader />
		</Centered>
	</div>
	<DetailPage v-else model="Function">
		<template #head>
			<h1 class="text-2xl text-neutral-800 xl:my-3 xl:text-4xl dark:text-inherit">
				{{ data.entity.data?.name }}
			</h1>
			<div class="flex justify-between">
				<div>
					<div
						v-for="f in chipNames"
						:key="f"
						class="mr-3 inline-block w-fit rounded-md bg-institution-200 px-3 py-1.5 text-xs font-semibold uppercase dark:bg-institution-900 dark:text-neutral-100"
					>
						{{ f }}
					</div>
				</div>
				<div class="ml-auto flex gap-2">
					<ReferenceButton
						v-if="Number(data.entity.data?.references?.length) > 0"
						:references="data.entity.data?.references"
						class="ml-auto inline-block size-7 w-fit"
						popup-position="left"
					></ReferenceButton>
					<button
						v-if="flattenedRelations.length > 0"
						class="group w-fit scale-90 items-center rounded-md font-medium text-neutral-600 transition-transform hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 dark:text-neutral-200"
						:title="t('Timeline.timeline')"
						@click="openVerticalTimeline"
					>
						<span class="sr-only">{{ t("Timeline.timeline") }}</span>
						<SquareGanttChart />
					</button>
				</div>
				<VerticalTimeline
					v-if="!data.relations.isLoading"
					:is-open="showVerticalTimeline"
					:close-modal="closeVerticalTimeline"
					:relations="flattenedRelations"
				></VerticalTimeline>
			</div>
		</template>
		<template #base>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.function.start_date") }}:</span>
			<span>
				{{ String(data.entity.data?.start_date_written || "").replace(/\<.*?\>/g, "") }}
			</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.function.end_date") }}:</span>
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
			<FamilyTree
				v-if="!data.relations.isLoading && needsFamilyTree"
				:relations="data.relations.data?.function"
				:name="`${data.entity.data?.name}`"
				:relation-names="{
					ancestor: 'ist untergeordnet',
					child: 'hat untergeordnete Funktion',
					sibling: 'ist verbunden mit',
					partner: '',
				}"
				classname-for-urls="function"
				:collapse-threshold="Infinity"
				:legend-names="{
					descendantOf: 'FamilyTree.subordinate-function',
					sibling: 'FamilyTree.connected-function',
				}"
				:icons="{
					sibling: '/assets/icons/connected.svg',
				}"
				class="col-span-2 mt-8"
			/>
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
					:headers="['name', 'to.name']"
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
