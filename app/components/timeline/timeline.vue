<script setup lang="ts">
import "d3-time-format"; // für die Locale-Funktionen

import type { TimeLocaleDefinition } from "d3";
import * as d3 from "d3";

import type { TimelineObject } from "@/types/timeline";
import { groupTimelineRelations } from "@/utils/timeline-utils";

import TimelineEntry from "./timeline-entry.vue";

const props = defineProps<{
	relations: Array<TimelineObject>;
}>();
const timelineDiv = ref();
const timelineWidth = ref(0);

const deDE = {
	dateTime: "%A, der %e. %B %Y, %X",
	date: "%d.%m.%Y",
	time: "%H:%M:%S",
	periods: ["AM", "PM"],
	days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
	shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
	months: [
		"Januar",
		"Februar",
		"März",
		"April",
		"Mai",
		"Juni",
		"Juli",
		"August",
		"September",
		"Oktober",
		"November",
		"Dezember",
	],
	shortMonths: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
} as TimeLocaleDefinition;

// Setze die Locale
d3.timeFormatDefaultLocale(deDE);
const d3Transform = ref(d3.zoomIdentity);

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
	const min = minVal.value;
	const max = maxVal.value;
	if (min?.valueOf() === max?.valueOf()) {
		min?.setFullYear(min.getFullYear() - 1);
		max?.setFullYear(max.getFullYear() + 1);
	}
	return d3Transform.value.rescaleX(
		d3.scaleTime([min ?? new Date(), max ?? new Date()], [0, timelineWidth.value]).nice(2),
	);
});
const customTickFormat = (date: Date) => {
	const formatDay = d3.timeFormat("%d. %b"); // "24. Mär"
	const formatMonth = d3.timeFormat("%B"); // "Mär 2024"
	const formatYear = d3.timeFormat("%Y"); // "2024"

	// Wenn das Datum innerhalb des gleichen Jahres ist
	if (d3.timeYear(date) < date) {
		// Wenn es innerhalb des gleichen Monats ist
		if (d3.timeMonth(date) < date) {
			return formatDay(date); // Verwende das Tag-Format
		} else {
			return formatMonth(date); // Verwende das Monatsformat
		}
	} else {
		return formatYear(date); // Verwende das Jahresformat
	}
};
const createAxis = () =>
	d3
		.select("#AxisSvg")

		// @ts-expect-error d3 context vs selection error
		.call(d3.axisBottom(scale.value).tickFormat(customTickFormat).tickSizeInner(16));

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
