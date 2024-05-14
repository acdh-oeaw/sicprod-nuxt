import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const Type19fEnum = z.enum([
	"Hochzeit",
	"Landtag",
	"Fest/Turnier",
	"Schlacht",
	"Gesandtschaft/Reise",
	"Taufe",
	"Amtseinsetzung",
	"Reichstag",
]);
const BlankEnum = z.unknown();

const SimplifiedRelation = z
	.object({
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		start_date: z.string().max(255).nullish(),
		end_date: z.string().max(255).nullish(),
		to: z.object({
			id: z.number().int().optional(),
			name: z.string(),
		}),
		name: z.string(),
	})
	.passthrough();
export type SimplifiedRelationType = z.infer<typeof SimplifiedRelation>;
const GroupedRelations = z.object({
	event: z.array(SimplifiedRelation).optional(),
	place: z.array(SimplifiedRelation).optional(),
	person: z.array(SimplifiedRelation).optional(),
	institution: z.array(SimplifiedRelation).optional(),
	function: z.array(SimplifiedRelation).optional(),
	salary: z.array(SimplifiedRelation).optional(),
});
const Reference = z.object({
	pages_start: z.string().nullable(),
	pages_end: z.string().nullable(),
	folio: z.string().nullable(),
	bibtex: z.object({
		id: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		archive: z.string().nullable().optional(),
		archive_location: z.string().nullable().optional(),
	}),
});
const Event = z
	.object({
		// url: z.string().url(),
		id: z.number().int(),
		name: z.string().max(255),
		// start_date: z.string().nullable(),
		// start_start_date: z.string().nullable(),
		// start_end_date: z.string().nullable(),
		// end_date: z.string().nullable(),
		// end_start_date: z.string().nullable(),
		// end_end_date: z.string().nullable(),
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		// review: z.boolean().optional(),
		// status: z.string().max(100).optional(),
		// references: z.string().nullish(),
		// notes: z.string().nullish(),
		// published: z.boolean().optional(),
		// metadata: z.unknown().nullable(),
		alternative_label: z.string().nullish(),
		type: z.union([Type19fEnum, BlankEnum]).optional(),
		// self_contenttype: z.string().url().nullable(),
		// collection: z.array(z.string()),
	})
	.passthrough();
const PaginatedEventList = z
	.object({
		count: z.number().int(),
		next: z.string().url().nullable(),
		previous: z.string().url().nullable(),
		results: z.array(Event),
	})
	.partial()
	.passthrough();
const EventDetail = z
	.object({
		name: z.string().max(255),
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		references: z.array(Reference).nullish(),
		type: z.union([Type19fEnum, BlankEnum]).optional(),
		relations: GroupedRelations,
	})
	.passthrough();
const Function = z
	.object({
		// url: z.string().url(),
		id: z.number().int(),
		name: z.string().max(255),
		// start_date: z.string().nullable(),
		// start_start_date: z.string().nullable(),
		// start_end_date: z.string().nullable(),
		// end_date: z.string().nullable(),
		// end_start_date: z.string().nullable(),
		// end_end_date: z.string().nullable(),
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		// review: z.boolean().optional(),
		// status: z.string().max(100).optional(),
		// references: z.string().nullish(),
		// notes: z.string().nullish(),
		// published: z.boolean().optional(),
		// metadata: z.unknown().nullable(),
		alternative_label: z.string().nullish(),
		// self_contenttype: z.string().url().nullable(),
		// collection: z.array(z.string()),
	})
	.passthrough();
const PaginatedFunctionList = z
	.object({
		count: z.number().int(),
		next: z.string().url().nullable(),
		previous: z.string().url().nullable(),
		results: z.array(Function),
	})
	.partial()
	.passthrough();
const FunctionDetail = z
	.object({
		name: z.string().max(255),
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		references: z.array(Reference).nullish(),
		alternative_label: z.string().nullish(),
		relations: GroupedRelations,
	})
	.passthrough();
const Type1c4Enum = z.enum([
	"Kanzlei",
	"Hofkapelle",
	"Küche",
	"(Dom-)Kapitel",
	"Universität",
	"Kloster",
	"Frauenzimmer",
	"Bistum",
	"Pfarrei",
]);
const Institution = z
	.object({
		// url: z.string().url(),
		id: z.number().int(),
		name: z.string().max(255),
		// start_date: z.string().nullable(),
		// start_start_date: z.string().nullable(),
		// start_end_date: z.string().nullable(),
		// end_date: z.string().nullable(),
		// end_start_date: z.string().nullable(),
		// end_end_date: z.string().nullable(),
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		// review: z.boolean().optional(),
		// status: z.string().max(100).optional(),
		// references: z.string().nullish(),
		// notes: z.string().nullish(),
		// published: z.boolean().optional(),
		// metadata: z.unknown().nullable(),
		alternative_label: z.string().nullish(),
		type: z.union([Type1c4Enum, BlankEnum]).optional(),
		// self_contenttype: z.string().url().nullable(),
		// collection: z.array(z.string()),
	})
	.passthrough();
const PaginatedInstitutionList = z
	.object({
		count: z.number().int(),
		next: z.string().url().nullable(),
		previous: z.string().url().nullable(),
		results: z.array(Institution),
	})
	.partial()
	.passthrough();
const InstitutionDetail = z
	.object({
		name: z.string().max(255),
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		references: z.array(Reference).nullish(),
		type: z.union([Type1c4Enum, BlankEnum]).optional(),
		relations: GroupedRelations,
	})
	.passthrough();
const GenderEnum = z.enum(["männlich", "weiblich", "unbekannt"]);
const Person = z
	.object({
		// url: z.string().url(),
		id: z.number().int(),
		name: z.string().max(255),
		// start_date: z.string().nullable(),
		// start_start_date: z.string().nullable(),
		// start_end_date: z.string().nullable(),
		// end_date: z.string().nullable(),
		// end_start_date: z.string().nullable(),
		// end_end_date: z.string().nullable(),
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		// review: z.boolean().optional(),
		// status: z.string().max(100).optional(),
		// references: z.string().nullish(),
		// notes: z.string().nullish(),
		// published: z.boolean().optional(),
		// metadata: z.unknown().nullable(),
		first_name: z.string().max(1024).nullish(),
		gender: z.union([GenderEnum, BlankEnum]).optional(),
		alternative_label: z.string().nullish(),
		// self_contenttype: z.string().url().nullable(),
		// collection: z.array(z.string()),
	})
	.passthrough();
const PaginatedPersonList = z
	.object({
		count: z.number().int(),
		next: z.string().url().nullable(),
		previous: z.string().url().nullable(),
		results: z.array(Person),
	})
	.partial()
	.passthrough();
const PersonDetail = z
	.object({
		url: z.string().url(),
		id: z.number().int().optional(),
		name: z.string().max(255),
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		status: z.string().max(100).optional(),
		// references: z.array(Reference).nullish(),
		first_name: z.string().max(1024).nullish(),
		gender: z.union([GenderEnum, BlankEnum]).optional(),
		alternative_label: z.string().nullish(),
		relations: GroupedRelations,
	})
	.passthrough();
const Type759Enum = z.enum([
	"Stadt",
	"Dorf/Nachbarschaft/Gemein/Siedlung/Weiler",
	"Burg/Schloss",
	"Land/Herrschaftskomplex",
	"Landschaft/Region",
	"Lehen",
	"Haus/Hof",
	"Gericht",
	"Kloster",
	"Gewässer",
	"Grundherrschaft",
	"Hofmark",
	"Tal",
	"Berg",
	"Bergrevier",
	"Pflege",
	"(Land-)Vogtei",
	"Propstei",
]);
const Place = z
	.object({
		// url: z.string().url(),
		id: z.number().int(),
		name: z.string().max(255),
		// start_date: z.string().nullable(),
		// start_start_date: z.string().nullable(),
		// start_end_date: z.string().nullable(),
		// end_date: z.string().nullable(),
		// end_start_date: z.string().nullable(),
		// end_end_date: z.string().nullable(),
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		// review: z.boolean().optional(),
		// status: z.string().max(100).optional(),
		// references: z.string().nullish(),
		// notes: z.string().nullish(),
		// published: z.boolean().optional(),
		// metadata: z.unknown().nullable(),
		alternative_label: z.string().nullish(),
		type: z.union([Type759Enum, BlankEnum]).optional(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
		// self_contenttype: z.string().url().nullable(),
		// collection: z.array(z.string()),
	})
	.passthrough();
const PaginatedPlaceList = z
	.object({
		count: z.number().int(),
		next: z.string().url().nullable(),
		previous: z.string().url().nullable(),
		results: z.array(Place),
	})
	.partial()
	.passthrough();
const PlaceDetail = z
	.object({
		name: z.string().max(255),
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		references: z.array(Reference).nullish(),
		alternative_label: z.string().nullish(),
		type: z.union([Type759Enum, BlankEnum]).optional(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
		relations: GroupedRelations,
	})
	.passthrough();
const TypEnum = z.enum([
	"Sold",
	"Zehrung",
	"Provision",
	"Kredit",
	"Sonstiges",
	"Burghut",
	"Botenlohn",
]);
const RepetitionTypeEnum = z.enum(["einfach", "wiederholend"]);
const Salary = z
	.object({
		// url: z.string().url(),
		id: z.number().int(),
		name: z.string().max(255),
		// start_date: z.string().nullable(),
		// start_start_date: z.string().nullable(),
		// start_end_date: z.string().nullable(),
		// end_date: z.string().nullable(),
		// end_start_date: z.string().nullable(),
		// end_end_date: z.string().nullable(),
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		// review: z.boolean().optional(),
		// status: z.string().max(100).optional(),
		// references: z.string().nullish(),
		// notes: z.string().nullish(),
		// published: z.boolean().optional(),
		// metadata: z.unknown().nullable(),
		typ: z.union([TypEnum, BlankEnum]).optional(),
		repetitionType: z.union([RepetitionTypeEnum, BlankEnum]).optional(),
		// self_contenttype: z.string().url().nullable(),
		// collection: z.array(z.string()),
	})
	.passthrough();
const PaginatedSalaryList = z
	.object({
		count: z.number().int(),
		next: z.string().url().nullable(),
		previous: z.string().url().nullable(),
		results: z.array(Salary),
	})
	.partial()
	.passthrough();
const SalaryDetail = z
	.object({
		name: z.string().max(255),
		start_date_written: z.string().max(255).nullish(),
		end_date_written: z.string().max(255).nullish(),
		references: z.array(Reference).nullish(),
		typ: z.union([TypEnum, BlankEnum]).optional(),
		repetitionType: z.union([RepetitionTypeEnum, BlankEnum]).optional(),
		relations: GroupedRelations,
	})
	.passthrough();
const EntityUri = z.object({ id: z.number().int(), uri: z.string().url() }).passthrough();
const Entity = z
	.object({
		id: z.number().int(),
		url: z.string(),
		uris: z.array(EntityUri),
		revisions: z.array(z.string()),
	})
	.passthrough();

const PaginatedListResult = z.union([
	PaginatedEventList,
	PaginatedFunctionList,
	PaginatedInstitutionList,
	PaginatedPersonList,
	PaginatedPlaceList,
	PaginatedSalaryList,
]);
export type PaginatedListResultType = z.infer<typeof PaginatedListResult>;

const EntityDetailResult = z.union([
	EventDetail,
	FunctionDetail,
	InstitutionDetail,
	PersonDetail,
	PlaceDetail,
	SalaryDetail,
]);
export type EntityDetailResultType = z.infer<typeof EntityDetailResult>;

export const schemas = {
	Type19fEnum,
	BlankEnum,
	Event,
	PaginatedEventList,
	EventDetail,
	Function,
	PaginatedFunctionList,
	FunctionDetail,
	Type1c4Enum,
	Institution,
	PaginatedInstitutionList,
	InstitutionDetail,
	GenderEnum,
	Person,
	PaginatedPersonList,
	PersonDetail,
	Type759Enum,
	Place,
	PaginatedPlaceList,
	PlaceDetail,
	TypEnum,
	Salary,
	PaginatedSalaryList,
	SalaryDetail,
	EntityUri,
	Entity,
	PaginatedListResult,
};

const endpoints = makeApi([
	{
		method: "get",
		path: "/apis/api/apis_ontology.event/",
		alias: "apis_api_ontology_event_list",
		description: `Filter a queryset of a listview using the APIS_LIST_VIEW_OBJECT_FILTER
setting if it exists. A child class has to call the &#x60;filter_queryset&#x60;
method somewhere, most likely in the &#x60;get_queryset&#x60; method.`,
		requestFormat: "json",
		parameters: [
			{
				name: "alternative_label",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "collection__id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "collection__id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "collection__name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date_written",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "end_end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "json+net"]).optional(),
			},
			{
				name: "id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "notes",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "published",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "references",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "review",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "rootobject_ptr",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype__app_label",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "self_contenttype__id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype__id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "self_contenttype__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "self_contenttype__model",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date_written",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "start_end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "status",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "type",
				type: "Query",
				schema: z
					.enum([
						"Amtseinsetzung",
						"Fest/Turnier",
						"Gesandtschaft/Reise",
						"Hochzeit",
						"Landtag",
						"Reichstag",
						"Schlacht",
						"Taufe",
					])
					.optional(),
			},
			{
				name: "type__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "type__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "type__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
		],
		response: PaginatedEventList,
	},
	{
		method: "get",
		path: "/apis/api/apis_ontology.event/:id/",
		alias: "apis_api_ontology_event_retrieve",
		description: `Filter a queryset of a listview using the APIS_LIST_VIEW_OBJECT_FILTER
setting if it exists. A child class has to call the &#x60;filter_queryset&#x60;
method somewhere, most likely in the &#x60;get_queryset&#x60; method.`,
		requestFormat: "json",
		parameters: [
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "json+net"]).optional(),
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: EventDetail,
	},
	{
		method: "get",
		path: "/apis/api/apis_ontology.function/",
		alias: "apis_api_ontology_function_list",
		description: `Filter a queryset of a listview using the APIS_LIST_VIEW_OBJECT_FILTER
setting if it exists. A child class has to call the &#x60;filter_queryset&#x60;
method somewhere, most likely in the &#x60;get_queryset&#x60; method.`,
		requestFormat: "json",
		parameters: [
			{
				name: "alternative_label",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "collection__id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "collection__id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "collection__name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date_written",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "end_end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "json+net"]).optional(),
			},
			{
				name: "id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "notes",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "published",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "references",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "review",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "rootobject_ptr",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype__app_label",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "self_contenttype__id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype__id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "self_contenttype__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "self_contenttype__model",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date_written",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "start_end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "status",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
		],
		response: PaginatedFunctionList,
	},
	{
		method: "get",
		path: "/apis/api/apis_ontology.function/:id/",
		alias: "apis_api_ontology_function_retrieve",
		description: `Filter a queryset of a listview using the APIS_LIST_VIEW_OBJECT_FILTER
setting if it exists. A child class has to call the &#x60;filter_queryset&#x60;
method somewhere, most likely in the &#x60;get_queryset&#x60; method.`,
		requestFormat: "json",
		parameters: [
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "json+net"]).optional(),
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: FunctionDetail,
	},
	{
		method: "get",
		path: "/apis/api/apis_ontology.institution/",
		alias: "apis_api_ontology_institution_list",
		description: `Filter a queryset of a listview using the APIS_LIST_VIEW_OBJECT_FILTER
setting if it exists. A child class has to call the &#x60;filter_queryset&#x60;
method somewhere, most likely in the &#x60;get_queryset&#x60; method.`,
		requestFormat: "json",
		parameters: [
			{
				name: "alternative_label",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "collection__id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "collection__id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "collection__name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date_written",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "end_end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "json+net"]).optional(),
			},
			{
				name: "id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "notes",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "published",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "references",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "review",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "rootobject_ptr",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype__app_label",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "self_contenttype__id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype__id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "self_contenttype__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "self_contenttype__model",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date_written",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "start_end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "status",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "type",
				type: "Query",
				schema: z
					.enum([
						"(Dom-)Kapitel",
						"Bistum",
						"Frauenzimmer",
						"Hofkapelle",
						"Kanzlei",
						"Kloster",
						"Küche",
						"Pfarrei",
						"Universität",
					])
					.optional(),
			},
			{
				name: "type__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "type__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "type__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
		],
		response: PaginatedInstitutionList,
	},
	{
		method: "get",
		path: "/apis/api/apis_ontology.institution/:id/",
		alias: "apis_api_ontology_institution_retrieve",
		description: `Filter a queryset of a listview using the APIS_LIST_VIEW_OBJECT_FILTER
setting if it exists. A child class has to call the &#x60;filter_queryset&#x60;
method somewhere, most likely in the &#x60;get_queryset&#x60; method.`,
		requestFormat: "json",
		parameters: [
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "json+net"]).optional(),
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: InstitutionDetail,
	},
	{
		method: "get",
		path: "/apis/api/apis_ontology.person/",
		alias: "apis_api_ontology_person_list",
		description: `Filter a queryset of a listview using the APIS_LIST_VIEW_OBJECT_FILTER
setting if it exists. A child class has to call the &#x60;filter_queryset&#x60;
method somewhere, most likely in the &#x60;get_queryset&#x60; method.`,
		requestFormat: "json",
		parameters: [
			{
				name: "alternative_label",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "collection__id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "collection__id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "collection__name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date_written",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "end_end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "first_name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "first_name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "first_name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "first_name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "json+net"]).optional(),
			},
			{
				name: "gender",
				type: "Query",
				schema: z.enum(["männlich", "unbekannt", "weiblich"]).optional(),
			},
			{
				name: "gender__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "gender__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "gender__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "notes",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "published",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "references",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "review",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "rootobject_ptr",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype__app_label",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "self_contenttype__id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype__id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "self_contenttype__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "self_contenttype__model",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date_written",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "start_end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "status",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
		],
		response: PaginatedPersonList,
	},
	{
		method: "get",
		path: "/apis/api/apis_ontology.person/:id/",
		alias: "apis_api_ontology_person_retrieve",
		description: `Filter a queryset of a listview using the APIS_LIST_VIEW_OBJECT_FILTER
setting if it exists. A child class has to call the &#x60;filter_queryset&#x60;
method somewhere, most likely in the &#x60;get_queryset&#x60; method.`,
		requestFormat: "json",
		parameters: [
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "json+net"]).optional(),
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: PersonDetail,
	},
	{
		method: "get",
		path: "/apis/api/apis_ontology.place/",
		alias: "apis_api_ontology_place_list",
		description: `Filter a queryset of a listview using the APIS_LIST_VIEW_OBJECT_FILTER
setting if it exists. A child class has to call the &#x60;filter_queryset&#x60;
method somewhere, most likely in the &#x60;get_queryset&#x60; method.`,
		requestFormat: "json",
		parameters: [
			{
				name: "alternative_label",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "collection__id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "collection__id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "collection__name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date_written",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "end_end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "json+net"]).optional(),
			},
			{
				name: "id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "latitude",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "longitude",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "notes",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "published",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "references",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "review",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "rootobject_ptr",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype__app_label",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "self_contenttype__id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype__id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "self_contenttype__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "self_contenttype__model",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date_written",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "start_end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "status",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "type",
				type: "Query",
				schema: z
					.enum([
						"(Land-)Vogtei",
						"Berg",
						"Bergrevier",
						"Burg/Schloss",
						"Dorf/Nachbarschaft/Gemein/Siedlung/Weiler",
						"Gericht",
						"Gewässer",
						"Grundherrschaft",
						"Haus/Hof",
						"Hofmark",
						"Kloster",
						"Land/Herrschaftskomplex",
						"Landschaft/Region",
						"Lehen",
						"Pflege",
						"Propstei",
						"Stadt",
						"Tal",
					])
					.optional(),
			},
			{
				name: "type__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "type__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "type__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
		],
		response: PaginatedPlaceList,
	},
	{
		method: "get",
		path: "/apis/api/apis_ontology.place/:id/",
		alias: "apis_api_ontology_place_retrieve",
		description: `Filter a queryset of a listview using the APIS_LIST_VIEW_OBJECT_FILTER
setting if it exists. A child class has to call the &#x60;filter_queryset&#x60;
method somewhere, most likely in the &#x60;get_queryset&#x60; method.`,
		requestFormat: "json",
		parameters: [
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "json+net"]).optional(),
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: PlaceDetail,
	},
	{
		method: "get",
		path: "/apis/api/apis_ontology.salary/",
		alias: "apis_api_ontology_salary_list",
		description: `Filter a queryset of a listview using the APIS_LIST_VIEW_OBJECT_FILTER
setting if it exists. A child class has to call the &#x60;filter_queryset&#x60;
method somewhere, most likely in the &#x60;get_queryset&#x60; method.`,
		requestFormat: "json",
		parameters: [
			{
				name: "collection",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "collection__id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "collection__id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "collection__name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "collection__name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_date_written",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_date_written__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "end_end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "end_start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "end_start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "json+net"]).optional(),
			},
			{
				name: "id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "name",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "name__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "notes",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "offset",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "published",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "references",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "repetitionType",
				type: "Query",
				schema: z.enum(["einfach", "wiederholend"]).optional(),
			},
			{
				name: "repetitionType__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "repetitionType__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "repetitionType__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "review",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "rootobject_ptr",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype__app_label",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__app_label__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "self_contenttype__id",
				type: "Query",
				schema: z.number().int().optional(),
			},
			{
				name: "self_contenttype__id__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "self_contenttype__in",
				type: "Query",
				schema: z.array(z.number()).optional(),
			},
			{
				name: "self_contenttype__model",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "self_contenttype__model__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_date_written",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_date_written__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "start_end_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_end_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_end_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_end_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__gt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__lt",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "start_start_date__year",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date__year__gt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "start_start_date__year__lt",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "status",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "status__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
			{
				name: "typ",
				type: "Query",
				schema: z
					.enum(["Botenlohn", "Burghut", "Kredit", "Provision", "Sold", "Sonstiges", "Zehrung"])
					.optional(),
			},
			{
				name: "typ__icontains",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "typ__iregex",
				type: "Query",
				schema: z.string().optional(),
			},
			{
				name: "typ__isnull",
				type: "Query",
				schema: z.boolean().optional(),
			},
		],
		response: PaginatedSalaryList,
	},
	{
		method: "get",
		path: "/apis/api/apis_ontology.salary/:id/",
		alias: "apis_api_ontology_salary_retrieve",
		description: `Filter a queryset of a listview using the APIS_LIST_VIEW_OBJECT_FILTER
setting if it exists. A child class has to call the &#x60;filter_queryset&#x60;
method somewhere, most likely in the &#x60;get_queryset&#x60; method.`,
		requestFormat: "json",
		parameters: [
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "json+net"]).optional(),
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: SalaryDetail,
	},
	{
		method: "get",
		path: "apis/entity/:id/",
		alias: "entity_retrieve",
		requestFormat: "json",
		parameters: [
			{
				name: "format",
				type: "Query",
				schema: z.enum(["json", "rdf+n3", "rdf+nquads", "rdf+turtle", "rdf+xml", "tei"]).optional(),
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Entity,
	},
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
	return new Zodios(baseUrl, endpoints, options);
}
