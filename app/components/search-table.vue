<script lang="ts" setup>
import { ChevronRight, Search, XCircle } from "@lucide/vue";

import Loader from "#/app/components/ui/loader.vue";
import type { ModelString, PaginatedListResultType } from "#/app/types/resulttypes.d.ts";

interface ColumnEntry {
	key: string;
	label: string;
}

const props = defineProps<{
	cols: Array<ColumnEntry>;
	data: PaginatedListResultType | undefined;
	isFetching: boolean;
	pageNum: number;
	limitNum: number;
	type: ModelString;
}>();

const t = useTranslations();

const route = useRoute();

const columns = props.cols;

const getDetailLink = (id: string) => {
	return `/detail/${props.type}/${id}`;
};

function formatCell(hit: Record<string, unknown>, key: string) {
	const value = hit[key];
	if (!value) {
		return "";
	}

	return Array.isArray(value) ? value.join(", ") : String(value).replace(/ <.*?>/g, "");
}

const input = ref(route.query.q === undefined ? "" : String(route.query.q));
</script>

<template>
	<div class="relative mx-2 flex h-full flex-col md:gap-4">
		<div
			class="mb-4 grid h-10 w-full shrink-0 grid-cols-[auto_1fr_auto] items-center rounded-md border shadow-md md:my-4 md:h-12"
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
				class="h-full bg-transparent"
				:placeholder="t('ui.search-placeholder')"
				type="text"
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
		<div class="text-primary-950 dark:text-primary-200 relative">
			<Centered v-if="isFetching" class="mt-5">
				<Loader />
			</Centered>
		</div>
		<Pagination
			v-if="data && (data.next || data.previous)"
			:all="Number(data.count)"
			class="m-2"
			:limit="Number(data.limit) || limitNum"
			:page="pageNum"
		/>
		<div v-if="data" class="w-full max-w-full overflow-x-auto">
			<table
				class="min-w-full table-fixed"
				:class="{ 'text-neutral-300 dark:text-neutral-500': isFetching }"
			>
				<tr class="mr-6" :class="cols">
					<th
						v-for="col in columns"
						:key="String(col.key)"
						class="m-2 p-2 text-start font-semibold md:p-4"
					>
						<div v-if="col.label">
							{{ col.label }}
						</div>
					</th>
					<th class="m-2 p-2 text-start font-semibold md:p-4" />
				</tr>
				<template v-if="data !== null">
					<NuxtLinkLocale
						v-for="hit in data.results"
						:key="String(hit.id)"
						class="hover:bg-primary-50 active:bg-primary-50 dark:hover:bg-primary-950 dark:active:bg-primary-950 table-row border-b md:border-t"
						:to="getDetailLink(String(hit.id || String(hit.id)?.replace(/\D/g, '')))"
					>
						<td
							v-for="col in columns"
							:key="col.key + hit.id"
							class="md:text-md m-2 overflow-auto p-2 text-start text-sm md:p-4"
						>
							{{ formatCell(hit, col.key) }}
						</td>
						<td class="md:text-md m-2 overflow-auto text-start align-middle text-sm">
							<ChevronRight class="size-6 shrink-0" />
						</td>
					</NuxtLinkLocale>
				</template>
			</table>
		</div>
		<Pagination
			v-if="data && (data.next || data.previous)"
			:all="Number(data.count)"
			class="m-2"
			:limit="Number(data.limit) || limitNum"
			:page="pageNum"
			:show-label="true"
		/>
	</div>
</template>
