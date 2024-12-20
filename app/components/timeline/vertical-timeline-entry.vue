<script setup lang="ts">
import { bgColors } from "@/lib/colors";
import type { TimelineObject } from "@/types/timeline";

import ReferenceButton from "../reference-button.vue";

const props = defineProps<{
	position: string;
	item: TimelineObject | [TimelineObject, ...Array<TimelineObject>]; //ensure non-empty array
}>();

const startDate = computed(() => {
	if (Array.isArray(props.item)) {
		return (
			props.item
				.map((i) => {
					return new Date(i.start_date ?? "").valueOf();
				})
				.reduce((prev, curr) => {
					return prev + curr;
				}) / props.item.length
		);
	} else {
		return new Date(props.item.start_date ?? "").valueOf();
	}
});
const endDate = computed(() => {
	if (Array.isArray(props.item)) {
		return props.item.every((i) => {
			return i.end_date;
		})
			? props.item
					.map((i) => {
						return new Date(i.end_date ?? "").valueOf();
					})
					.reduce((prev, curr) => {
						return prev + curr;
					}) / props.item.length
			: null;
	} else {
		return props.item.end_date ? new Date(props.item.end_date).valueOf() : null;
	}
});
const itemClass = computed(() => {
	if (Array.isArray(props.item)) {
		return new Set(
			props.item.map((i) => {
				return i.class;
			}),
		).size === 1
			? props.item[0].class
			: "mix";
	} else {
		return props.item.class;
	}
});
</script>

<template>
	<div
		class="relative w-1/2"
		:class="{
			'left-1/2': position === 'right',
		}"
	>
		<div
			class="absolute mx-auto size-5 rounded-full"
			:class="[position === 'left' ? '-right-2.5' : '-left-2.5', bgColors[itemClass]]"
		/>
		<div
			class="min-w-48 -translate-y-4 p-4"
			:class="{
				'-left-2 mr-4': position === 'left',
				'-right-2 ml-4': position === 'right',
			}"
		>
			<div
				class="text-sm text-neutral-800 dark:text-neutral-300"
				:class="{
					'-mr-4 text-right': position === 'left',
					'-ml-4 text-left': position === 'right',
				}"
			>
				<span>
					{{
						(
							(Array.isArray(item) ? item[0].start_date_written : item.start_date_written) ?? ""
						).replace(/\<.*?\>/g, "")
					}}
				</span>
				<span v-if="endDate && startDate != endDate">
					-
					{{
						(
							(Array.isArray(item) ? item[0].end_date_written : item.end_date_written) ?? ""
						).replace(/\<.*?\>/g, "")
					}}
				</span>
			</div>
			<div v-if="Array.isArray(item)">
				<NuxtLinkLocale
					v-for="(i, idx) in item"
					:key="idx"
					class="flow-root rounded-md p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-none focus-visible:ring dark:hover:bg-neutral-900"
					:to="`/detail/${i.class}/${i.to.id}`"
				>
					<div class="flex items-center justify-between text-sm text-neutral-500">
						{{ i.name }}
						<ReferenceButton
							v-if="i.references.length > 0"
							class="inline-block size-4 text-neutral-900 dark:text-neutral-100"
							:references="i.references"
						/>
					</div>
					<span>
						<span class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
							{{ i.to.name }}
						</span>
					</span>
				</NuxtLinkLocale>
			</div>
			<div v-else>
				<NuxtLinkLocale
					class="flow-root rounded-md p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-none focus-visible:ring dark:hover:bg-neutral-900"
					:to="`/detail/${item.class}/${item.to.id}`"
				>
					<div class="flex items-center justify-between text-sm text-neutral-500">
						{{ item.name }}
						<ReferenceButton
							v-if="item.references.length > 0"
							class="inline-block size-4 text-neutral-900 dark:text-neutral-100"
							:references="item.references"
						/>
					</div>
					<span>
						<span class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
							{{ item.to.name }}
						</span>
					</span>
				</NuxtLinkLocale>
			</div>
		</div>
	</div>
</template>
