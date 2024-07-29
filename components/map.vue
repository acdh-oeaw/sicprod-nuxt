<script setup lang="ts">
// import { Pin } from "lucide-vue-next";

const zoom = ref(7);

defineProps<{
	latitude: number;
	longitude: number;
}>();
</script>

<template>
	<div id="container" class="-z-10 aspect-video w-full">
		<LMap ref="map" :zoom="zoom" :center="[latitude, longitude]" :use-global-leaflet="false">
			<LTileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
				layer-type="base"
				name="OpenStreetMap"
			/>
			<LMarker :lat-lng="[latitude, longitude]" />
		</LMap>
	</div>
</template>
