<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { ChevronRight, Loader2, Search, XCircle } from "lucide-vue-next";

import type { PaginatedListResultType } from "@/lib/create-api-client";

interface ColumnEntry {
	key: string;
	label: string;
}
const locale = useLocale();
const t = useTranslations();
const route = useRoute();

const props = defineProps<{
	className: string;
	endpoint: (
		queries?: Record<string, Record<string, number | string>> | undefined,
	) => Promise<PaginatedListResultType>;
	cols: Array<ColumnEntry>;
}>();

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
	};
});

const columns = props.cols;

const { data, isFetching } = useQuery({
	queryKey: ["search", props.className, comQuery] as const,
	queryFn: async () => {
		const response = await props.endpoint({
			queries: {
				offset: comQuery.value.per_page * (comQuery.value.page - 1),
				limit: comQuery.value.per_page,
				name__icontains: comQuery.value.q,
			},
		});
		return response;
	},
});
const getDetailLink = (id: string) => {
	const type = route.path.split("/")[3];
	return `/${locale.value}/detail/${type}/${id}`;
};

const input = ref(route.query.q === undefined ? "" : String(route.query.q));
</script>

<template>
	<div class="relative mx-2 flex h-full flex-col gap-4">
		<div
			class="mb-4 grid h-12 w-full shrink-0 grid-cols-[auto_1fr_auto] items-center rounded-md border shadow-md xl:my-4"
		>
			<label for="searchinput">
				<Search class="mx-3 size-5 shrink-0 text-neutral-500" />
				<span class="sr-only">
					{{ t("ui.search-placeholder") }}
				</span>
			</label>
			<input
				id="searchinput"
				v-model="input"
				type="text"
				class="h-full bg-transparent"
				:placeholder="t('ui.search-placeholder')"
				@input="
					$router.replace({
						query: {
							...route.query,
							q: input,
							page: 1,
						},
					})
				"
			/>
			<button
				v-if="input"
				@click="
					$router.replace({
						query: {
							...route.query,
							q: '',
							page: 1,
						},
					});
					input = '';
				"
			>
				<span class="sr-only">Delete Input</span>
				<XCircle class="mx-2 size-6 text-neutral-500" />
			</button>
		</div>
		<Pagination
			v-if="data && (data.next || data.previous)"
			class="m-2"
			:page="pageNum"
			:limit="Number(data.limit) || limitNum"
			:all="Number(data.count)"
		/>
		<table v-if="!isFetching && data" class="mx-2 table-fixed">
			<tr class="mr-6" :class="cols">
				<th v-for="col in columns" :key="String(col.key)" class="m-2 p-4 text-start font-semibold">
					<div v-if="col.label">
						{{ col.label }}
					</div>
				</th>
			</tr>
			<template v-if="data !== null">
				<NuxtLink
					v-for="hit in data.results"
					:key="String(hit.id)"
					class="table-row border-b hover:bg-primary-50 active:bg-primary-50 md:border-t dark:hover:bg-primary-950 dark:active:bg-primary-950"
					:to="getDetailLink(String(hit.id || String(hit.id)?.replace(/\D/g, '')))"
				>
					<td
						v-for="col in columns"
						:key="col.key + hit.id"
						class="m-2 overflow-auto p-4 text-start"
					>
						<span v-if="hit[col.key]">
							{{ String(hit[col.key])?.replace(/ \<.*?\>/g, "") }}
						</span>
					</td>
					<td class="m-2 overflow-auto p-4 text-start align-middle">
						<ChevronRight class="size-6 shrink-0" />
					</td>
				</NuxtLink>
			</template>
		</table>
		<Centered v-else>
			<Loader2 class="size-8 animate-spin" />
		</Centered>
		<Pagination
			v-if="data && (data.next || data.previous)"
			class="m-2"
			:page="pageNum"
			:limit="Number(data.limit) || limitNum"
			:all="Number(data.count)"
		/>
	</div>
</template>