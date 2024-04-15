<script setup lang="ts">
import * as d3 from "d3";

import type { TimelineObject } from "@/types/timeline";

const props = defineProps<{
	relations: Array<TimelineObject>;
}>();
const timelineDiv = ref();
let timelineWidth = ref(0);

let d3Transform = ref(d3.zoomIdentity);

// Fiter relations by start_date
const filteredRelations = computed<Array<TimelineObject>>(() =>
	props.relations.filter((r): r is TimelineObject => Boolean(r.start_date)),
);
//type guard to filter grouped relations
function isValidTimelineObject(
	entry: Array<TimelineObject> | TimelineObject | undefined,
): entry is TimelineObject | [TimelineObject, ...Array<TimelineObject>] {
	return entry !== undefined && Array.isArray(entry) ? entry.length > 0 : true;
}
// Group relations by date
const groupedRelations = computed(() => {
	let groupedDict: Record<string, Array<TimelineObject>> = {};
	filteredRelations.value.forEach((r) => {
		if (!(r.start_date in groupedDict)) groupedDict[r.start_date] = [];
		groupedDict[r.start_date]?.push(r);
	});
	return Object.values(groupedDict)
		.map((arr) => (arr.length > 1 ? arr : arr[0]))
		.filter((arr): arr is TimelineObject | [TimelineObject, ...Array<TimelineObject>] =>
			isValidTimelineObject(arr),
		);
});

// Find min and max dates to determine scale
const minVal = computed(() => d3.min(filteredRelations.value.map((r) => new Date(r.start_date))));
const maxVal = computed(() => d3.max(filteredRelations.value.map((r) => new Date(r.start_date))));
const scale = computed(() =>
	d3Transform.value.rescaleX(
		d3
			.scaleTime([minVal.value ?? new Date(), maxVal.value ?? new Date()], [0, timelineWidth.value])
			.nice(),
	),
);

// @ts-expect-error d3 context vs selection error
const createAxis = () => d3.select("#AxisSvg").call(d3.axisBottom(scale.value).tickSizeInner(16));

// Add resize handler to monitor container width and adapt chart
function resizeHandler() {
	timelineWidth.value = timelineDiv.value?.clientWidth;
}
onMounted(() => {
	window.addEventListener("resize", resizeHandler);
	resizeHandler();
	d3.select("#timelineContainer").call(
		// @ts-expect-error d3 selection is incompatible with selection
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
		<svg id="AxisSvg" class="absolute -z-10 w-full"></svg>
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
