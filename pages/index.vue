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
			<p class="mb-2">{{ t("IndexPage.intro4") }}</p>
			<p>{{ t("IndexPage.intro5") }}</p>
		</div>
		<div class="flex w-full flex-wrap justify-around gap-5">
			<NuxtLink :to="localePath('/detail/person/18')">
				<div class="rounded min-w-20 max-w-xs overflow-hidden shadow-lg">
					<img
						class="max-h-80 w-full object-cover object-top"
						src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Sigismund_von_Tirol.jpg"
						alt="Portrait von Sigmund von Tirol"
					/>
					<div class="px-6 py-4">
						<div class="mb-2 text-xl font-bold">Sigmund von Tirol</div>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
							Maiores et perferendis eaque, exercitationem praesentium nihil.
						</p>
					</div>
				</div>
			</NuxtLink>
			<NuxtLink :to="localePath('/search/persons')">
				<div class="rounded min-w-20 max-w-xs overflow-hidden shadow-lg">
					<img
						class="h-80 w-full object-cover object-top"
						src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Zikmund_tyrolsko.jpg"
						alt="Habsburgersaal - Siegmund (Österreich-Tirol)"
					/>
					<div class="px-6 py-4">
						<div class="mb-2 text-xl font-bold">Datenbank</div>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
							Maiores et perferendis eaque, exercitationem praesentium nihil.
						</p>
					</div>
				</div>
			</NuxtLink>
			<NuxtLink :to="localePath('/network')">
				<div class="rounded min-w-20 max-w-xs overflow-hidden shadow-lg">
					<div class="h-80 w-full">
						<GraphViz :graph="network" :node-distance="10"></GraphViz>
					</div>
					<div class="px-6 py-4">
						<div class="mb-2 text-xl font-bold">Netzwerkvisualisierung</div>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
							Maiores et perferendis eaque, exercitationem praesentium nihil.
						</p>
					</div>
				</div>
			</NuxtLink>
			<NuxtLink :to="localePath('/iiif')">
				<div class="rounded min-w-20 max-w-xs overflow-hidden shadow-lg">
					<img
						class="h-80 w-full object-cover object-top"
						src="https://iiif.acdh.oeaw.ac.at/iiif/images/sicprod/%C3%84ltere_Kopialb%C3%BCcher_9_K/CIIIv-CIVr.jp2/full/500,/0/default.jpg"
						alt="Kopialbuch Scan"
					/>
					<div class="px-6 py-4">
						<div class="mb-2 text-xl font-bold">Rait- und Kopialbücher</div>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
							Maiores et perferendis eaque, exercitationem praesentium nihil.
						</p>
					</div>
				</div>
			</NuxtLink>
		</div>
	</MainContent>
</template>
