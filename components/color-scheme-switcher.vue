<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { Laptop, Moon, Sun } from "lucide-vue-next";

const t = useTranslations();

const colorMode = useColorMode();

const colorSchemes = computed(() => {
	return { light: Sun, dark: Moon };
});
</script>

<template>
	<ClientOnly>
		<Listbox v-model="colorMode.preference">
			<div class="relative">
				<ListboxButton>
					<Sun class="inline dark:hidden"></Sun>
					<Moon class="hidden dark:inline"></Moon>
					<span class="sr-only">
						{{ t(`ColorSchemeToggle.color-schemes.${colorMode.preference}`) }}
					</span>
				</ListboxButton>
				<ListboxOptions
					class="absolute -left-2 z-10 mt-3 overflow-auto rounded-md border bg-neutral-50 text-sm dark:bg-zinc-900"
				>
					<ListboxOption
						v-for="(colorScheme, name) in colorSchemes"
						:key="name"
						:value="name"
						class="group flex cursor-pointer items-center gap-2 p-2 pr-9 ui-active:text-primary-600 ui-active:dark:text-primary-300"
					>
						<component
							:is="colorScheme"
							:size="20"
							class="transition group-hover:scale-110 ui-active:scale-90"
						/>
						{{ t(`ColorSchemeToggle.color-schemes.${name}`) }}
					</ListboxOption>

					<ListboxOption
						key="system"
						value="system"
						class="group flex cursor-pointer items-center gap-2 p-2 pr-9 ui-active:text-primary-600 ui-active:dark:text-primary-300"
					>
						<Laptop :size="20" class="transition group-hover:scale-110 ui-active:scale-90" />
						{{ t(`ColorSchemeToggle.color-schemes.system`) }}
					</ListboxOption>
				</ListboxOptions>
			</div>
		</Listbox>
	</ClientOnly>
</template>
