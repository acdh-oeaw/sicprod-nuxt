<script lang="ts" setup>
import type { NavLinkProps } from "@/components/nav-link.vue";

const t = useTranslations();

const links = computed(() => {
	return {
		uibk: {
			href: { path: "https://www.uibk.ac.at/" },
			label: "Universität Innsbruck",
			image: {
				light: "/assets/images/logo-uibk.svg",
				dark: "/assets/images/logo-uibk-dark.svg",
			},
		},
		acdh: {
			href: { path: "https://www.oeaw.ac.at/acdh/" },
			label: "Austrian Centre for Digital Humanities and Cultural Heritage",
			image: {
				light: "/assets/images/logo-acdh-with-text.svg",
				dark: "/assets/images/logo-acdh-with-text-dark.svg",
			},
		},
		oeaw: {
			href: { path: "https://www.oeaw.ac.at/" },
			label: "Österreichische Akademie der Wissenschaften",
			image: {
				light: "/assets/images/logo-oeaw.svg",
				dark: "/assets/images/logo-oeaw-dark.png",
			},
		},
		goDigital: {
			href: { path: "https://www.oeaw.ac.at/foerderungen/godigital/" },
			label: "go!digital",
			image: {
				light: "/assets/images/go_digital.svg",
				dark: "/assets/images/go_digital-dark.svg",
			},
		},
		imprint: { href: { path: "/imprint" }, label: t("AppFooter.links.imprint"), image: null },
	} satisfies Record<
		string,
		{ href: NavLinkProps["href"]; label: string; image: Record<"dark" | "light", string> | null }
	>;
});
</script>

<template>
	<footer class="border-t bg-neutral-900 text-white">
		<div class="container flex items-center justify-between gap-4 py-8">
			<nav :aria-label="t('AppFooter.navigation-secondary')" class="w-full">
				<ul class="flex items-center gap-8" role="list">
					<li v-for="(link, key) of links" :key="key" :class="link.image ? '' : 'ml-auto'">
						<a v-if="link.image" :href="link.href.path" target="_blank">
							<NuxtImg :src="link.image.dark" :alt="link.label" placeholder class="h-10 w-auto">
								{{ link.label }}
							</NuxtImg>
						</a>
						<NavLink v-else :href="link.href">
							{{ link.label }}
						</NavLink>
					</li>
				</ul>
			</nav>
		</div>
	</footer>
</template>
