<script setup lang="ts">
import * as d3 from "d3";

import type { TimelineObject } from "@/types/timeline";
import { groupTimelineRelations } from "@/utils/timeline-utils";

import TimelineEntry from "./timeline-entry.vue";

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

// Group relations by date
const groupedRelations = computed(() => groupTimelineRelations(filteredRelations.value));

// Find min and max dates to determine scale
const minVal = computed(() =>
	d3.min(filteredRelations.value.map((r) => new Date(r.start_date ?? ""))),
);
const maxVal = computed(() =>
	d3.max(filteredRelations.value.map((r) => new Date(r.start_date ?? ""))),
);
const scale = computed(() => {
	let min = minVal.value;
	let max = maxVal.value;
	if (min?.valueOf() === max?.valueOf()) {
		min?.setFullYear(min.getFullYear() - 1);
		max?.setFullYear(max.getFullYear() + 1);
	}
	return d3Transform.value.rescaleX(
		d3.scaleTime([min ?? new Date(), max ?? new Date()], [0, timelineWidth.value]).nice(2),
	);
});

const createAxis = () =>
	// @ts-expect-error d3 context vs selection error
	d3.select("#AxisSvg").call(d3.axisBottom(scale.value).tickSizeInner(16));

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
	<div
		v-if="groupedRelations.length > 0"
		id="timelineContainer"
		class="relative z-[1001] my-8 max-w-full overflow-x-clip py-8"
	>
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
