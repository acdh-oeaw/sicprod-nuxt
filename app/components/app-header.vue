<script lang="ts" setup>
const t = useTranslations();

const links = computed(() => {
	return {
		home: {
			href: { path: "/" },
			label: t("AppHeader.links.home.label"),
			title: "",
		},
		search: {
			href: { path: "/search/persons" },
			label: t("AppHeader.links.search.label"),
			title: t("AppHeader.links.search.title"),
		},
		network: {
			href: { path: "/network" },
			label: t("AppHeader.links.network.label"),
			title: t("AppHeader.links.network.title"),
		},
		scans: {
			href: { path: "/iiif" },
			label: t("AppHeader.links.scans.label"),
			title: t("AppHeader.links.scans.title"),
		},
	};
});
</script>

<template>
	<header class="border-b shadow-sm dark:bg-neutral-950">
		<div class="flex items-center justify-between gap-x-4 px-8 py-6">
			<nav :aria-label="t('AppHeader.navigation-main')">
				<ul class="flex flex-wrap items-center gap-x-6 gap-y-3" role="list">
					<li v-for="(link, key) of links" :key="key">
						<NuxtLinkLocale class="font-medium transition" :href="link.href" :title="link.title">
							{{ link.label }}
						</NuxtLinkLocale>
					</li>
				</ul>
			</nav>

			<div class="flex items-center gap-x-4">
				<ColorSchemeSwitcher />
			</div>
		</div>
	</header>
</template>
