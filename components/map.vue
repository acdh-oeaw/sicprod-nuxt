<script setup lang="ts">
import "maplibre-gl/dist/maplibre-gl.css";

import { Map, Marker, type TypedStyleLayer } from "maplibre-gl";
import { markRaw, onMounted, onUnmounted, ref } from "vue";

const mapContainer = ref();
const map = ref();

const props = defineProps<{
	latitude: number;
	longitude: number;
}>();

onMounted(() => {
	const initialState = { lng: props.longitude, lat: props.latitude, zoom: 7 };
	map.value = markRaw(
		new Map({
			attributionControl: false,
			container: mapContainer.value,
			style: "/assets/map-styles.json",
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom,
		}),
	);
	new Marker({
		color: "rgb(192, 132, 252)",
	})
		.setLngLat([props.longitude, props.latitude])
		.addTo(map.value);
	map.value.once("styledata", function () {
		map.value.getStyle().layers.map((layer: TypedStyleLayer) => {
			if (!("source-layer" in layer)) return;
			var filter = [
				"all",
				["any", ["!has", "start_decdate"], ["<=", "start_decdate", 1450]],
				["any", ["!has", "end_decdate"], [">=", "end_decdate", 1450]],
			];
			map.value.setFilter(layer.id, filter);
		});
	});
}),
	onUnmounted(() => {
		map.value?.remove();
	});
</script>

<template>
	<div class="relative col-span-2 h-64 w-full">
		<div ref="mapContainer" class="absolute size-full"></div>
		<div class="absolute bottom-0 right-0 bg-neutral-50/70 p-1 text-xs dark:bg-neutral-900/70">
			1450,
			<a href="https://www.openhistoricalmap.org/copyright" target="_blank" class="hover:underline">
				&copy; OpenHistoricalMap
			</a>
		</div>
	</div>
</template>
