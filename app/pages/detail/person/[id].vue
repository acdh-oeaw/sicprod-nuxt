<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { SquareGanttChart } from "lucide-vue-next";

import DetailPage from "@/components/detail-page.vue";
import FamilyTree from "@/components/family-tree.vue";
import ReferenceButton from "@/components/reference-button.vue";
import Timeline from "@/components/timeline/timeline.vue";
import VerticalTimeline from "@/components/timeline/vertical-timeline.vue";
import Loader from "@/components/ui/loader.vue";
import { loadAndGroupRelations } from "@/lib/group-relations.ts";
import { getFlattenedRelations } from "@/utils/timeline-utils";

const t = useTranslations();
const localePath = useLocalePath();

const route = useRoute();
const id = Number(route.params.id);

usePageMeta({
	title: t("Pages.searchviews.person.title"),
});

const { $api } = useNuxtApp();
const detailsEndpoint = "apis_api_apis_ontology.person_retrieve";
const relationsEndpoint = "apis_api_apis_ontology.person_relations_list";

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

const maxFunctionCount = 3;
const functionNames = computed(() => {
	if (data.value.relations.isLoading) return [];
	const fNames = [...new Set(data.value.relations.data?.function?.map((f) => f.to.name))];
	if (fNames.length <= maxFunctionCount) return fNames;
	const truncatedFunctionNames = [
		...fNames.slice(0, maxFunctionCount),
		t("DetailPage.andOthers", { count: fNames.length - maxFunctionCount }),
	];
	return truncatedFunctionNames;
});
const flattenedRelations = computed(() => {
	if (!data.value.relations.data) return [];
	return getFlattenedRelations(data.value.relations.data);
});

const sameAs = computed(() => {
	if (!data.value.relations.data) return [];
	return (
		data.value.relations.data.person
			?.filter((r) => r.name === "ist möglicherweise identisch mit")
			.map((r) => r.to) ?? []
	);
});

const needsFamilyTree = computed(() => {
	if (!data.value.relations.data) return false;

	const familyRelationNames = [
		"ist Kind von",
		"ist Elternteil von",
		"ist Bruder/Schwester von",
		"hat Ehe mit",
	];
	return Boolean(
		data.value.relations.data.person?.find((r) => familyRelationNames.includes(r.name)),
	);
});

const showVerticalTimeline = ref(false);
function closeVerticalTimeline() {
	showVerticalTimeline.value = false;
}
function openVerticalTimeline() {
	showVerticalTimeline.value = true;
}

const initialAltNames = 3;
const showAltNames = ref(initialAltNames);
const showAltNamesLabel = ref("DetailPage.showAllEntries");
function toggleShowAltNames() {
	if (showAltNames.value === initialAltNames) {
		showAltNames.value = Math.max(
			initialAltNames,
			data.value.entity.data?.alternative_label.length ?? 0,
		);
		showAltNamesLabel.value = "DetailPage.hideEntries";
	} else {
		showAltNames.value = Math.min(
			initialAltNames,
			data.value.entity.data?.alternative_label.length ?? 0,
		);
		showAltNamesLabel.value = "DetailPage.showAllEntries";
	}
}
</script>

<template>
	<div v-if="data.entity.isLoading" class="relative">
		<Centered>
			<Loader />
		</Centered>
	</div>
	<DetailPage v-else model="Person">
		<template #head>
			<h1 class="text-2xl text-neutral-800 xl:my-3 xl:text-4xl dark:text-inherit">
				{{ data.entity.data?.first_name }} {{ data.entity.data?.name }}
			</h1>
			<div class="flex justify-between">
				<div>
					<div
						v-for="f in functionNames"
						:key="f"
						class="mr-3 inline-block w-fit rounded-md bg-function-200 px-3 py-1.5 text-xs font-semibold uppercase dark:bg-function-900 dark:text-neutral-100"
					>
						{{ f }}
					</div>
				</div>
				<div class="ml-auto flex gap-2">
					<ReferenceButton
						v-if="Number(data.entity.data?.references?.length) > 0"
						class="size-7 w-fit"
						popup-position="left"
						:references="data.entity.data?.references"
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
					:close-modal="closeVerticalTimeline"
					:is-open="showVerticalTimeline"
					:relations="flattenedRelations"
				></VerticalTimeline>
			</div>
		</template>
		<template #base>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.person.born") }}:</span>
			<span>
				{{ String(data.entity.data?.start_date_written || "").replace(/\<.*?\>/g, "") }}
			</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.person.died") }}:</span>
			<span>
				{{ String(data.entity.data?.end_date_written || "").replace(/\<.*?\>/g, "") }}
			</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.person.gender") }}:</span>
			<span>{{ data.entity.data?.gender }}</span>
			<div class="col-span-2 my-2 border-t"></div>
			<span>{{ t("Pages.searchviews.person.status") }}:</span>
			<span>
				{{ data.entity.data?.status }}
			</span>
			<template v-if="Number(data.entity.data?.alternative_label?.length) > 0">
				<div class="col-span-2 my-2 border-t"></div>
				<span>{{ t("Pages.searchviews.person.alternative_names") }}:</span>
				<div>
					<span
						v-for="name in data.entity.data?.alternative_label.slice(0, showAltNames)"
						:key="name"
						class="block"
					>
						{{ name }}
					</span>
					<button
						v-if="(data.entity.data?.alternative_label.length ?? 0) > initialAltNames"
						class="mt-3 text-sm"
						@click="toggleShowAltNames"
					>
						{{ t(showAltNamesLabel, { count: data.entity.data?.alternative_label.length }) }}
					</button>
				</div>
			</template>
			<template v-if="sameAs.length > 0">
				<div class="col-span-2 my-2 border-t"></div>
				<span>{{ t("Pages.searchviews.person.same_as") }}:</span>
				<span>
					<NuxtLink
						v-for="person in sameAs"
						:key="person.id"
						class="-ml-1 -mt-1 block p-1 hover:bg-primary-50 active:bg-primary-50 dark:hover:bg-primary-950 dark:active:bg-primary-950"
						:to="localePath(`/detail/person/${person.id}`)"
					>
						{{ person.name }}
					</NuxtLink>
				</span>
			</template>
			<FamilyTree
				v-if="!data.relations.isLoading && needsFamilyTree"
				class="col-span-2 mt-8"
				:name="`${data.entity.data?.first_name} ${data.entity.data?.name}`"
				:relations="data.relations.data?.person"
			/>
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
