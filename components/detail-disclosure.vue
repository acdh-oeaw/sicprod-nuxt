<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { get } from "lodash";
import { ChevronDown } from "lucide-vue-next";

import { borderColors, icons } from "@/lib/colors";
import type { SimplifiedRelationType } from "@/lib/create-api-client";

defineProps<{
	rels: Array<SimplifiedRelationType>;
	gridClass?: string;
	title: string;
	defaultOpen?: boolean;
	headers: Array<string>;
	customSlot?: boolean;
	model: "event" | "function" | "institution" | "person" | "place" | "salary";
}>();

const t = useTranslations();
const localePath = useLocalePath();
</script>

<template>
	<Disclosure :default-open="defaultOpen && (rels.length != 0 || customSlot)" as="div" class="">
		<DisclosureButton
			as="button"
			class="rounded flex w-full items-center justify-between border-b-4 p-2 text-xl transition ui-open:rounded-b-none"
			:disabled="rels.length === 0 && !customSlot"
			:class="borderColors[model]"
		>
			<span class="flex gap-2 align-baseline"
				><component :is="icons[model]" class="inline" /> {{ title }}</span
			>
			<ChevronDown class="size-5 transition ui-open:-rotate-180" />
		</DisclosureButton>
		<DisclosurePanel
			v-if="(rels.length !== 0 && headers) || customSlot"
			static
			as="div"
			class="rounded box-border overflow-hidden rounded-t-none p-4 transition-[max-height,border,padding] ui-open:max-h-screen ui-open:border-t-0 ui-not-open:max-h-0 ui-not-open:border-transparent ui-not-open:py-0"
		>
			<slot>
				<table class="w-full table-fixed">
					<tr>
						<th v-for="header in headers" :key="header" class="px-2 text-start font-bold">
							{{ t(`Relations.${model}.${header}`) }}
						</th>
					</tr>
					<NuxtLink
						v-for="hit in rels"
						:key="String(hit)"
						:to="localePath(`/detail/${model}s/${hit.to.id}`)"
						class="table-row border-t hover:bg-primary-50 active:bg-primary-50 md:border-t dark:hover:bg-primary-950 dark:active:bg-primary-950"
					>
						<td v-for="header in headers" :key="hit + header" class="p-2 text-start">
							{{ String(get(hit, header, "")).replace(/\<.*?\>/g, "") }}
						</td>
					</NuxtLink>
				</table>
			</slot>
		</DisclosurePanel>
	</Disclosure>
</template>
