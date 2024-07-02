<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import { shift, useFloating } from "@floating-ui/vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
// @ts-expect-error missing types for citation-js
import Cite from "citation-js";
import { ArrowDownToLine, BookOpenText } from "lucide-vue-next";

import type { Reference } from "@/types/resulttypes";

const t = useTranslations();
const props = defineProps<{
	references: Array<Reference>;
}>();
// Popover positioning using floatingUI
const reference = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloating(reference, floating, {
	transform: false,
	placement: "top",
	middleware: [shift()],
});

const citationConfig = {
	format: "html",
	template: "apa",
};
const citation = computed(() => {
	let c = props.references.map((r) => new Cite(r.bibtex));
	return c;
});
function downloadBibTex() {
	const blob = new Blob(
		citation.value.map((c) => c.format("bibtex")),
		{ type: "text/plain;charset=utf-8;" },
	);
	window.open(URL.createObjectURL(blob), "_blank");
}
</script>

<template>
	<Popover>
		<PopoverButton
			ref="reference"
			class="group inline-flex scale-90 items-center rounded-md font-medium text-neutral-600 transition-transform hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
		>
			<BookOpenText class="mx-auto" />
			<span class="sr-only">{{ t("References.references") }}</span>
		</PopoverButton>
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="translate-y-1 opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0"
		>
			<PopoverPanel
				ref="floating"
				class="z-10 max-w-72 cursor-auto"
				:style="{ ...floatingStyles }"
				@click.stop.prevent
			>
				<div
					class="overflow-auto rounded-lg bg-neutral-50 p-4 text-sm shadow-lg ring-1 ring-black/5 dark:bg-neutral-800"
				>
					<div class="ml-auto flex w-fit">
						<button :title="t('References.download-bibtex')" @click.stop.prevent="downloadBibTex()">
							<ArrowDownToLine class="size-4 transition-transform hover:scale-125" />
						</button>
					</div>
					<div
						v-for="(entry, idx) in citation"
						:key="entry"
						class="py-2"
						:class="{ 'border-b-2': idx < citation.length - 1 }"
						v-html="entry.format('bibliography', citationConfig)"
					></div>
				</div>
			</PopoverPanel>
		</Transition>
	</Popover>
</template>
