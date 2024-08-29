<script setup lang="ts">
import * as d3 from "d3-force";
import ForceGraph, { type ForceGraphInstance, type LinkObject, type NodeObject } from "force-graph";

const props = defineProps<{
	graph: {
		nodes: Array<NodeObject>;
		links: Array<LinkObject>;
	};
}>();
const forcegraph = ref<ForceGraphInstance>();
const networkContainer = ref<HTMLElement>();

function initSigma() {
	if (!process.client) return;
	if (!networkContainer.value) return;
	const myGraph = ForceGraph();
	forcegraph.value = myGraph(networkContainer.value)
		.graphData(props.graph)
		.linkColor(() => "#cccccc20")
		.warmupTicks(100)
		.cooldownTicks(10);

	forcegraph.value.d3Force(
		"charge",
		d3.forceManyBody().strength((node) => -node.val * 15),
		// .distanceMax(50),
	);
}
onMounted(() => {
	void nextTick(initSigma);
});
watch(
	() => props.graph,
	() => forcegraph.value?.graphData(props.graph),
);
</script>

<template>
	<div id="networkContainer" ref="networkContainer" class="size-full"></div>
</template>
