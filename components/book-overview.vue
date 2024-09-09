<script setup lang="ts">
import type { Manifest } from "@iiif/presentation-3";
import { ChevronRight, Search, XCircle } from "lucide-vue-next";

import collection from "~/assets/manifests/collection-manifest.json";

const localePath = useLocalePath();
const t = useTranslations();

const searchInput = ref("");

function getLink(item: unknown) {
	const manifest = item as Manifest;
	return {
		path: localePath("/iiif"),
		query: {
			book: manifest.label.de?.[0]?.replaceAll(" ", "_"),
		},
	};
}

const filteredItemList = computed(() => {
	const result = collection.items.filter((item) => item.label.de[0]?.includes(searchInput.value));
	return result.sort((a, b) => {
		return (
			a.label.de[0]?.localeCompare(b.label.de[0] ?? "", undefined, {
				numeric: true,
				sensitivity: "base",
			}) ?? 0
		);
	});
});
</script>

<template>
	<div>
		<PageTitle>{{ t("Pages.iiif.scans") }}</PageTitle>
		<div
			class="mb-4 grid h-10 w-full shrink-0 grid-cols-[auto_1fr_auto] items-center rounded-md border shadow-md md:my-4 md:h-12"
		>
			<label for="searchinput">
				<Search class="mx-3 size-5 shrink-0 text-neutral-500" />
				<span class="sr-only">
					{{ t("ui.search-placeholder") }}
				</span>
			</label>
			<input
				id="searchinput"
				v-model="searchInput"
				type="text"
				class="h-full bg-transparent"
				:placeholder="t('ui.search-placeholder')"
			/>
			<button v-if="searchInput" @click="searchInput = ''">
				<span class="sr-only">Delete Input</span>
				<XCircle class="mx-2 size-6 text-neutral-500" />
			</button>
		</div>
		<div class="columns-2 md:columns-3">
			<NuxtLink
				v-for="item in filteredItemList"
				:key="item.id"
				:to="getLink(item)"
				class="flex justify-between border-b hover:bg-primary-50 active:bg-primary-50 md:border-t dark:hover:bg-primary-950 dark:active:bg-primary-950"
			>
				<div class="overflow-auto p-2 text-start text-sm md:p-4 md:text-md">
					{{ item.label.de[0] }}
				</div>
				<div class="self-center overflow-auto text-start align-middle text-sm md:text-md">
					<ChevronRight class="size-6 shrink-0" />
				</div>
			</NuxtLink>
		</div>
	</div>
</template>
