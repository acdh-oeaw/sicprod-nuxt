<script setup lang="ts">
import { ChevronUp } from "lucide-vue-next";
import type { RouteLocationNormalized } from "vue-router";

const route: RouteLocationNormalized = useRoute();

defineProps<{
	page: number;
	limit: number;
	all: number;
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
				class="rounded hover:bg-slate-200 active:bg-slate-300 cursor-pointer border p-2 transition"
			>
				<ChevronUp class="size-5 -rotate-90" />
				<span class="sr-only">{{ t("ui.prev-page") }}</span>
			</div>
		</NuxtLink>
		<div v-else class="rounded text-gray-400 cursor-not-allowed border p-2 transition">
			<ChevronUp class="size-5 -rotate-90" />
			<span class="sr-only">{{ t("ui.first-page") }}</span>
		</div>
		<div v-if="all != 0">
			{{
				t("ui.showing-results", {
					first: (page - 1) * limit + 1,
					last: Math.min(page * limit, all),
					all,
				})
			}}
		</div>
		<div v-else class="italic">{{ t("ui.no-results") }}</div>
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
				class="rounded hover:bg-slate-200 active:bg-slate-300 cursor-pointer border p-2 transition"
			>
				<ChevronUp class="size-5 rotate-90" />
				<span class="sr-only">{{ t("ui.next-page") }}</span>
			</div>
		</NuxtLink>

		<div v-else class="rounded cursor-not-allowed border p-2 transition">
			<ChevronUp class="text-gray-400 size-5 rotate-90" />
			<span class="sr-only">{{ t("ui.last-page") }}</span>
		</div>
	</div>
</template>
