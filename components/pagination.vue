<script setup lang="ts">
import { ChevronUp } from "lucide-vue-next";
import type { RouteLocationNormalized } from "vue-router";

const route: RouteLocationNormalized = useRoute();

defineProps<{
	page: number;
	limit: number;
	all: number;
	showLabel?: boolean;
}>();

const t = useTranslations();
</script>

<template>
	<div class="flex items-center justify-between">
		<NuxtLink
			v-if="page > 1"
			data-testid="prevPage"
			:to="{
				query: {
					...route.query,
					page: page - 1,
				},
			}"
		>
			<div
				class="cursor-pointer rounded-md border p-2 transition hover:bg-primary-50 active:bg-primary-50 md:border-t dark:hover:bg-primary-950 dark:active:bg-primary-950"
			>
				<ChevronUp class="size-5 -rotate-90" />
				<span class="sr-only">{{ t("ui.prev-page") }}</span>
			</div>
		</NuxtLink>
		<div v-else class="cursor-not-allowed rounded-md border p-2 text-neutral-400 transition">
			<ChevronUp class="size-5 -rotate-90" />
			<span class="sr-only">{{ t("ui.first-page") }}</span>
		</div>
		<div v-if="all != 0 && showLabel" class="m-1 text-sm md:text-md">
			{{
				t("ui.showing-results", {
					first: (page - 1) * limit + 1,
					last: Math.min(page * limit, all),
					all,
				})
			}}
		</div>
		<div v-else-if="showLabel" class="italic">{{ t("ui.no-results") }}</div>
		<NuxtLink
			v-if="page * limit < Number(all)"
			data-testid="nextPage"
			:to="{
				query: {
					...route.query,
					page: page + 1,
				},
			}"
		>
			<div
				class="cursor-pointer rounded-md border p-2 transition hover:bg-primary-50 active:bg-primary-50 md:border-t dark:hover:bg-primary-950 dark:active:bg-primary-950"
			>
				<ChevronUp class="size-5 rotate-90" />
				<span class="sr-only">{{ t("ui.next-page") }}</span>
			</div>
		</NuxtLink>

		<div v-else class="cursor-not-allowed rounded-md border p-2 transition">
			<ChevronUp class="size-5 rotate-90 text-neutral-400" />
			<span class="sr-only">{{ t("ui.last-page") }}</span>
		</div>
	</div>
</template>
