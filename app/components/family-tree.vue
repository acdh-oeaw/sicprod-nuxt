<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import {
	AnchorLocations,
	type AnchorSpec,
	BlankEndpoint,
	type BrowserJsPlumbInstance,
	type Connection,
	FlowchartConnector,
	newInstance,
	type OverlaySpec,
	ready,
} from "@jsplumb/browser-ui";
import { ChevronDown } from "lucide-vue-next";

import type { TempTriple } from "@/types/resulttypes";

const t = useTranslations();

const props = withDefaults(
	defineProps<{
		relations: Array<TempTriple> | undefined;
		name: string;
		relationNames?: {
			ancestor?: string;
			child?: string;
			sibling?: string;
			partner?: string;
		};
		legendNames?: {
			ancestor?: string;
			child?: string;
			sibling?: string;
			partner?: string;
			descendantOf?: string;
		};
		icons?: {
			sibling?: string;
			partner?: string;
		};
		classnameForUrls?: string;
		collapseThreshold?: number;
	}>(),
	{
		relations: () => {
			return [];
		},
		classnameForUrls: "person",
		collapseThreshold: 3,
	},
);

const relationNames = computed(() => {
	const defaultNames = {
		ancestor: "ist Kind von",
		child: "ist Elternteil von",
		sibling: "ist Bruder/Schwester von",
		partner: "hat Ehe mit",
	};
	return { ...defaultNames, ...props.relationNames };
});
const icons = computed(() => {
	const defaultIcons = {
		sibling: "/assets/icons/users.svg",
		partner: "/assets/icons/marriage.svg",
	};
	return { ...defaultIcons, ...props.icons };
});
const legendNames = computed(() => {
	const defaultLegendNames = {
		ancestor: "FamilyTree.parents",
		child: "FamilyTree.children",
		sibling: "FamilyTree.siblings",
		partner: "FamilyTree.partner",
		descendantOf: "FamilyTree.is-descendant-of",
	};
	return { ...defaultLegendNames, ...props.legendNames };
});

const familyTreeContainer = ref<HTMLElement>();
const ancestorContainer = ref<HTMLElement>();
const siblingContainer = ref<HTMLElement>();
const childContainer = ref<HTMLElement>();
const partnerContainer = ref<HTMLElement>();
const meContainer = ref<HTMLElement>();

const showAllChilldren = ref(false);
const uncollapseChildrenContainer = ref<HTMLElement>();

function filterUniqueObjects(list: Array<{ id: number; name: string }>) {
	return list.filter((entry, idx) => {
		return (
			list.findIndex((e) => {
				return e.id === entry.id;
			}) === idx
		);
	});
}
const ancestors = computed(() => {
	return filterUniqueObjects(
		props.relations
			.filter((r) => {
				return r.name === relationNames.value.ancestor;
			})
			.map((r) => {
				return r.to;
			}),
	);
});
const children = computed(() => {
	return filterUniqueObjects(
		props.relations
			.filter((r) => {
				return r.name === relationNames.value.child;
			})
			.map((r) => {
				return r.to;
			}),
	);
});
const siblings = computed(() => {
	return filterUniqueObjects(
		props.relations
			.filter((r) => {
				return r.name === relationNames.value.sibling;
			})
			.map((r) => {
				return r.to;
			}),
	);
});
const partners = computed(() => {
	return filterUniqueObjects(
		props.relations
			.filter((r) => {
				return r.name === relationNames.value.partner;
			})
			.map((r) => {
				return r.to;
			}),
	);
});

const instance = ref<BrowserJsPlumbInstance>();
// Add resize handler to monitor container width and adapt chart
function resizeHandler() {
	instance.value?.repaintEverything();
}

const childConnections = ref<Array<Connection | undefined>>();
function drawChildConnections() {
	const container =
		showAllChilldren.value || children.value.length <= props.collapseThreshold
			? childContainer.value
			: uncollapseChildrenContainer.value;
	const childContainerChildren = [...(container?.children ?? [])];
	const getOverlays = (idx: number) => {
		const overlays: Array<OverlaySpec> = [
			{
				type: "PlainArrow",
				options: { location: 1, direction: 1, length: 8, width: 10 },
			},
		];
		if (idx === 0 && showAllChilldren.value) {
			overlays.push({
				type: "Custom",
				options: {
					location: 8,
					create() {
						const d = document.createElement("button");
						d.innerHTML = `<img src="/assets/icons/reduce.svg" class="size-4 ml-7 dark:invert" title="${t("FamilyTree.collapse-children")}"/><span class="sr-only">${t("FamilyTree.collapse-children")}</span>`;
						d.onclick = toggleShowAllChildren;
						return d;
					},
				},
			});
		}
		return overlays;
	};
	instance.value?.batch(() => {
		childConnections.value
			?.filter((con): con is Connection => {
				return con !== undefined;
			})
			.forEach((con) => {
				return instance.value?.deleteConnection(con);
			});

		childConnections.value = childContainerChildren.map((child, idx) => {
			return instance.value?.connect({
				source: meContainer.value,
				target: child,
				connector: {
					type: FlowchartConnector.type,
					options: { midpoint: 0.9999, stub: [16, 20], alwaysRespectStubs: true },
				},
				anchors: [AnchorLocations.Bottom, AnchorLocations.Top],
				endpoint: BlankEndpoint.type,
				overlays: getOverlays(idx),
			});
		});
	});
}

onMounted(() => {
	ready(() => {
		instance.value = newInstance({
			container: familyTreeContainer.value,
		});
		const containers = [
			{
				ref: ancestorContainer,
				anchors: [AnchorLocations.Top, AnchorLocations.Bottom],
				overlays: [
					{
						type: "PlainArrow",
						options: { location: 0, direction: -1, length: 8, width: 10 },
					},
				],
			},
			{
				ref: siblingContainer,
				anchors: [AnchorLocations.Left, AnchorLocations.Right],
				overlays: [
					{
						type: "Custom",
						options: {
							location: siblings.value.length > 1 ? 12 : 0.5,
							create() {
								const d = document.createElement("div");
								d.innerHTML = `<img src="${icons.value.sibling}" class="size-4 mb-5 dark:invert" title="${t(legendNames.value.sibling)}"/><span class="sr-only">${t(legendNames.value.sibling)}</span>`;
								return d;
							},
						},
					},
				],
			},
			{
				ref: partnerContainer,
				anchors: [AnchorLocations.Right, AnchorLocations.Left],
				overlays: [
					{
						type: "Custom",
						options: {
							location: partners.value.length > 1 ? 12 : 0.5,
							create() {
								const d = document.createElement("div");
								d.innerHTML = `<img src="${icons.value.partner}" class="size-4 mb-4 dark:invert" title="${t(legendNames.value.partner)}"/><span class="sr-only">${t(legendNames.value.partner)}</span>`;
								return d;
							},
						},
					},
				],
			},
		];
		containers.forEach((container) => {
			[...(container.ref.value?.children ?? [])].forEach((child, idx) => {
				instance.value?.connect({
					source: meContainer.value,
					target: child,
					connector: {
						type: FlowchartConnector.type,
						options: { midpoint: 0.9, stub: 5, alwaysRespectStubs: true },
					},
					anchors: container.anchors as [AnchorSpec, AnchorSpec],
					endpoint: BlankEndpoint.type,
					overlays: idx === 0 ? container.overlays : undefined,
				});
			});
		});
		drawChildConnections();

		window.addEventListener("resize", resizeHandler);
	});
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", resizeHandler);
});

function toggleShowAllChildren() {
	showAllChilldren.value = !showAllChilldren.value;
	void nextTick(drawChildConnections);
}
</script>

<template>
	<div ref="familyTreeContainer" class="relative text-sm">
		<Popover as="div" class="absolute left-0 z-20 inline-block text-left">
			<div>
				<PopoverButton
					class="inline-flex w-full justify-center text-xs font-medium text-neutral-700 dark:text-neutral-300"
				>
					{{ t("FamilyTree.legend") }}
					<ChevronDown
						aria-hidden="true"
						class="ml-1 size-3 self-center text-neutral-700 dark:text-neutral-300"
					/>
				</PopoverButton>
			</div>

			<Transition
				enter-active-class="transition duration-200 ease-out"
				enter-from-class="translate-y-1 opacity-0"
				enter-to-class="translate-y-0 opacity-100"
				leave-active-class="transition duration-150 ease-in"
				leave-from-class="translate-y-0 opacity-100"
				leave-to-class="translate-y-1 opacity-0"
			>
				<PopoverPanel
					class="absolute left-0 mt-2 w-max origin-top-left rounded-lg bg-neutral-50 p-1 shadow-lg ring-1 ring-black/5 dark:bg-neutral-800"
				>
					<div class="p-1">
						<div
							v-if="siblings.length > 0"
							class="group flex items-center gap-2 rounded-md p-2 text-sm"
						>
							<img :alt="t(legendNames.sibling)" class="size-4 dark:invert" :src="icons.sibling" />
							<div>{{ t(legendNames.sibling) }}</div>
						</div>
						<div
							v-if="partners.length > 0"
							class="group flex items-center gap-2 rounded-md p-2 text-sm"
						>
							<img :alt="t(legendNames.partner)" class="size-4 dark:invert" :src="icons.partner" />
							<div>{{ t(legendNames.partner) }}</div>
						</div>
						<div
							v-if="ancestors.length > 0 || children.length > 0"
							class="group flex items-center gap-2 rounded-md p-2 text-sm"
						>
							<img
								:alt="t(legendNames.descendantOf)"
								class="size-4 rotate-90 dark:invert"
								src="/assets/icons/arrow.svg"
							/>
							<div>{{ t(legendNames.descendantOf) }}</div>
						</div>
						<div
							v-if="showAllChilldren"
							class="group flex items-center gap-2 rounded-md p-2 text-sm"
						>
							<img
								:alt="t('FamilyTree.collapse-children')"
								class="size-4 dark:invert"
								src="/assets/icons/reduce.svg"
							/>
							<div>{{ t("FamilyTree.collapse-children") }}</div>
						</div>
					</div>
				</PopoverPanel>
			</Transition>
		</Popover>
		<div ref="ancestorContainer" class="my-2 flex justify-around gap-2 px-16">
			<NuxtLinkLocale
				v-for="person in ancestors"
				:key="person.id"
				class="mt-auto w-32 p-2 text-center"
				:to="`/detail/${props.classnameForUrls}/${person.id}`"
			>
				{{ person.name }}
			</NuxtLinkLocale>
		</div>
		<div class="my-4 flex justify-around gap-2">
			<div ref="siblingContainer" class="flex flex-col justify-around">
				<NuxtLinkLocale
					v-for="person in siblings"
					:key="person.id"
					class="w-32 p-2 text-right align-middle"
					:to="`/detail/${props.classnameForUrls}/${person.id}`"
				>
					{{ person.name }}
				</NuxtLinkLocale>
			</div>
			<div class="flex w-36 p-2 text-center font-bold">
				<div ref="meContainer" class="my-auto p-2">
					{{ name }}
				</div>
			</div>
			<div ref="partnerContainer" class="flex flex-col justify-around">
				<NuxtLinkLocale
					v-for="person in partners"
					:key="person.id"
					class="w-32 p-2 text-left align-middle"
					:to="`/detail/${props.classnameForUrls}/${person.id}`"
				>
					{{ person.name }}
				</NuxtLinkLocale>
			</div>
		</div>
		<div
			v-if="children.length <= props.collapseThreshold || showAllChilldren"
			ref="childContainer"
			class="mb-2 mt-7 flex flex-wrap justify-evenly gap-x-2 gap-y-6"
		>
			<NuxtLinkLocale
				v-for="person in children"
				:key="person.id"
				class="z-10 max-w-32 flex-auto px-2 pt-0 text-center align-middle"
				:to="`/detail/${props.classnameForUrls}/${person.id}`"
			>
				<span class="bg-white/50 dark:bg-neutral-800/50">
					{{ person.name }}
				</span>
			</NuxtLinkLocale>
		</div>
		<div
			v-else
			ref="uncollapseChildrenContainer"
			class="mb-2 mt-7 flex flex-wrap justify-evenly gap-2"
		>
			<button
				class="border-2 border-dotted p-2 text-center align-middle"
				@click="toggleShowAllChildren"
			>
				{{ t("FamilyTree.show-all-children", { count: children.length }) }}
				<ChevronDown class="inline size-4" />
			</button>
		</div>
	</div>
</template>
