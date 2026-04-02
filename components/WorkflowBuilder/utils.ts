import type { WorkflowEdge, WorkflowNode } from "./types";

/**
 * linearizeWorkflow
 *
 * Takes a list of nodes and edges from a React Flow workflow
 * and sorts the nodes topologically into a linear array.
 *
 * Assumes the workflow is a single, directed path without branches.
 * @param nodes List of workflow nodes
 * @param edges List of workflow edges connecting the nodes
 * @returns An ordered array of nodes from start to end
 */
export const linearizeWorkflow = (
	nodes: WorkflowNode[],
	edges: WorkflowEdge[]
): WorkflowNode[] => {
	if (!nodes.length) return [];

	// Create maps for quick lookup
	const nodeMap = new Map<string, WorkflowNode>();
	const inDegree = new Map<string, number>();
	const adjacencyList = new Map<string, string[]>();

	nodes.forEach((node) => {
		nodeMap.set(node.id, node);
		inDegree.set(node.id, 0);
		adjacencyList.set(node.id, []);
	});

	edges.forEach((edge) => {
		// Only consider edges where both source and target nodes exist in the canvas
		if (nodeMap.has(edge.source) && nodeMap.has(edge.target)) {
			// Increment in-degree for target
			inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);

			// Add to adjacency list (assumes a single outgoing edge in a linear flow, but we use array to be generic)
			adjacencyList.get(edge.source)?.push(edge.target);
		}
	});

	// Find the start node (in-degree 0)
	let startNodeId: string | null = null;
	const entries = Array.from(inDegree.entries());
	for (const [id, degree] of entries) {
		if (degree === 0) {
			startNodeId = id;
			break; // Since it's a linear flow, there should only be one start node
		}
	}

	// Unlinked nodes edge case: if no edges exist but nodes do, just return nodes as is
	if (!startNodeId && nodes.length > 0) {
		return nodes;
	}

	const orderedNodes: WorkflowNode[] = [];
	let currentId: string | undefined | null = startNodeId;

	// Traverse the path
	while (currentId) {
		const currentNode = nodeMap.get(currentId);
		if (currentNode) {
			orderedNodes.push(currentNode);
		}

		// Get the next node. In a strictly linear flow, there should be at most 1 outgoing edge.
		const neighbors = adjacencyList.get(currentId) || [];
		currentId = neighbors.length > 0 ? neighbors[0] : null;
	}

	return orderedNodes;
};
