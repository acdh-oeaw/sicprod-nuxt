<script setup lang="ts">
import {
	AnchorLocations,
	type AnchorSpec,
	BlankEndpoint,
	FlowchartConnector,
	newInstance,
	ready,
} from "@jsplumb/browser-ui";

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
onMounted(() => {
	ready(() => {
		const instance = newInstance({
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
								d.innerHTML = `<img src="/assets/icons/users.svg" class="size-4 mb-5" title="${t("FamilyTree.siblings")}"/><span class="sr-only">${t("FamilyTree.siblings")}</span>`;
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
								d.innerHTML = `<img src="/assets/icons/marriage.svg" class="size-4 mb-4" title="${t("FamilyTree.partner")}"/><span class="sr-only">${t("FamilyTree.partner")}</span>`;
								return d;
							},
						},
					},
				],
			},
		];
		containers.forEach((container) => {
			[...(container.ref.value?.children ?? [])].forEach((child, idx) => {
				instance.connect({
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

		// Add child connectors only to uppermost children
		const childContainerChildren = [...(childContainer.value?.children ?? [])];
		const minHeight = Math.min(
			...childContainerChildren.map((el) => el.getBoundingClientRect().top),
		);
		childContainerChildren
			.filter((child) => child.getBoundingClientRect().top === minHeight)
			.forEach((child) => {
				instance.connect({
					source: meContainer.value,
					target: child,
					connector: {
						type: FlowchartConnector.type,
						options: { midpoint: 0.9, stub: 12, alwaysRespectStubs: true },
					},
					anchors: [AnchorLocations.Bottom, AnchorLocations.Top],
					endpoint: BlankEndpoint.type,
					overlays: [
						{
							type: "PlainArrow",
							options: { location: 1, direction: 1, length: 8, width: 10 },
						},
					],
				});
			});
	});
});
</script>

<template>
	<div ref="familyTreeContainer" class="relative text-sm">
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
		<div ref="childContainer" class="mb-2 mt-4 flex flex-wrap justify-evenly gap-2">
			<NuxtLink
				v-for="person in children"
				:key="person.id"
				:to="localePath(`/detail/person/${person.id}`)"
				class="max-w-32 p-2 text-center align-middle"
			>
				{{ person.name }}
			</NuxtLink>
		</div>
	</div>
</template>
