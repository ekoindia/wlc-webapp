import type { WorkflowEdge, WorkflowNode } from "../types";
import { linearizeWorkflow } from "../utils";

describe("linearizeWorkflow", () => {
	it("returns empty array for empty input", () => {
		expect(linearizeWorkflow([], [])).toEqual([]);
	});

	it("returns the same node if there are no edges", () => {
		const nodes: WorkflowNode[] = [
			{
				id: "A",
				type: "workflowNode",
				position: { x: 0, y: 0 },
				data: {} as any,
			},
		];
		expect(linearizeWorkflow(nodes, [])).toEqual(nodes);
	});

	it("linearly orders two connected nodes", () => {
		const nodes: WorkflowNode[] = [
			{
				id: "B",
				type: "workflowNode",
				position: { x: 0, y: 0 },
				data: {} as any,
			},
			{
				id: "A",
				type: "workflowNode",
				position: { x: 0, y: 0 },
				data: {} as any,
			},
		];
		const edges: WorkflowEdge[] = [
			{ id: "e1", source: "A", target: "B" } as any,
		];

		const result = linearizeWorkflow(nodes, edges);
		expect(result).toHaveLength(2);
		expect(result[0].id).toBe("A");
		expect(result[1].id).toBe("B");
	});

	it("linearly orders multiple connected nodes correctly", () => {
		const nodes: WorkflowNode[] = [
			{
				id: "C",
				type: "workflowNode",
				position: { x: 0, y: 0 },
				data: {} as any,
			},
			{
				id: "A",
				type: "workflowNode",
				position: { x: 0, y: 0 },
				data: {} as any,
			},
			{
				id: "D",
				type: "workflowNode",
				position: { x: 0, y: 0 },
				data: {} as any,
			},
			{
				id: "B",
				type: "workflowNode",
				position: { x: 0, y: 0 },
				data: {} as any,
			},
		];
		// A -> B -> C -> D
		const edges: WorkflowEdge[] = [
			{ id: "e1", source: "A", target: "B" } as any,
			{ id: "e2", source: "B", target: "C" } as any,
			{ id: "e3", source: "C", target: "D" } as any,
		];

		const result = linearizeWorkflow(nodes, edges);
		expect(result).toHaveLength(4);
		expect(result[0].id).toBe("A");
		expect(result[1].id).toBe("B");
		expect(result[2].id).toBe("C");
		expect(result[3].id).toBe("D");
	});

	it("ignores edges with invalid source or target", () => {
		const nodes: WorkflowNode[] = [
			{
				id: "A",
				type: "workflowNode",
				position: { x: 0, y: 0 },
				data: {} as any,
			},
			{
				id: "B",
				type: "workflowNode",
				position: { x: 0, y: 0 },
				data: {} as any,
			},
		];

		const edges: WorkflowEdge[] = [
			{ id: "e1", source: "A", target: "B" } as any,
			{ id: "e2", source: "B", target: "X" } as any,
		];

		const result = linearizeWorkflow(nodes, edges);
		expect(result).toHaveLength(2);
		expect(result[0].id).toBe("A");
		expect(result[1].id).toBe("B");
	});
});
