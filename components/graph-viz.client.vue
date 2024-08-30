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
const localePath = useLocalePath();
const router = useRouter();

function initSigma() {
	if (!process.client) return;
	if (!networkContainer.value) return;
	const height = networkContainer.value.clientHeight - 1;
	const width = networkContainer.value.clientWidth - 1;
	const myGraph = ForceGraph();
	forcegraph.value = myGraph(networkContainer.value)
		.graphData(props.graph)
		.linkColor(() => "#cccccc30")
		.warmupTicks(100)
		.cooldownTicks(10)
		.height(height)
		.width(width)
		.onNodeClick((node) => {
			//@ts-expect-error unknown property class
			const path = localePath(`/detail/${node.class}/${node.id}`);
			void router.push(path);
		});

	forcegraph.value.d3Force(
		"charge",
		//@ts-expect-error unknown property val
		d3.forceManyBody().strength((node) => -node.val * 15),
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
	<div id="networkContainer" ref="networkContainer" class="size-full overflow-hidden"></div>
</template>
