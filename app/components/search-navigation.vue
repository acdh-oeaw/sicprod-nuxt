<script setup lang="ts">
import { Calendar, Contact, HandCoins, MapPin, School2, User } from "lucide-vue-next";

const t = useTranslations();
const links = computed(() => {
	return {
		people: {
			href: { path: "/search/persons" },
			label: t("Pages.searchviews.person.label"),
			icon: User,
		},
		functions: {
			href: { path: "/search/functions" },
			label: t("Pages.searchviews.function.label"),
			icon: Contact,
		},
		institutions: {
			href: { path: "/search/institutions" },
			label: t("Pages.searchviews.institution.label"),
			icon: School2,
		},
		places: {
			href: { path: "/search/places" },
			label: t("Pages.searchviews.place.label"),
			icon: MapPin,
		},
		events: {
			href: { path: "/search/events" },
			label: t("Pages.searchviews.event.label"),
			icon: Calendar,
		},
		salaries: {
			href: { path: "/search/salaries" },
			label: t("Pages.searchviews.salary.label"),
			icon: HandCoins,
		},
	};
});
</script>

<template>
	<div
		class="m-2 flex h-fit min-w-72 flex-wrap gap-2 pt-4 md:flex-col md:gap-4 lg:mx-4 xl:m-4 xl:max-w-sm"
	>
		<NuxtLinkLocale
			v-for="link in links"
			:key="link.label"
			class="group flex h-fit grow items-center justify-center gap-2 rounded-md border p-1 shadow transition hover:bg-primary-100 active:bg-primary-100 md:justify-normal md:gap-4 md:p-2 xl:mx-0 dark:hover:bg-primary-900 dark:active:bg-primary-900"
			:class="$route.path === link.href.path && 'bg-primary-100 dark:bg-primary-900'"
			:to="link.href"
		>
			<component
				:is="link.icon"
				v-if="link.icon"
				class="transition group-hover:scale-110 group-active:scale-90"
			/>
			{{ link.label }}
		</NuxtLinkLocale>
	</div>
</template>
