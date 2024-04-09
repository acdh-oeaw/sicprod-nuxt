<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

const bgColors = {
	event: "bg-event-500",
	function: "bg-function-500",
	person: "bg-person-500",
	place: "bg-place-500",
	institution: "bg-institution-500",
	salary: "bg-salary-500",
	mix: "bg-neutral-300",
};

interface TimelineObject {
	start_date: string;
	end_date: string;
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
const itemClass = computed(() => {
	if (Array.isArray(props.item)) {
		return new Set(props.item.map((i) => i.class)).size === 1
			? props.item[0]?.class ?? "mix"
			: "mix";
	} else return props.item.class;
});
console.log(props.item);
</script>

<template>
	<Popover class="relative">
		<PopoverButton
			class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-300 text-sm"
			:style="{ left: `${scale(startDate)}px`, top: '-1px' }"
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
				class="absolute z-10 mt-3 -translate-x-1/2 px-4 sm:px-0 lg:max-w-3xl"
				:style="{ left: `${scale(startDate)}px` }"
			>
				<div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
					<div v-if="Array.isArray(item)" class="bg-neutral-50 p-4">
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
					<div v-else class="bg-neutral-50 p-4">
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
