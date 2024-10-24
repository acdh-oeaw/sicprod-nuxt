<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import network from "assets/networkSnippet.json";

const localePath = useLocalePath();
defineRouteRules({
	prerender: true,
});

definePageMeta({
	title: "IndexPage.meta.title",
});

const t = useTranslations();

const { $api } = useNuxtApp();
const { data } = useQuery({
	queryKey: ["countPersons"],
	queryFn: () =>
		$api["apis_api_apis_ontology.person_list"]({
			queries: {
				limit: 1,
			},
		}),
});
</script>

<template>
	<MainContent class="container grid content-start gap-y-8 py-8">
		<PageTitle>{{ t("IndexPage.title") }}</PageTitle>
		<div>
			<p class="mb-2">{{ t("IndexPage.intro1", { count: data?.count ?? "ca. 6000" }) }}</p>
			<p class="mb-2">{{ t("IndexPage.intro2") }}</p>
			<p class="mb-2">{{ t("IndexPage.intro3") }}</p>
			<p class="mb-2">
				{{ t("IndexPage.intro4") }}
			</p>
			<p>
				{{ t("IndexPage.intro5") }}
				<NuxtLink to="#">{{ t("IndexPage.here") }}</NuxtLink>
			</p>
		</div>
		<div class="flex w-full flex-wrap items-stretch justify-around gap-5">
			<NuxtLink :to="localePath('/detail/person/18')">
				<div
					class="group h-full min-w-20 max-w-72 overflow-hidden rounded-md shadow-lg dark:bg-neutral-800"
				>
					<div class="max-h-72 w-full overflow-hidden">
						<NuxtImg
							alt="Portrait von Sigmund von Tirol"
							class="max-h-72 w-full object-cover object-top transition-transform group-hover:scale-110"
							format="webp"
							height="500"
							src="/assets/images/index-sigismund.jpg"
							width="362"
						/>
					</div>
					<div class="px-6 py-4">
						<div class="mb-2 text-xl font-bold">Sigmund von Tirol</div>
						<p class="text-sm">
							Springen Sie hier direkt zur Detailansicht Sigmunds mitsamt seinen Relationen zu
							anderen Einträgen aus der Datenbank.
						</p>
					</div>
				</div>
			</NuxtLink>
			<NuxtLink :to="localePath('/search/persons')">
				<div
					class="group h-full min-w-20 max-w-72 overflow-hidden rounded-md shadow-lg dark:bg-neutral-800"
				>
					<div class="max-h-72 w-full overflow-hidden">
						<NuxtImg
							alt="Habsburgersaal - Siegmund (Österreich-Tirol)"
							class="h-72 w-full object-cover object-top transition-transform group-hover:scale-110"
							format="webp"
							height="350"
							src="/assets/images/index-datenbank.jpg"
							width="350"
						/>
					</div>
					<div class="px-6 py-4">
						<div class="mb-2 text-xl font-bold">Datenbank</div>
						<p class="text-sm">Durchsuchen Sie unsere Datenbank mit fast 13.000 Einträgen.</p>
					</div>
				</div>
			</NuxtLink>
			<NuxtLink :to="localePath('/network')">
				<div
					class="h-full min-w-20 max-w-72 overflow-hidden rounded-md shadow-lg dark:bg-neutral-800"
				>
					<div class="h-72 w-full">
						<GraphViz
							class="bg-neutral-50 dark:bg-neutral-700/50"
							:graph="network"
							:node-distance="10"
						></GraphViz>
					</div>
					<div class="px-6 py-4">
						<div class="mb-2 text-xl font-bold">Netzwerkvisualisierung</div>
						<p class="text-sm">
							Lassen Sie sich die Vernetzungen der Einträge untereinander noch einmal genauer
							anzeigen und durchforsten Sie, wer wo mit wem zu tun hatte.
						</p>
					</div>
				</div>
			</NuxtLink>
			<NuxtLink :to="localePath('/iiif')">
				<div
					class="group h-full min-w-20 max-w-72 overflow-hidden rounded-md shadow-lg dark:bg-neutral-800"
				>
					<div class="max-h-72 w-full overflow-hidden">
						<NuxtImg
							alt="Kopialbuch Scan"
							class="h-72 w-full object-cover object-top transition-transform group-hover:scale-110"
							format="webp"
							height="350"
							src="/assets/images/index-kopialbuch.jpg"
							width="350"
						/>
					</div>
					<div class="px-6 py-4">
						<div class="mb-2 text-xl font-bold">Rait- und Kopialbücher</div>
						<p class="text-sm">
							Blättern Sie durch das Archiv aus gescannten Rait- und Kopialbüchern aus der Zeit
							Sigmunds. Zur Verfügung gestellt vom Tiroler Landesarchiv.
						</p>
					</div>
				</div>
			</NuxtLink>
		</div>
		<div>
			<h2 class="text-2xl font-semibold">Team</h2>
			<ul>
				<li class="my-2">
					<NuxtLink
						class="block underline decoration-dotted"
						target="_blank"
						to="https://www.uibk.ac.at/geschichte-ethnologie/institut/mitarbeiterinnen/projekt/debertol-markus/"
					>
						Dr. Markus Debertol
					</NuxtLink>
					<span class="text-sm">Prinicpal Investigator (Univ. Innsbruck) und Koordinator</span>
				</li>
				<li class="my-2">
					<span class="block">Mag. Dr. Nadja Krajicek, BA MA</span>
					<span class="text-sm">Principal Investigator (Tiroler Landesarchiv)</span>
				</li>
				<li class="my-2">
					<NuxtLink
						class="block underline decoration-dotted"
						target="_blank"
						to="https://www.uibk.ac.at/geschichte-ethnologie/institut/mitarbeiterinnen/projekt/laumer-philipp/"
					>
						Philipp Laumer, MA
					</NuxtLink>
					<span class="text-sm">Wissenschaftlicher Projektmitarbeiter</span>
				</li>
				<li class="my-2">
					<NuxtLink
						class="block underline decoration-dotted"
						target="_blank"
						to="https://www.oeaw.ac.at/acdh/institute/team/staff-members/birger-schacht"
					>
						Birger Schacht, BSc
					</NuxtLink>
					<span class="text-sm">Backend-Entwicklung (ACDH-CH)</span>
				</li>
				<li class="my-2">
					<NuxtLink
						class="block underline decoration-dotted"
						target="_blank"
						to="https://www.oeaw.ac.at/acdh/institute/team/staff-members/katharina-ruth-wuensche"
					>
						Katharina Wünsche, BSc
					</NuxtLink>
					<span class="text-sm">Frontend-Entwicklung (ACDH-CH, ab Jänner 2024)</span>
				</li>
				<li class="my-2">
					<span class="block">Peter Senfter, BA</span>
					<span class="text-sm">Studentischer Mitarbeiter (bis Oktober 2023)</span>
				</li>
			</ul>
		</div>
	</MainContent>
</template>
