/**
 * Types for the generic WorkflowBuilder component.
 * These are agnostic of any specific domain (KYC, onboarding, etc.).
 */

import type { Edge, Node } from "@xyflow/react";

/**
 * Generic item that can be placed on the workflow canvas.
 * The consumer maps their domain objects to this shape.
 */
export interface WorkflowItem {
	/** Unique identifier for the item (e.g., serviceCode) */
	id: string;
	/** Display label */
	label: string;
	/** Optional category for grouping in the sidebar */
	category?: string;
	/** Optional description */
	description?: string;
	/** Optional icon name */
	icon?: string;
	/** Any additional domain-specific data the consumer wants to attach */
	meta?: Record<string, unknown>;
}

/**
 * Configuration stored on each node in the workflow.
 */
export interface WorkflowNodeConfig {
	/** Whether the workflow should terminate if this node fails */
	terminateOnFailure: boolean;
	/** Any additional config the consumer attaches */
	[key: string]: unknown;
}

/**
 * Data payload stored inside each React Flow node.
 */
export interface WorkflowNodeData {
	/** The original item this node represents */
	item: WorkflowItem;
	/** Node-level configuration */
	config: WorkflowNodeConfig;
	/** Label for display (React Flow uses this) */
	label: string;
	/** Index signature for React Flow compatibility */
	[key: string]: unknown;
}

/** Typed React Flow node for the workflow builder */
export type WorkflowNode = Node<WorkflowNodeData, "workflowNode">;

/** Typed React Flow edge for the workflow builder */
export type WorkflowEdge = Edge;

/**
 * Serialized workflow state for persistence (localStorage / API).
 */
export interface SerializedWorkflow {
	/** Unique identifier for the workflow */
	id: string;
	/** Workflow display name */
	name: string;
	/** Serialized nodes */
	nodes: WorkflowNode[];
	/** Serialized edges */
	edges: WorkflowEdge[];
	/** Timestamp of last save */
	updatedAt: number;
}

/**
 * Props for the main WorkflowBuilder component.
 */
export interface WorkflowBuilderProps {
	/** Available items to place on the canvas */
	items: WorkflowItem[];
	/** Custom render function for the node content */
	renderNode?: (
		_item: WorkflowItem,
		_config: WorkflowNodeConfig
	) => React.ReactNode;
	/** Callback when the workflow is saved */
	onSave?: (_workflow: SerializedWorkflow) => void;
	/** Callback when the Run button is clicked (if provided, Run button will be visible) */
	onRun?: (_workflowId: string) => void;
	/** Storage key for localStorage persistence (defaults to 'workflow-builder') */
	storageKey?: string;
	/** Initial workflow to load (overrides localStorage) */
	initialWorkflow?: SerializedWorkflow;
}
