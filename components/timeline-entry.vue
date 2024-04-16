<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

import { bgColors } from "@/lib/colors";
import type { TimelineObject } from "@/types/timeline";

const localePath = useLocalePath();

const props = defineProps<{
	item: TimelineObject | [TimelineObject, ...Array<TimelineObject>]; //ensure non-empty array
	scale: (date: Date | number) => number;
}>();

const startDate = computed(() => {
	if (Array.isArray(props.item))
		return (
			props.item.map((i) => new Date(i.start_date).valueOf()).reduce((prev, curr) => prev + curr) /
			props.item.length
		);
	else return new Date(props.item.start_date).valueOf();
});
const endDate = computed(() => {
	if (Array.isArray(props.item))
		return props.item.every((i) => i.end_date)
			? props.item.map((i) => new Date(i.end_date).valueOf()).reduce((prev, curr) => prev + curr) /
					props.item.length
			: null;
	else return props.item.end_date ? new Date(props.item.end_date).valueOf() : null;
});
const dimensions = computed(() => {
	if (
		endDate.value &&
		endDate.value !== startDate.value &&
		props.scale(endDate.value) - props.scale(startDate.value) > 12
	)
		return {
			width: `${props.scale(endDate.value) - props.scale(startDate.value)}px`,
			height: "7px",
			position: "relative",
			zIndex: "0",
		};
	else
		return {
			width: "",
			height: "",
			position: "",
			zIndex: "2",
		};
});
const itemClass = computed(() => {
	if (Array.isArray(props.item)) {
		return new Set(props.item.map((i) => i.class)).size === 1 ? props.item[0].class : "mix";
	} else return props.item.class;
});
</script>

<template>
	<Popover class="relative">
		<PopoverButton
			class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full text-sm ring-1 ring-white/20 dark:ring-neutral-900/20"
			:style="{
				left: `${scale(startDate)}px`,
				top: '-1px',
				width: dimensions.width,
				height: dimensions.height,
				zIndex: dimensions.zIndex,
			}"
			:class="[bgColors[itemClass], Array.isArray(item) ? 'size-6' : 'size-3']"
			>{{ Array.isArray(item) ? item.length : "" }}</PopoverButton
		>
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="translate-y-1 opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0"
		>
			<PopoverPanel
				class="absolute mt-3 -translate-x-1/2 px-4 sm:px-0 lg:max-w-3xl"
				:style="{ left: `${scale(startDate)}px` }"
			>
				<div
					class="max-h-52 min-w-48 overflow-auto rounded-lg bg-neutral-50 p-4 shadow-lg ring-1 ring-black/5 dark:bg-neutral-800"
					@wheel.stop
				>
					<div class="text-right text-sm text-neutral-500">
						<span>
							{{
								(Array.isArray(item)
									? item[0].start_date_written
									: item.start_date_written
								).replace(/\<.*?\>/g, "")
							}}</span
						><span v-if="endDate && startDate != endDate">
							-
							{{
								(Array.isArray(item) ? item[0].end_date_written : item.end_date_written).replace(
									/\<.*?\>/g,
									"",
								)
							}}</span
						>
					</div>
					<div v-if="Array.isArray(item)">
						<NuxtLink
							v-for="(i, idx) in item"
							:key="idx"
							:to="localePath(`/detail/${i.class}s/${i.to.id}`)"
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
							:to="localePath(`/detail/${item.class}s/${item.to.id}`)"
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
			</PopoverPanel>
		</Transition>
	</Popover>
</template>
