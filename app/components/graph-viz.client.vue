<script setup lang="ts">
import * as d3 from "d3-force";
import ForceGraph, { type ForceGraphInstance, type LinkObject, type NodeObject } from "force-graph";

const props = defineProps<{
	graph: {
		nodes: Array<NodeObject>;
		links: Array<LinkObject>;
	};
	nodeDistance: number;
}>();
const forcegraph = ref<ForceGraphInstance>();
const networkContainer = ref<HTMLElement>();
const localePath = useLocalePath();
const router = useRouter();

const highlightedLinks = ref<Set<LinkObject>>(new Set());
const highlightedNodes = ref<Set<NodeObject>>(new Set());

function initSigma() {
	if (!import.meta.client) {
		return;
	}

	if (!networkContainer.value) {
		return;
	}

	const height = networkContainer.value.clientHeight - 1;
	const width = networkContainer.value.clientWidth - 1;
	const myGraph = ForceGraph();
	forcegraph.value = myGraph(networkContainer.value)
		.graphData(props.graph)
		.linkColor((link) => {
			return highlightedLinks.value.has(link) ? "#aaaaaa" : "#cccccc30";
		})
		.nodeColor((node) => {
			return highlightedNodes.value.size === 0
				? //@ts-expect-error unknown property color
					`${node.color}d0`
				: highlightedNodes.value.has(node)
					? //@ts-expect-error unknown property color
						node.color
					: //@ts-expect-error unknown property color
						`${node.color}55`;
		})
		.warmupTicks(100)
		.cooldownTicks(0)
		.autoPauseRedraw(false)
		.height(height)
		.width(width)
		.onNodeClick((node) => {
			//@ts-expect-error unknown property class
			const path = localePath(`/detail/${node.class}/${node.id}`);
			void router.push(path);
		})
		.onNodeHover((node) => {
			highlightedNodes.value.clear();
			highlightedLinks.value.clear();
			if (node) {
				myGraph
					.graphData()
					.links.filter((link) => {
						return link.source === node || link.target === node;
					})
					.forEach((link) => {
						return highlightedLinks.value.add(link);
					});
				highlightedLinks.value.forEach((link) => {
					highlightedNodes.value.add(link.target as NodeObject);
					highlightedNodes.value.add(link.source as NodeObject);
				});
			}
		});
	forcegraph.value.d3Force(
		"collide",
		//@ts-expect-error unknown property val
		d3.forceCollide((node) => {
			return Math.sqrt(node.val) * forcegraph.value?.nodeRelSize() * 1.1;
		}),
	);
	forcegraph.value.d3Force(
		"charge",
		//@ts-expect-error unknown property val
		d3.forceManyBody().strength((node) => {
			return -node.val * props.nodeDistance;
		}),
	);
	forcegraph.value.onEngineStop(() => {
		forcegraph.value?.zoomToFit(400);
		forcegraph.value?.cooldownTicks(100);
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		forcegraph.value?.onEngineStop(() => {});
	});
}
onMounted(() => {
	void nextTick(initSigma);
});
watch(
	() => {
		return props.graph;
	},
	() => {
		forcegraph.value?.graphData(props.graph);

		forcegraph.value?.d3ReheatSimulation();
	},
);
watch(
	() => {
		return props.nodeDistance;
	},
	() => {
		forcegraph.value?.d3Force(
			"charge",
			//@ts-expect-error unknown property val
			d3.forceManyBody().strength((node) => {
				return -node.val * props.nodeDistance;
			}),
		);
		forcegraph.value?.d3ReheatSimulation();
	},
);
</script>

<template>
	<div id="networkContainer" ref="networkContainer" class="size-full overflow-hidden" />
</template>
