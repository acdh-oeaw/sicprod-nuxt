<script lang="ts" setup>
import type { NavLinkProps } from "@/components/nav-link.vue";

const t = useTranslations();

const links = computed(() => {
	return {
		home: { href: { path: "/" }, label: t("AppHeader.links.home"), title: "" },
		search: {
			href: { path: "/search/persons" },
			label: t("AppHeader.links.search"),
			title: t("AppHeader.links.search"),
		},
		network: {
			href: { path: "/network" },
			label: t("AppHeader.links.network"),
			title: t("AppHeader.linkTitle.network"),
		},
		scans: {
			href: { path: "/iiif" },
			label: t("AppHeader.links.scans"),
			title: t("AppHeader.linkTitle.scans"),
		},
	} satisfies Record<string, { href: NavLinkProps["href"]; label: string; title?: string }>;
});
</script>

<template>
	<header
		class="max-w-[100dvw] shadow-header-sm md:shadow-header dark:bg-neutral-950 dark:shadow-header-dark-sm dark:md:shadow-header-dark"
	>
		<div class="flex items-center justify-between gap-4 p-6 md:p-8">
			<nav :aria-label="t('AppHeader.navigation-main')">
				<ul class="flex items-center gap-4" role="list">
					<li v-for="(link, key) of links" :key="key" :title="link.title ?? ''">
						<NavLink :href="link.href">
							{{ link.label }}
						</NavLink>
					</li>
				</ul>
			</nav>

			<div class="flex items-center gap-4">
				<ColorSchemeSwitcher />
			</div>
		</div>
	</header>
</template>
