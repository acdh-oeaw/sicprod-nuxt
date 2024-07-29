<script setup lang="ts">
import { bgColors } from "@/lib/colors";
import type { TimelineObject } from "@/types/timeline";

const localePath = useLocalePath();

const props = defineProps<{
	position: string;
	item: TimelineObject | [TimelineObject, ...Array<TimelineObject>]; //ensure non-empty array
}>();

const startDate = computed(() => {
	if (Array.isArray(props.item))
		return (
			props.item
				.map((i) => new Date(i.start_date ?? "").valueOf())
				.reduce((prev, curr) => prev + curr) / props.item.length
		);
	else return new Date(props.item.start_date ?? "").valueOf();
});
const endDate = computed(() => {
	if (Array.isArray(props.item))
		return props.item.every((i) => i.end_date)
			? props.item
					.map((i) => new Date(i.end_date ?? "").valueOf())
					.reduce((prev, curr) => prev + curr) / props.item.length
			: null;
	else return props.item.end_date ? new Date(props.item.end_date).valueOf() : null;
});
const itemClass = computed(() => {
	if (Array.isArray(props.item)) {
		return new Set(props.item.map((i) => i.class)).size === 1 ? props.item[0].class : "mix";
	} else return props.item.class;
});
</script>

<template>
	<div
		class="relative w-1/2 py-4"
		:class="{
			'left-1/2': position === 'right',
		}"
	>
		<div
			class="absolute mx-auto size-5 rounded-full"
			:class="[position === 'left' ? '-right-2.5' : '-left-2.5', bgColors[itemClass]]"
		></div>
		<div
			class="min-w-48 -translate-y-1/2 p-4"
			:class="{
				'-left-2 mr-4': position === 'left',
				'-right-2 ml-4': position === 'right',
			}"
		>
			<div class="text-right text-sm text-neutral-500">
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
				<NuxtLink
					v-for="(i, idx) in item"
					:key="idx"
					:to="localePath(`/detail/${i.class}/${i.to.id}`)"
					class="flow-root rounded-md p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-none focus-visible:ring dark:hover:bg-neutral-900"
				>
					<span class="block text-sm text-neutral-500">
						{{ i.name }}
					</span>
					<span class="flex items-center">
						<span class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
							{{ i.to.name }}
						</span>
					</span>
				</NuxtLink>
			</div>
			<div v-else>
				<NuxtLink
					:to="localePath(`/detail/${item.class}/${item.to.id}`)"
					class="flow-root rounded-md p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-none focus-visible:ring dark:hover:bg-neutral-900"
				>
					<span class="block text-sm text-neutral-500">
						{{ item.name }}
					</span>
					<span class="flex items-center">
						<span class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
							{{ item.to.name }}
						</span>
					</span>
				</NuxtLink>
			</div>
		</div>
	</div>
</template>
