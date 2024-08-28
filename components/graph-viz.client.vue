<script setup lang="ts">
import chroma from "chroma-js";
import type Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import { Sigma } from "sigma";

const props = defineProps<{
	graph: Graph;
}>();

const edgeAlpha = 0.05;
const networkContainer = ref<HTMLElement>();

function initSigma() {
	if (!process.client) return;
	if (!networkContainer.value) return;
	const sensibleSettings = forceAtlas2.inferSettings(props.graph);
	const layout = new FA2Layout(props.graph, { settings: sensibleSettings });
	layout.start();
	new Sigma(props.graph, networkContainer.value, {
		allowInvalidContainer: true,
		edgeReducer: (_, attr) => {
			attr.color = chroma(attr.color || "#000000")
				.alpha(edgeAlpha)
				.hex();
			return attr;
		},
	});
}
onMounted(() => {
	void nextTick(initSigma);
});
</script>

<template>
	<div id="networkContainer" ref="networkContainer" class="size-full"></div>
</template>
