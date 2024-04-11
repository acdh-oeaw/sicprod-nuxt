<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

const bgColors = {
	event: "bg-event-500",
	function: "bg-function-400",
	person: "bg-person-500",
	place: "bg-place-500",
	institution: "bg-institution-500",
	salary: "bg-salary-500",
	mix: "bg-neutral-400",
};

interface TimelineObject {
	start_date: string;
	start_date_written: string;
	end_date: string;
	end_date_written: string;
	class: "event" | "function" | "institution" | "person" | "place" | "salary";
	name: string;
	to: {
		name: string;
	};
}

const props = defineProps<{
	item: Array<TimelineObject> | TimelineObject;
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
	if (endDate.value && endDate.value !== startDate.value)
		return {
			width: `${props.scale(endDate.value) - props.scale(startDate.value)}px`,
			height: "5px",
			position: "relative",
		};
	else
		return {
			width: "",
			height: "",
			position: "",
		};
});
const itemClass = computed(() => {
	if (Array.isArray(props.item)) {
		return new Set(props.item.map((i) => i.class)).size === 1
			? props.item[0]?.class ?? "mix"
			: "mix";
	} else return props.item.class;
});
</script>

<template>
	<Popover class="relative">
		<PopoverButton
			class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full text-sm ring-1 ring-white/20"
			:style="{
				left: `${scale(startDate)}px`,
				top: '-1px',
				width: dimensions.width,
				height: dimensions.height,
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
					class="max-h-52 min-w-48 overflow-auto rounded-lg bg-neutral-50 p-4 shadow-lg ring-1 ring-black/5"
					@wheel.stop
				>
					<div class="text-right text-sm">
						<span v-if="endDate && startDate != endDate">
							{{
								(Array.isArray(item) ? item[0].end_date_written : item.end_date_written).replace(
									/\<.*?\>/g,
									"",
								)
							}}
							- </span
						><span>
							{{
								(Array.isArray(item)
									? item[0].start_date_written
									: item.start_date_written
								).replace(/\<.*?\>/g, "")
							}}</span
						>
					</div>
					<div v-if="Array.isArray(item)">
						<div
							v-for="(i, idx) in item"
							:key="idx"
							class="flow-root rounded-md p-2 transition duration-150 ease-in-out focus:outline-none focus-visible:ring"
						>
							<span class="block text-sm text-neutral-500">
								{{ i.name }}
							</span>
							<span class="flex items-center">
								<span class="text-sm font-medium text-neutral-900"> {{ i.to.name }} </span>
							</span>
						</div>
					</div>
					<div v-else>
						<div
							class="flow-root rounded-md p-2 transition duration-150 ease-in-out focus:outline-none focus-visible:ring"
						>
							<span class="block text-sm text-neutral-500">
								{{ item.name }}
							</span>
							<span class="flex items-center">
								<span class="text-sm font-medium text-neutral-900"> {{ item.to.name }} </span>
							</span>
						</div>
					</div>
				</div>
			</PopoverPanel>
		</Transition>
	</Popover>
</template>
