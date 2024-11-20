<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";

import network from "~/assets/network-snippet.json";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("IndexPage.meta.title"),
});

const api = useApiClient();

const { data: count, suspense } = useQuery({
	queryKey: ["apis_api_apis_ontology.person_list", "count"] as const,
	async queryFn({ queryKey }) {
		const [endpoint] = queryKey;

		const data = await api[endpoint]({ queries: { limit: 1 } });

		return data.count;
	},
});
await suspense();
</script>

<template>
	<MainContent
		class="container grid max-w-screen-lg content-start gap-y-8 py-8 lg:gap-y-16 lg:py-16"
	>
		<section class="grid gap-y-8">
			<PageTitle>{{ t("IndexPage.title") }}</PageTitle>

			<div class="prose">
				<p>{{ t("IndexPage.intro1", { count: count ?? "ca. 6000" }) }}</p>
				<p>{{ t("IndexPage.intro2") }}</p>
				<p>{{ t("IndexPage.intro3") }}</p>
				<p>{{ t("IndexPage.intro4") }}</p>
				<p>{{ t("IndexPage.intro5") }}</p>
			</div>
		</section>

		<section class="grid grid-cols-[repeat(auto-fit,minmax(min(20rem,100%),1fr))] gap-8">
			<article class="group relative rounded-lg shadow-lg dark:bg-neutral-800">
				<div class="relative h-72 overflow-hidden border-b">
					<NuxtImg
						alt="Portrait von Sigmund von Tirol"
						class="absolute inset-0 size-full object-cover transition-transform group-hover:scale-110"
						format="webp"
						height="500"
						src="/assets/images/index-sigismund.jpg"
						width="362"
					/>
				</div>
				<div class="grid gap-y-2 px-6 py-5">
					<h2 class="text-xl font-bold">
						<NuxtLinkLocale class="after:absolute after:inset-0" href="/detail/person/18"
							>Sigmund von Tirol</NuxtLinkLocale
						>
					</h2>
					<p class="prose text-sm">
						Springen Sie hier direkt zur Detailansicht Sigmunds mitsamt seinen Relationen zu anderen
						Einträgen aus der Datenbank.
					</p>
				</div>
			</article>

			<article class="group relative rounded-lg shadow-lg dark:bg-neutral-800">
				<div class="relative h-72 overflow-hidden border-b">
					<NuxtImg
						alt="Habsburgersaal - Siegmund (Österreich-Tirol)"
						class="absolute inset-0 size-full object-cover transition-transform group-hover:scale-110"
						format="webp"
						height="350"
						src="/assets/images/index-datenbank.jpg"
						width="350"
					/>
				</div>
				<div class="grid gap-y-2 px-6 py-5">
					<h2 class="text-xl font-bold">
						<NuxtLinkLocale class="after:absolute after:inset-0" href="/search/persons">
							Datenbank
						</NuxtLinkLocale>
					</h2>
					<p class="prose text-sm">Durchsuchen Sie unsere Datenbank mit fast 13.000 Einträgen.</p>
				</div>
			</article>

			<article class="group relative rounded-lg shadow-lg dark:bg-neutral-800">
				<div class="relative h-72 overflow-hidden border-b">
					<GraphViz
						class="bg-neutral-50 dark:bg-neutral-700/50"
						:graph="network"
						:node-distance="10"
					/>
				</div>
				<div class="grid gap-y-2 px-6 py-5">
					<h2 class="text-xl font-bold">
						<NuxtLinkLocale class="after:absolute after:inset-0" href="/network">
							Netzwerkvisualisierung
						</NuxtLinkLocale>
					</h2>
					<p class="prose text-sm">
						Lassen Sie sich die Vernetzungen der Einträge untereinander noch einmal genauer anzeigen
						und durchforsten Sie, wer wo mit wem zu tun hatte.
					</p>
				</div>
			</article>

			<article class="group relative rounded-lg shadow-lg dark:bg-neutral-800">
				<div class="relative h-72 overflow-hidden border-b">
					<NuxtImg
						alt="Kopialbuch Scan"
						class="absolute inset-0 size-full object-cover transition-transform group-hover:scale-110"
						format="webp"
						height="350"
						src="/assets/images/index-kopialbuch.jpg"
						width="350"
					/>
				</div>
				<div class="grid gap-y-2 px-6 py-5">
					<h2 class="text-xl font-bold">
						<NuxtLinkLocale class="after:absolute after:inset-0" href="/iiif">
							Rait- und Kopialbücher
						</NuxtLinkLocale>
					</h2>
					<p class="prose text-sm">
						Blättern Sie durch das Archiv aus gescannten Rait- und Kopialbüchern aus der Zeit
						Sigmunds. Zur Verfügung gestellt vom Tiroler Landesarchiv.
					</p>
				</div>
			</article>
		</section>

		<section class="grid gap-y-2">
			<h2 class="text-2xl font-semibold">Team</h2>

			<ul class="grid gap-y-2" role="list">
				<li>
					<NuxtLinkLocale
						class="block underline decoration-dotted"
						href="https://www.uibk.ac.at/geschichte-ethnologie/institut/mitarbeiterinnen/projekt/debertol-markus/"
						target="_blank"
					>
						Dr. Markus Debertol
					</NuxtLinkLocale>
					<span class="text-sm">Prinicpal Investigator (Univ. Innsbruck) und Koordinator</span>
				</li>

				<li>
					<span class="block">Mag. Dr. Nadja Krajicek, BA MA</span>
					<span class="text-sm">Principal Investigator (Tiroler Landesarchiv)</span>
				</li>

				<li>
					<NuxtLinkLocale
						class="block underline decoration-dotted"
						href="https://www.uibk.ac.at/geschichte-ethnologie/institut/mitarbeiterinnen/projekt/laumer-philipp/"
						target="_blank"
					>
						Philipp Laumer, MA
					</NuxtLinkLocale>
					<span class="text-sm">Wissenschaftlicher Projektmitarbeiter</span>
				</li>

				<li>
					<NuxtLinkLocale
						class="block underline decoration-dotted"
						href="https://www.oeaw.ac.at/acdh/institute/team/staff-members/birger-schacht"
						target="_blank"
					>
						Birger Schacht, BSc
					</NuxtLinkLocale>
					<span class="text-sm">Backend-Entwicklung (ACDH-CH)</span>
				</li>

				<li>
					<NuxtLinkLocale
						class="block underline decoration-dotted"
						href="https://www.oeaw.ac.at/acdh/institute/team/staff-members/katharina-ruth-wuensche"
						target="_blank"
					>
						Katharina Wünsche, BSc
					</NuxtLinkLocale>
					<span class="text-sm">Frontend-Entwicklung (ACDH-CH, ab Jänner 2024)</span>
				</li>

				<li>
					<span class="block">Peter Senfter, BA</span>
					<span class="text-sm">Studentischer Mitarbeiter (bis Oktober 2023)</span>
				</li>
			</ul>
		</section>
	</MainContent>
</template>
