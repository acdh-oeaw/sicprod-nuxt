import type { LinkObject, NodeObject } from "force-graph";

export interface GraphNode extends NodeObject {
	id: string;
	name: string;
	/** Node degree, used for node size and forces. */
	val: number;
	color?: string;
	/** Entity type, used for the detail page path. */
	class?: string;
}

export type GraphLink = LinkObject<GraphNode>;

export interface GraphData {
	nodes: Array<GraphNode>;
	links: Array<GraphLink>;
}
