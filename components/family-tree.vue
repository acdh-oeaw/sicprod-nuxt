<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
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

const localePath = useLocalePath();
const props = withDefaults(
	defineProps<{
		relations: Array<TempTriple>;
		name: string;
	}>(),
	{ relations: () => [] },
);
const familyTreeContainer = ref<HTMLElement>();
const ancestorContainer = ref<HTMLElement>();
const siblingContainer = ref<HTMLElement>();
const childContainer = ref<HTMLElement>();
const partnerContainer = ref<HTMLElement>();
const meContainer = ref<HTMLElement>();

const showAllChilldren = ref(false);
const uncollapseChildrenContainer = ref<HTMLElement>();

function filterUniqueObjects(list: Array<{ id: number; name: string }>) {
	return list.filter((entry, idx) => list.findIndex((e) => e.id === entry.id) === idx);
}
const ancestors = computed(() => {
	return filterUniqueObjects(
		props.relations.filter((r) => r.name === "ist Kind von").map((r) => r.to),
	);
});
const children = computed(() => {
	return filterUniqueObjects(
		props.relations.filter((r) => r.name === "ist Elternteil von").map((r) => r.to),
	);
});
const siblings = computed(() => {
	return filterUniqueObjects(
		props.relations.filter((r) => r.name === "ist Bruder/Schwester von").map((r) => r.to),
	);
});
const partners = computed(() => {
	return filterUniqueObjects(
		props.relations.filter((r) => r.name === "hat Ehe mit").map((r) => r.to),
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
		showAllChilldren.value || children.value.length <= 3
			? childContainer.value
			: uncollapseChildrenContainer.value;
	const childContainerChildren = [...(container?.children ?? [])];
	const getOverlays = (idx: number) => {
		let overlays: Array<OverlaySpec> = [
			{
				type: "PlainArrow",
				options: { location: 1, direction: 1, length: 8, width: 10 },
			},
		];
		if (idx === 0 && showAllChilldren.value)
			overlays.push({
				type: "Custom",
				options: {
					location: 12,
					create() {
						const d = document.createElement("button");
						d.innerHTML = `<img src="/assets/icons/reduce.svg" class="size-4 ml-7 dark:invert" title="${t("FamilyTree.collapse-children")}"/><span class="sr-only">${t("FamilyTree.collapse-children")}</span>`;
						d.onclick = toggleShowAllChildren;
						return d;
					},
				},
			});
		return overlays;
	};
	instance.value?.batch(() => {
		childConnections.value
			?.filter((con): con is Connection => con !== undefined)
			.forEach((con) => instance.value?.deleteConnection(con));

		childConnections.value = childContainerChildren.map((child, idx) => {
			return instance.value?.connect({
				source: meContainer.value,
				target: child,
				connector: {
					type: FlowchartConnector.type,
					options: { midpoint: 0.9999, stub: [12, 20], alwaysRespectStubs: true },
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
								d.innerHTML = `<img src="/assets/icons/users.svg" class="size-4 mb-5 dark:invert" title="${t("FamilyTree.siblings")}"/><span class="sr-only">${t("FamilyTree.siblings")}</span>`;
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
								d.innerHTML = `<img src="/assets/icons/marriage.svg" class="size-4 mb-4 dark:invert" title="${t("FamilyTree.partner")}"/><span class="sr-only">${t("FamilyTree.partner")}</span>`;
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
		<Menu as="div" class="absolute left-0 z-20 inline-block text-left">
			<div>
				<MenuButton
					class="inline-flex w-full justify-center text-xs font-medium text-neutral-700 dark:text-neutral-300"
				>
					{{ t("FamilyTree.legend") }}
					<ChevronDown
						class="ml-1 size-3 self-center text-neutral-700 dark:text-neutral-300"
						aria-hidden="true"
					/>
				</MenuButton>
			</div>

			<Transition
				enter-active-class="transition duration-100 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-75 ease-in"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			>
				<MenuItems
					class="absolute left-0 mt-2 w-max origin-top-left rounded-md bg-white/90 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-neutral-900/95"
				>
					<div class="p-1">
						<MenuItem>
							<div class="group flex items-center gap-2 rounded-md p-2 text-sm">
								<img
									src="/assets/icons/users.svg"
									class="size-4 dark:invert"
									:alt="t('FamilyTree.siblings')"
								/>
								<div>{{ t("FamilyTree.siblings") }}</div>
							</div>
						</MenuItem>
						<MenuItem>
							<div class="group flex items-center gap-2 rounded-md p-2 text-sm">
								<img
									src="/assets/icons/marriage.svg"
									class="size-4 dark:invert"
									:alt="t('FamilyTree.partner')"
								/>
								<div>{{ t("FamilyTree.partner") }}</div>
							</div>
						</MenuItem>
						<MenuItem>
							<div class="group flex items-center gap-2 rounded-md p-2 text-sm">
								<img
									src="/assets/icons/arrow.svg"
									class="size-4 rotate-90 dark:invert"
									:alt="t('FamilyTree.is-descendant-of')"
								/>
								<div>{{ t("FamilyTree.is-descendant-of") }}</div>
							</div>
						</MenuItem>
						<MenuItem v-if="showAllChilldren">
							<div class="group flex items-center gap-2 rounded-md p-2 text-sm">
								<img
									src="/assets/icons/reduce.svg"
									class="size-4 dark:invert"
									:alt="t('FamilyTree.collapse-children')"
								/>
								<div>{{ t("FamilyTree.collapse-children") }}</div>
							</div>
						</MenuItem>
					</div>
				</MenuItems>
			</Transition>
		</Menu>
		<div ref="ancestorContainer" class="my-2 flex justify-around gap-2 px-16">
			<NuxtLink
				v-for="person in ancestors"
				:key="person.id"
				class="mt-auto w-32 p-2 text-center"
				:to="localePath(`/detail/person/${person.id}`)"
			>
				{{ person.name }}
			</NuxtLink>
		</div>
		<div class="my-4 flex justify-around gap-2">
			<div ref="siblingContainer" class="flex flex-col justify-around">
				<NuxtLink
					v-for="person in siblings"
					:key="person.id"
					class="w-32 p-2 text-right align-middle"
					:to="localePath(`/detail/person/${person.id}`)"
				>
					{{ person.name }}
				</NuxtLink>
			</div>
			<div class="flex w-36 p-2 text-center font-bold">
				<div ref="meContainer" class="my-auto p-2">
					{{ name }}
				</div>
			</div>
			<div ref="partnerContainer" class="flex flex-col justify-around">
				<NuxtLink
					v-for="person in partners"
					:key="person.id"
					:to="localePath(`/detail/person/${person.id}`)"
					class="w-32 p-2 text-left align-middle"
				>
					{{ person.name }}
				</NuxtLink>
			</div>
		</div>
		<div
			v-if="children.length <= 3 || showAllChilldren"
			ref="childContainer"
			class="mb-2 mt-7 flex flex-wrap justify-evenly gap-x-2 gap-y-6"
		>
			<NuxtLink
				v-for="person in children"
				:key="person.id"
				:to="localePath(`/detail/person/${person.id}`)"
				class="z-10 max-w-32 flex-auto px-2 pt-0 text-center align-middle"
			>
				<span class="bg-white/50 dark:bg-neutral-800/50">
					{{ person.name }}
				</span>
			</NuxtLink>
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
