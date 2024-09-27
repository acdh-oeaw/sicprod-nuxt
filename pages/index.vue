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
						<img
							class="max-h-72 w-full object-cover object-top transition-transform group-hover:scale-110"
							src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Sigismund_von_Tirol.jpg"
							alt="Portrait von Sigmund von Tirol"
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
						<img
							class="h-72 w-full object-cover object-top transition-transform group-hover:scale-110"
							src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Zikmund_tyrolsko.jpg"
							alt="Habsburgersaal - Siegmund (Österreich-Tirol)"
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
							:graph="network"
							:node-distance="10"
							class="bg-neutral-50 dark:bg-neutral-700/50"
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
						<img
							class="h-72 w-full object-cover object-top transition-transform group-hover:scale-110"
							src="https://iiif.acdh.oeaw.ac.at/iiif/images/sicprod/%C3%84ltere_Kopialb%C3%BCcher_9_K/CIIIv-CIVr.jp2/full/500,/0/default.jpg"
							alt="Kopialbuch Scan"
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
						to="https://www.uibk.ac.at/geschichte-ethnologie/institut/mitarbeiterinnen/projekt/debertol-markus/"
						class="block underline decoration-dotted"
						target="_blank"
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
						to="https://www.uibk.ac.at/geschichte-ethnologie/institut/mitarbeiterinnen/projekt/laumer-philipp/"
						class="block underline decoration-dotted"
						target="_blank"
					>
						Philipp Laumer, MA
					</NuxtLink>
					<span class="text-sm">Wissenschaftlicher Projektmitarbeiter</span>
				</li>
				<li class="my-2">
					<NuxtLink
						to="https://www.oeaw.ac.at/acdh/institute/team/staff-members/birger-schacht"
						class="block underline decoration-dotted"
						target="_blank"
					>
						Birger Schacht, BSc
					</NuxtLink>
					<span class="text-sm">Backend-Entwicklung (ACDH-CH)</span>
				</li>
				<li class="my-2">
					<NuxtLink
						to="https://www.oeaw.ac.at/acdh/institute/team/staff-members/katharina-ruth-wuensche"
						class="block underline decoration-dotted"
						target="_blank"
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
