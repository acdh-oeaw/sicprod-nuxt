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
	const facetQueries = Object.fromEntries(
		Object.entries(query).filter(([key, _value]) => key.startsWith("facet_")),
	);
	return {
		q: String(query.q ?? ""),
		filter_by: String(query.facets ?? ""),
		page: pageNum.value,
		per_page: limitNum.value || pageLimit,
		sort_by: String(query.sort ?? ""),
		...facetQueries,
	};
});
const { data, isFetching } = useQuery({
	queryKey: ["search", props.className, comQuery] as const,
	queryFn: async () => {
		const facetQueries = Object.fromEntries(
			Object.entries(comQuery.value).filter(
				([key, value]) => key.startsWith("facet_") && value !== "",
			),
		);
		const response = await props.endpoint({
			queries: {
				offset: comQuery.value.per_page * (comQuery.value.page - 1),
				limit: comQuery.value.per_page,
				search: comQuery.value.q,
				...facetQueries,
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
	const facetObject: Record<string, Array<FacetType>> = {};

	if (!data.value) return facetObject;
	Object.entries(data.value.facets).forEach(([key, value]) => {
		if (key.startsWith("relation_") && hasMatchingFacetType(value)) {
			facetObject[key] = Object.entries(value)
				.map(([k, v]) => {
					return { ...v, id: k };
				})
				.sort((a, b) => b.count - a.count);
		}
	});
	return facetObject;
});
const relationFacetSelection = ref<Record<string, Array<number | string>>>({});

// class-specific facets such as gender and type
const classFacets = computed(() => {
	const facetObject: Record<string, Array<FacetType>> = {};
	if (!data.value) return facetObject;
	Object.entries(data.value.facets).forEach(([key, value]) => {
		if (!key.startsWith("relation_") && hasMatchingFacetType(value)) {
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
const classFacetSelection = ref<Record<string, Array<number | string>>>({});

// Update route when facet selection changes
async function updateRouter() {
	const relationFacetQuery = Object.fromEntries(
		Object.entries(relationFacetSelection.value).map(([key, value]) => [
			`facet_${key}`,
			value.join(","),
		]),
	);
	const classFacetQuery = Object.fromEntries(
		Object.entries(classFacetSelection.value).map(([key, value]) => [
			`facet_${key}`,
			value.join(","),
		]),
	);
	await router.replace({
		query: {
			...route.query,
			page: 1,
			...classFacetQuery,
			...relationFacetQuery,
		},
	});
}
watch(
	classFacetSelection,
	(selection, oldSelection) =>
		Object.keys(selection).length > 0 || Object.keys(oldSelection).length > 0
			? updateRouter()
			: null,
	{ deep: true },
);
watch(
	relationFacetSelection,
	(selection, oldSelection) =>
		Object.keys(selection).length > 0 || Object.keys(oldSelection).length > 0
			? updateRouter()
			: null,
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
	Object.keys(relationFacets.value).forEach(
		(k) =>
			(relationFacetSelection.value[k] = Object.entries(comQuery.value)
				.filter(([key, value]) => key === `facet_${k}` && value !== "")
				.map(([_key, value]) => String(value).split(","))
				.flat()),
	);
	Object.keys(classFacets.value).forEach(
		(k) =>
			(classFacetSelection.value[k] = Object.entries(comQuery.value)
				.filter(([key, value]) => key === `facet_${k}` && value !== "")
				.map(([_key, value]) => String(value).split(","))
				.flat()),
	);
};

watch(
	() => route.query,
	() => {
		document.body.scrollTo(0, 0);
	},
);
</script>

<template>
	<slot />
	<div class="h-full gap-4 md:mx-4 md:grid md:grid-cols-[auto_4fr_auto] md:grid-rows-[auto_1fr]">
		<div>
			<SearchNavigation></SearchNavigation>
			<div class="mt-10">
				<div
					v-for="(value, key) in classFacets"
					:key="key"
					class="mb-5 w-full px-2 md:mb-10 md:w-72 md:px-0 lg:mx-4"
				>
					<h2 class="text-lg">{{ t(`Pages.searchviews.facets.${key}`) }}</h2>
					<Facet v-model="classFacetSelection[key]!" :options="value ?? []"></Facet>
				</div>
			</div>
		</div>
		<div class="xl:my-4">
			<SearchTable
				:cols="cols"
				:data="data"
				:is-fetching="isFetching"
				:limit-num="limitNum"
				:page-num="pageNum"
			></SearchTable>
		</div>
		<div class="w-full md:mx-4 md:mt-8">
			<div
				v-for="(value, key) in relationFacets"
				:key="key"
				class="mb-5 w-full px-2 md:mb-10 md:w-72 md:px-0"
			>
				<h2 class="text-lg">{{ t(`Pages.searchviews.facets.${key}`) }}</h2>
				<Facet v-model="relationFacetSelection[key]!" :options="value ?? []"></Facet>
			</div>
		</div>
	</div>
</template>
