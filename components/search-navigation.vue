<script setup lang="ts">
import { Calendar, Contact, HandCoins, MapPin, School2, User } from "lucide-vue-next";

const t = useTranslations();
const localePath = useLocalePath();
const links = computed(() => {
	return {
		functions: {
			href: { path: localePath("/search/functions") },
			label: t("Pages.searchviews.function.label"),
			icon: Contact,
		},
		people: {
			href: { path: localePath("/search/persons") },
			label: t("Pages.searchviews.person.label"),
			icon: User,
		},
		institutions: {
			href: { path: localePath("/search/institutions") },
			label: t("Pages.searchviews.institution.label"),
			icon: School2,
		},
		places: {
			href: { path: localePath("/search/places") },
			label: t("Pages.searchviews.place.label"),
			icon: MapPin,
		},
		events: {
			href: { path: localePath("/search/events") },
			label: t("Pages.searchviews.event.label"),
			icon: Calendar,
		},
		salaries: {
			href: { path: localePath("/search/salaries") },
			label: t("Pages.searchviews.salary.label"),
			icon: HandCoins,
		},
	};
});
</script>

<template>
	<div
		class="m-2 flex h-fit flex-wrap gap-2 md:flex-col md:gap-4 md:pt-4 lg:mx-4 xl:m-4 xl:max-w-sm"
	>
		<NuxtLink
			v-for="link in links"
			:key="link.label"
			:to="link.href"
			class="group flex h-fit items-center gap-4 rounded-md border p-2 shadow transition hover:bg-primary-100 active:bg-primary-100 xl:mx-0 dark:hover:bg-primary-900 dark:active:bg-primary-900"
			:class="$route.path === link.href.path && 'bg-primary-100 dark:bg-primary-900'"
		>
			<component
				:is="link.icon"
				v-if="link.icon"
				class="transition group-hover:scale-110 group-active:scale-90"
			/>
			{{ link.label }}
		</NuxtLink>
	</div>
</template>
