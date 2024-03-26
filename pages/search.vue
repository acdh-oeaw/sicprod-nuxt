<script lang="ts" setup>
import { Calendar, Contact, HandCoins, MapPin, School2, User } from "lucide-vue-next";

import type { NavLink } from "@/types/misc.d.ts";

const t = useTranslations();
const localePath = useLocalePath();
const links = computed(() => {
	return {
		events: {
			href: { path: localePath("/search/events") },
			label: t("Pages.searchviews.event.label"),
			icon: Calendar,
		},
		functions: {
			href: { path: localePath("/search/functions") },
			label: t("Pages.searchviews.function.label"),
			icon: Contact,
		},
		institutions: {
			href: { path: localePath("/search/institutions") },
			label: t("Pages.searchviews.institution.label"),
			icon: School2,
		},
		people: {
			href: { path: localePath("/search/persons") },
			label: t("Pages.searchviews.person.label"),
			icon: User,
		},
		places: {
			href: { path: localePath("/search/places") },
			label: t("Pages.searchviews.place.label"),
			icon: MapPin,
		},
		salaries: {
			href: { path: localePath("/search/salaries") },
			label: t("Pages.searchviews.salaries.label"),
			icon: HandCoins,
		},
	} satisfies Record<string, NavLink>;
});

definePageMeta({
	title: "Pages.search.title",
});
</script>

<template>
	<main>
		<div class="grid h-full grid-rows-[auto_1fr] gap-4 md:grid-cols-[2fr_6fr]">
			<div class="m-2 flex h-fit flex-wrap md:flex-col lg:mx-4 xl:m-4 xl:max-w-sm">
				<NuxtLink
					v-for="link in links"
					:key="link.label"
					:to="link.href"
					class="rounded group m-2 flex h-fit items-center gap-4 border p-2 shadow transition hover:bg-primary-50 active:bg-primary-50 xl:mx-0 dark:hover:bg-primary-950 dark:active:bg-primary-950"
					:class="$route.path === link.href.path && 'bg-slate-200'"
				>
					<component
						:is="link.icon"
						v-if="link.icon"
						class="transition group-hover:scale-110 group-active:scale-90"
					/>
					{{ link.label }}
				</NuxtLink>
			</div>
			<div>
				<NuxtPage />
			</div>
		</div>
	</main>
</template>
