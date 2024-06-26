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
	};
});
const { data, isFetching } = useQuery({
	queryKey: ["search", props.className, comQuery] as const,
	queryFn: async () => {
		const response = await props.endpoint({
			queries: {
				offset: comQuery.value.per_page * (comQuery.value.page - 1),
				limit: comQuery.value.per_page,
				search: comQuery.value.q,
				related_entity: comQuery.value.related_entity,
			},
		});
		return response;
	},
});

// Facets
const facets = computed(() => {
	let facetObject: Record<string, Array<FacetType>> = {};

	if (!data.value) return facetObject;
	Object.entries(data.value.facets).forEach(([key, value]) => {
		if (key.startsWith("related_")) {
			facetObject[key] = Object.entries(value as Record<string, FacetType>)
				.map(([k, v]) => {
					return { ...v, id: k };
				})
				.sort((a, b) => b.count - a.count);
		}
	});
	return facetObject;
});
const facetSelection = ref<Record<string, Array<FacetType>>>({});
const initFacetSelection = () => {
	Object.keys(facets.value).forEach((k) => (facetSelection.value[k] = []));
};

watch(
	facetSelection,
	(selection) =>
		Object.values(selection).flat().length > 0
			? router.replace({
					query: {
						...route.query,
						related_entity: Object.values(selection)
							.flat()
							.map((entry) => entry.id)
							.filter((entry) => entry)
							.join(","),
						page: 1,
					},
				})
			: null,
	{ deep: true },
);
watch(facets, () => {
	if (Object.keys(facets.value).some((key) => !(key in facetSelection.value))) initFacetSelection();
});
</script>

<template>
	<div class="h-full gap-4 md:mx-4 md:grid md:grid-cols-[2fr_4fr_2fr] md:grid-rows-[auto_1fr]">
		<SearchNavigation></SearchNavigation>
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
			<div v-for="(value, key) in facets" :key="key" class="mx-auto w-72 md:mb-10">
				<h2 class="text-lg">{{ t(`Pages.searchviews.facets.${key}`) }}</h2>
				<Facet v-model="facetSelection[key]" :options="value ?? []"></Facet>
			</div>
		</div>
	</div>
</template>
