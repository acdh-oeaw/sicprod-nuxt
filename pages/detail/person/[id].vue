<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";

import DetailPage from "@/components/detail-page.vue";
import FamilyTree from "@/components/family-tree.vue";
import ReferenceButton from "@/components/reference-button.vue";
import Timeline from "@/components/timeline.vue";
import Loader from "@/components/ui/loader.vue";
import { loadAndGroupRelations } from "@/lib/group-relations.ts";
import type { TimelineObject } from "@/types/timeline";

const t = useTranslations();
const localePath = useLocalePath();
const route = useRoute();
const id = Number(route.params.id);

definePageMeta({
	title: "Pages.searchviews.person.title",
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
	const res = Object.entries(data.value.relations.data)
		.map(([key, val]) =>
			val.map((entry) => {
				return { ...entry, class: key };
			}),
		)
		.flat()
		.filter((r): r is TimelineObject => Boolean(r.start_date))
		.sort((r) => new Date(String(r.start_date)).valueOf());
	return res;
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
			<span>{{ t("Pages.searchviews.person.alternative_names") }}:</span>
			<span>{{ data.entity.data?.alternative_label }}</span>
			<div v-if="sameAs.length > 0" class="col-span-2 my-2 border-t"></div>
			<span v-if="sameAs.length > 0">{{ t("Pages.searchviews.person.same_as") }}:</span>
			<span>
				<NuxtLink
					v-for="person in sameAs"
					:key="person.id"
					:to="localePath(`/detail/person/${person.id}`)"
					class="-ml-1 -mt-1 block p-1 hover:bg-primary-50 active:bg-primary-50 dark:hover:bg-primary-950 dark:active:bg-primary-950"
				>
					{{ person.name }}
				</NuxtLink>
			</span>

			<FamilyTree
				v-if="!data.relations.isLoading && needsFamilyTree"
				:relations="data.relations.data?.person"
				:name="`${data.entity.data?.first_name} ${data.entity.data?.name}`"
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
