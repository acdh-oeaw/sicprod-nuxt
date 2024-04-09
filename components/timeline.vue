<script setup lang="ts">
import * as d3 from "d3";

import type { SimplifiedRelationType } from "@/lib/create-api-client";

const props = defineProps<{
	relations: Array<SimplifiedRelationType>;
}>();
const timelineDiv = ref(null);
let timelineWidth = ref(0);

function resizeHandler() {
	timelineWidth.value = timelineDiv.value?.clientWidth;
}

onMounted(() => {
	window.addEventListener("resize", resizeHandler);
	resizeHandler();
});
onBeforeUnmount(() => {
	window.removeEventListener("resize", resizeHandler);
});

const filteredRelations = computed(() => props.relations.filter((r) => r.start_date));
const minVal = computed(() => d3.min(filteredRelations.value.map((r) => new Date(r.start_date))));
const maxVal = computed(() => d3.max(filteredRelations.value.map((r) => new Date(r.start_date))));

const scale = computed(() => d3.scaleTime([minVal.value, maxVal.value], [0, timelineWidth.value]));

const groupedRelations = computed(() => {
	let groupedDict: Record<string, SimplifiedRelationType> = {};
	filteredRelations.value.forEach((r) => {
		if (!(r.start_date in groupedDict)) groupedDict[r.start_date] = [];
		groupedDict[r.start_date].push(r);
	});
	return Object.values(groupedDict).map((arr) => (arr.length > 1 ? arr : arr[0]));
});
</script>

<template>
	<div class="relative my-16">
		<div ref="timelineDiv" class="h-0.5 w-full bg-neutral-300"></div>
		<TimelineEntry v-for="(r, idx) in groupedRelations" :key="idx" :item="r" :scale="scale">
		</TimelineEntry>
	</div>
</template>
