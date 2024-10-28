<script lang="ts" setup>
const t = useTranslations();

const links = computed(() => {
	return {
		uibk: {
			href: "https://www.uibk.ac.at/",
			label: "Universität Innsbruck",
			image: {
				light: "/assets/images/logo-uibk.svg",
				dark: "/assets/images/logo-uibk-dark.svg",
			},
		},
		landesarchiv: {
			href: "https://www.tirol.gv.at/",
			label: "Tiroler Landesarchiv",
			image: {
				light: "/assets/images/landesarchiv.webp",
				dark: "/assets/images/landesarchiv.webp",
			},
		},
		acdh: {
			href: "https://www.oeaw.ac.at/acdh/",
			label: "Austrian Centre for Digital Humanities and Cultural Heritage",
			image: {
				light: "/assets/images/logo-acdh-with-text.svg",
				dark: "/assets/images/logo-acdh-with-text-dark.svg",
			},
		},
		oeaw: {
			href: "https://www.oeaw.ac.at/",
			label: "Österreichische Akademie der Wissenschaften",
			image: {
				light: "/assets/images/logo-oeaw.svg",
				dark: "/assets/images/logo-oeaw-dark.webp",
			},
		},
		goDigital: {
			href: "https://www.oeaw.ac.at/foerderungen/godigital/",
			label: "go!digital",
			image: {
				light: "/assets/images/go_digital.svg",
				dark: "/assets/images/go_digital-dark.svg",
			},
		},
	};
});
</script>

<template>
	<footer class="border-t bg-neutral-900 p-8 text-white">
		<nav :aria-label="t('AppFooter.navigation-secondary')" class="w-full">
			<ul class="flex flex-wrap items-center gap-8" role="list">
				<li v-for="(link, key) of links" :key="key" class="shrink-0">
					<a :href="link.href" target="_blank">
						<NuxtImg alt="" class="h-10 w-auto" placeholder :src="link.image.dark" />
						<span class="sr-only">{{ link.label }}</span>
					</a>
				</li>
				<li class="ml-auto text-sm">
					<NuxtLinkLocale class="underline decoration-dotted" href="/imprint">
						{{ t("AppFooter.links.imprint") }}
					</NuxtLinkLocale>
				</li>
			</ul>
		</nav>
	</footer>
</template>
