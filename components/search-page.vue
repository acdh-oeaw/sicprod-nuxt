<script lang="ts" setup>
import SearchNavigation from "@/components/search-navigation.vue";
import type { PaginatedListResultType } from "@/types/resulttypes";

interface ColumnEntry {
	key: string;
	label: string;
}
const _props = defineProps<{
	className: string;
	endpoint: (
		queries?: Record<string, Record<string, number | string>> | undefined,
	) => Promise<PaginatedListResultType>;
	cols: Array<ColumnEntry>;
}>();
</script>

<template>
	<div class="h-full gap-4 md:mx-4 md:grid md:grid-cols-[2fr_6fr] md:grid-rows-[auto_1fr]">
		<SearchNavigation></SearchNavigation>
		<div class="xl:my-4">
			<SearchTable :endpoint="endpoint" :cols="cols" :class-name="className"></SearchTable>
		</div>
	</div>
</template>
