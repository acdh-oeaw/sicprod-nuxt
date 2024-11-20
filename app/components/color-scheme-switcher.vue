<script lang="ts" setup>
import { offset, shift, useFloating } from "@floating-ui/vue";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-vue-next";

const t = useTranslations();

const colorMode = useColorMode();

const colorSchemes = computed(() => {
	return { light: SunIcon, dark: MoonIcon };
});

const reference = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloating(reference, floating, {
	placement: "bottom",
	middleware: [offset({ mainAxis: 8 }), shift({ padding: 24 })],
});
</script>

<template>
	<ClientOnly>
		<Listbox v-model="colorMode.preference">
			<ListboxButton ref="reference">
				<SunIcon class="block dark:hidden" />
				<MoonIcon class="hidden dark:block" />
				<span class="sr-only">
					{{ t(`ColorSchemeToggle.color-schemes.${colorMode.preference}`) }}
				</span>
			</ListboxButton>
			<ListboxOptions
				ref="floating"
				class="rounded-md border bg-neutral-50 text-sm shadow-lg dark:bg-zinc-900"
				:style="{ ...floatingStyles }"
			>
				<ListboxOption
					v-for="(colorScheme, name) in colorSchemes"
					:key="name"
					class="group flex cursor-pointer items-center gap-2 p-2 pr-9 ui-active:text-primary-600 ui-active:dark:text-primary-300"
					:value="name"
				>
					<component
						:is="colorScheme"
						class="transition group-hover:scale-110 ui-active:scale-90"
						:size="20"
					/>
					{{ t(`ColorSchemeToggle.color-schemes.${name}`) }}
				</ListboxOption>

				<ListboxOption
					key="system"
					class="group flex cursor-pointer items-center gap-2 p-2 pr-9 ui-active:text-primary-600 ui-active:dark:text-primary-300"
					value="system"
				>
					<LaptopIcon class="transition group-hover:scale-110 ui-active:scale-90" :size="20" />
					{{ t(`ColorSchemeToggle.color-schemes.system`) }}
				</ListboxOption>
			</ListboxOptions>
		</Listbox>
	</ClientOnly>
</template>
