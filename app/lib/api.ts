import { type Client, createClient } from "./api-generated/client";
import * as sdk from "./api-generated/sdk.gen";

interface ClientOptions {
	client: Client;
	throwOnError: true;
}

export function createApiClient(baseUrl: string) {
	const client = createClient({
		baseUrl,
		querySerializer: { array: { explode: true, style: "form" } },
	});

	function list<Query, Result>(
		operation: (options: ClientOptions & { query?: Query }) => Promise<Result>,
	) {
		return ({ queries }: { queries?: Query } = {}) => {
			return operation({ client, query: queries, throwOnError: true });
		};
	}

	function withParams<Path, Query, Result>(
		operation: (options: ClientOptions & { path: Path; query?: Query }) => Promise<Result>,
	) {
		return ({ params, queries }: { params: Path; queries?: Query }) => {
			return operation({ client, path: params, query: queries, throwOnError: true });
		};
	}

	return {
		"apis_api_apis_ontology.event_list": list(sdk.apisApiApisOntologyEventList<true>),
		"apis_api_apis_ontology.event_retrieve": withParams(sdk.apisApiApisOntologyEventRetrieve<true>),
		"apis_api_apis_ontology.event_relations_list": withParams(
			sdk.apisApiApisOntologyEventRelationsList<true>,
		),
		"apis_api_apis_ontology.function_list": list(sdk.apisApiApisOntologyFunctionList<true>),
		"apis_api_apis_ontology.function_retrieve": withParams(
			sdk.apisApiApisOntologyFunctionRetrieve<true>,
		),
		"apis_api_apis_ontology.function_relations_list": withParams(
			sdk.apisApiApisOntologyFunctionRelationsList<true>,
		),
		"apis_api_apis_ontology.institution_list": list(sdk.apisApiApisOntologyInstitutionList<true>),
		"apis_api_apis_ontology.institution_retrieve": withParams(
			sdk.apisApiApisOntologyInstitutionRetrieve<true>,
		),
		"apis_api_apis_ontology.institution_relations_list": withParams(
			sdk.apisApiApisOntologyInstitutionRelationsList<true>,
		),
		"apis_api_apis_ontology.person_list": list(sdk.apisApiApisOntologyPersonList<true>),
		"apis_api_apis_ontology.person_retrieve": withParams(
			sdk.apisApiApisOntologyPersonRetrieve<true>,
		),
		"apis_api_apis_ontology.person_relations_list": withParams(
			sdk.apisApiApisOntologyPersonRelationsList<true>,
		),
		"apis_api_apis_ontology.place_list": list(sdk.apisApiApisOntologyPlaceList<true>),
		"apis_api_apis_ontology.place_retrieve": withParams(sdk.apisApiApisOntologyPlaceRetrieve<true>),
		"apis_api_apis_ontology.place_relations_list": withParams(
			sdk.apisApiApisOntologyPlaceRelationsList<true>,
		),
		"apis_api_apis_ontology.salary_list": list(sdk.apisApiApisOntologySalaryList<true>),
		"apis_api_apis_ontology.salary_retrieve": withParams(
			sdk.apisApiApisOntologySalaryRetrieve<true>,
		),
		"apis_api_apis_ontology.salary_relations_list": withParams(
			sdk.apisApiApisOntologySalaryRelationsList<true>,
		),
		apis_api_network_list: list(sdk.apisApiNetworkList<true>),
	};
}
