<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { useQuery } from "@tanstack/vue-query";
import type { LinkObject } from "force-graph";
import { Check, ChevronDown, Share2 } from "lucide-vue-next";

import { bgColors, colorCodes } from "@/lib/colors";
import { loadNetworkData } from "@/lib/load-network-data";
import type { NetworkEntry } from "@/types/resulttypes";

const t = useTranslations();

const { $api } = useNuxtApp();
const networkEndpoint = "apis_api_network_list";

const availableClasses = ["event", "function", "institution", "person", "place", "salary"] as const;

const selectedClasses = ref<Array<(typeof availableClasses)[number]>>(["institution", "function"]);
const { data, isLoading } = useQuery({
	queryKey: [networkEndpoint, selectedClasses],
	queryFn: () =>
		loadNetworkData($api[networkEndpoint], {
			queries: {
				limit: 5000,
				//@ts-expect-error apis_ontology mapping
				entities: selectedClasses.value.map((className) => `apis_ontology.${className}`),
			},
		}),
});

function getGraph(data: Array<NetworkEntry>, minDegree = 0) {
	let graph = {
		nodes: [] as Array<{
			id: string;
			name: string;
			val: number;
			color?: string;
			class?: string;
		}>,
		links: [] as Array<LinkObject>,
	};
	data.forEach((entity) => {
		if (entity.related_to.length >= minDegree)
			graph.nodes.push({
				id: String(entity.id),
				name: entity.name,
				val: entity.related_to.length,
				color: colorCodes[entity.type],
				class: entity.type,
			});
	});
	const edgeDict: Record<string, Array<string>> = {};
	data.flatMap((entity) => {
		if (entity.related_to.length >= minDegree)
			entity.related_to.forEach((target) => {
				if (entity.id < target) return;
				if (!(String(target) in edgeDict)) edgeDict[String(target)] = [];
				edgeDict[String(target)]?.push(`${entity.id}-${String(target)}`);
			});
	});
	const flattenedEdges = [
		...new Set(
			Object.entries(edgeDict)
				.filter(([key, _val]) => graph.nodes.find((n) => n.id === key))
				.flatMap(([_key, val]) => val),
		),
	];

	flattenedEdges.forEach((edge) => {
		graph.links.push({ source: edge.split("-")[0], target: edge.split("-")[1] });
	});
	return graph;
}
const minDegree = ref(1);
const maxDegree = computed(() =>
	Math.min(Math.max(...(data.value?.map((node) => node.related_to.length) ?? [1])), 10),
);
const graph = computed(() => getGraph(data.value ?? [], minDegree.value));
</script>

<template>
	<Centered v-if="isLoading"><Loader /></Centered>
	<div v-else class="relative size-full">
		<div
			class="absolute bottom-0 right-2 z-10 mb-2 mt-1 rounded-lg bg-white/70 p-2 dark:bg-neutral-900/70"
		>
			<Listbox v-model="selectedClasses" multiple>
				<div class="relative">
					<Transition
						leave-active-class="transition duration-100 ease-in"
						leave-from-class="opacity-100"
						leave-to-class="opacity-0"
					>
						<ListboxOptions
							class="bottom-11 right-0 z-10 mt-1 max-h-60 w-full overflow-auto py-1 sm:text-sm"
						>
							<ListboxOption
								v-for="className in availableClasses"
								v-slot="{ active, selected }"
								:key="className"
								:value="className"
								as="template"
							>
								<li
									:class="[
										active
											? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
											: 'text-neutral-900 dark:text-neutral-100',
										'relative cursor-pointer select-none py-2 pl-10 pr-4',
									]"
								>
									<span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
										{{ t(`Pages.searchviews.${className}.label`) }}
									</span>
									<span
										v-if="selected"
										class="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600"
									>
										<Check class="size-5" aria-hidden="true" />
									</span>
								</li>
							</ListboxOption>
						</ListboxOptions>
					</Transition>
					<ListboxButton
						class="relative w-full cursor-pointer py-2 pl-1 pr-10 text-left sm:text-sm"
					>
						<span
							v-for="className in selectedClasses"
							:key="className"
							class="mx-1 truncate rounded-md px-2 py-1"
							:class="[bgColors[className]]"
						>
							{{ t(`Pages.searchviews.${className.replace("apis_ontology.", "")}.label`) }}
						</span>
						<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronDown class="size-5 text-neutral-400" aria-hidden="true" />
						</span>
					</ListboxButton>
				</div>
			</Listbox>
			<div class="float-right mt-2 flex gap-2 px-2 pb-1 text-neutral-600">
				<label class="flex gap-2" :title="t('Pages.network.hide-nodes')">
					<span class="sr-only">{{ t("Pages.network.hide-nodes") }}</span>
					<Share2 class="inline size-5"></Share2>
					<input v-model="minDegree" type="range" class="inline" min="0" :max="maxDegree" />
				</label>
			</div>
		</div>
		<GraphViz :graph="graph" />
	</div>
</template>
