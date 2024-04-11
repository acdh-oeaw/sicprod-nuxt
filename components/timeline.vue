<script setup lang="ts">
import * as d3 from "d3";

import type { SimplifiedRelationType } from "@/lib/create-api-client";

const props = defineProps<{
	relations: Array<SimplifiedRelationType>;
}>();
const timelineDiv = ref(null);
let timelineWidth = ref(0);

let d3Transform = ref(d3.zoomIdentity);

// Fiter relations by start_date
const filteredRelations = computed(() => props.relations.filter((r) => r.start_date));
// Group relations by date
const groupedRelations = computed(() => {
	let groupedDict: Record<string, SimplifiedRelationType> = {};
	filteredRelations.value.forEach((r) => {
		if (!(r.start_date in groupedDict)) groupedDict[r.start_date] = [];
		groupedDict[r.start_date].push(r);
	});
	return Object.values(groupedDict).map((arr) => (arr.length > 1 ? arr : arr[0]));
});

// Find min and max dates to determine scale
const minVal = computed(() => d3.min(filteredRelations.value.map((r) => new Date(r.start_date))));
const maxVal = computed(() => d3.max(filteredRelations.value.map((r) => new Date(r.start_date))));
const scale = computed(() =>
	d3Transform.value.rescaleX(
		d3.scaleTime([minVal.value, maxVal.value], [0, timelineWidth.value]).nice(),
	),
);
const createAxis = () => d3.select("#AxisSvg").call(d3.axisBottom(scale.value).tickSizeInner(16));

// Add resize handler to monitor container width and adapt chart
function resizeHandler() {
	timelineWidth.value = timelineDiv.value?.clientWidth;
}
onMounted(() => {
	window.addEventListener("resize", resizeHandler);
	resizeHandler();
	d3.select("#timelineContainer").call(
		d3.zoom().on("zoom", (d) => {
			d3Transform.value = d.transform;
			createAxis();
		}),
	);
	createAxis();
});
onBeforeUnmount(() => {
	window.removeEventListener("resize", resizeHandler);
});
</script>

<template>
	<div id="timelineContainer" class="relative my-8 max-w-full overflow-x-clip py-8">
		<div ref="timelineDiv" class="h-0.5 w-full bg-neutral-300"></div>
		<svg id="AxisSvg" class="absolute w-full"></svg>
		<div>
			<TimelineEntry
				v-for="(r, idx) in groupedRelations"
				:key="idx"
				:item="r"
				:scale="scale"
			></TimelineEntry>
		</div>
	</div>
</template>

<style>
.domain {
	color: transparent;
}

.tick {
	font-size: 14px;
}

.tick line {
	color: hsl(var(--color-neutral-300));
}
</style>
