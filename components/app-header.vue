<script lang="ts" setup>
import type { NavLinkProps } from "@/components/nav-link.vue";

const t = useTranslations();

const links = computed(() => {
	return {
		home: { href: { path: "/" }, label: t("AppHeader.links.home") },
		search: { href: { path: "/search/persons" }, label: t("AppHeader.links.search") },
	} satisfies Record<string, { href: NavLinkProps["href"]; label: string }>;
});
</script>

<template>
	<header
		class="max-w-[100dvw] shadow-header-sm md:shadow-header dark:bg-neutral-950 dark:shadow-header-dark-sm dark:md:shadow-header-dark"
	>
		<div class="flex items-center justify-between gap-4 p-6 md:p-8">
			<nav :aria-label="t('AppHeader.navigation-main')">
				<ul class="flex items-center gap-4" role="list">
					<li v-for="(link, key) of links" :key="key">
						<NavLink :href="link.href">
							{{ link.label }}
						</NavLink>
					</li>
				</ul>
			</nav>

			<div class="flex items-center gap-4">
				<ColorSchemeSwitcher />
				<LocaleSwitcher />
			</div>
		</div>
	</header>
</template>
