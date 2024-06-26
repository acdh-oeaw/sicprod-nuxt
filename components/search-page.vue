<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";

import Facet from "@/components/facet.vue";
import SearchNavigation from "@/components/search-navigation.vue";
import type { FacetType, PaginatedListResultType } from "@/types/resulttypes";

const t = useTranslations();
const route = useRoute();
const router = useRouter();

interface ColumnEntry {
	key: string;
	label: string;
}
const props = defineProps<{
	className: string;
	endpoint: (
		queries?: Record<string, Record<string, number | string>> | undefined,
	) => Promise<PaginatedListResultType>;
	cols: Array<ColumnEntry>;
}>();

// Fetching data from APIS
const pageLimit = 25;
const pageNum = computed(() => {
	return Number(route.query.page) || 1;
});
const limitNum = computed(() => {
	return Number(route.query.limit) || pageLimit;
});
const comQuery = computed(() => {
	const query = route.query;
	return {
		q: String(query.q ?? ""),
		filter_by: String(query.facets ?? ""),
		page: pageNum.value,
		per_page: limitNum.value || pageLimit,
		sort_by: String(query.sort ?? ""),
		related_entity: String(query.related_entity ?? ""),
		gender: String(query.gender ?? ""),
		type: String(query.type ?? ""),
	};
});
const { data, isFetching } = useQuery({
	queryKey: ["search", props.className, comQuery] as const,
	queryFn: async () => {
		let optionalQueryParams = Object.fromEntries(
			Object.entries({
				gender: comQuery.value.gender,
				type: comQuery.value.type,
			}).filter(([_k, v]) => v !== ""),
		);
		const response = await props.endpoint({
			queries: {
				offset: comQuery.value.per_page * (comQuery.value.page - 1),
				limit: comQuery.value.per_page,
				search: comQuery.value.q,
				related_entity: comQuery.value.related_entity,
				...optionalQueryParams,
			},
		});
		return response;
	},
});

// Facets
function hasMatchingFacetType(val: unknown): val is Record<string, FacetType> {
	return (
		val != null &&
		Object.values(val as Record<string, FacetType>).length > 0 &&
		Object.values(val as Record<string, FacetType>).every(
			(entry) => "name" in entry && "count" in entry,
		)
	);
}
const relationFacets = computed(() => {
	let facetObject: Record<string, Array<FacetType>> = {};

	if (!data.value) return facetObject;
	Object.entries(data.value.facets).forEach(([key, value]) => {
		if (key.startsWith("related_") && hasMatchingFacetType(value)) {
			facetObject[key] = Object.entries(value)
				.map(([k, v]) => {
					return { ...v, id: k };
				})
				.sort((a, b) => b.count - a.count);
		}
	});
	return facetObject;
});
const relationFacetSelection = ref<Record<string, Array<FacetType>>>({});

// class-specific facets such as gender and type
const classFacets = computed(() => {
	let facetObject: Record<string, Array<FacetType>> = {};
	if (!data.value) return facetObject;
	Object.entries(data.value.facets).forEach(([key, value]) => {
		if (!key.startsWith("related_") && hasMatchingFacetType(value)) {
			facetObject[key] = Object.entries(value)
				.filter(([_, v]) => v.name !== "")
				.map(([k, v]) => {
					return { ...v, id: k };
				})
				.sort((a, b) => b.count - a.count);
		}
	});
	return facetObject;
});
const classFacetSelection = ref<Record<string, Array<FacetType>>>({});

// Update route when facet selection changes
async function updateRouter() {
	await router.replace({
		query: {
			...route.query,
			related_entity: Object.values(relationFacetSelection.value)
				.flat()
				.map((entry) => entry.id)
				.filter((entry) => entry)
				.join(","),
			page: 1,
			...Object.fromEntries(
				Object.entries(classFacetSelection.value).map(([key, value]) => [
					key,
					value.map((v) => v.name).join(","),
				]),
			),
		},
	});
}
watch(
	classFacetSelection,
	(selection) => (Object.keys(selection).length > 0 ? updateRouter() : null),
	{ deep: true },
);
watch(
	relationFacetSelection,
	(selection) => (Object.keys(selection).length > 0 ? updateRouter() : null),
	{ deep: true },
);

// Update selection arrays when facets change
watch(relationFacets, () => {
	if (Object.keys(relationFacets.value).some((key) => !(key in relationFacetSelection.value)))
		initFacetSelection();
});
watch(classFacets, () => {
	if (Object.keys(classFacets.value).some((key) => !(key in classFacetSelection.value)))
		initFacetSelection();
});
const initFacetSelection = () => {
	Object.keys(relationFacets.value).forEach((k) => (relationFacetSelection.value[k] = []));
	Object.keys(classFacets.value).forEach((k) => (classFacetSelection.value[k] = []));
};
</script>

<template>
	<div class="h-full gap-4 md:mx-4 md:grid md:grid-cols-[auto_4fr_auto] md:grid-rows-[auto_1fr]">
		<div>
			<SearchNavigation></SearchNavigation>
			<div class="mt-10">
				<div v-for="(value, key) in classFacets" :key="key" class="mx-2 w-72 md:mb-10 lg:mx-4">
					<h2 class="text-lg">{{ t(`Pages.searchviews.facets.${key}`) }}</h2>
					<Facet v-model="classFacetSelection[key]" :options="value ?? []"></Facet>
				</div>
			</div>
		</div>
		<div class="xl:my-4">
			<SearchTable
				:endpoint="endpoint"
				:cols="cols"
				:class-name="className"
				:data="data"
				:is-fetching="isFetching"
				:page-num="pageNum"
				:limit-num="limitNum"
			></SearchTable>
		</div>
		<div class="px-4 md:mt-8">
			<div v-for="(value, key) in relationFacets" :key="key" class="mx-2 w-72 md:mb-10 lg:mx-4">
				<h2 class="text-lg">{{ t(`Pages.searchviews.facets.${key}`) }}</h2>
				<Facet v-model="relationFacetSelection[key]" :options="value ?? []"></Facet>
			</div>
		</div>
	</div>
</template>
