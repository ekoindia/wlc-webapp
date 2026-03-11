/**
 * WorkflowBuilderContext
 *
 * Localized context for the WorkflowBuilder component.
 * Manages React Flow nodes, edges, selection, and localStorage persistence.
 * This context is NOT global — it wraps only the builder UI.
 */

import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	type Connection,
	type EdgeChange,
	type NodeChange,
} from "@xyflow/react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type {
	SerializedWorkflow,
	WorkflowEdge,
	WorkflowItem,
	WorkflowNode,
	WorkflowNodeConfig,
	WorkflowNodeData,
} from "./types";

// ─── Constants ───────────────────────────────────────────────────────

const DEFAULT_STORAGE_KEY = "workflow-builder";
const DEFAULT_NODE_CONFIG: WorkflowNodeConfig = {
	terminateOnFailure: true,
};

// ─── Context Shape ───────────────────────────────────────────────────

interface WorkflowBuilderContextState {
	/** Current nodes on the canvas */
	nodes: WorkflowNode[];
	/** Current edges (connections) */
	edges: WorkflowEdge[];
	/** Currently selected node ID */
	selectedNodeId: string | null;
	/** Currently selected node data */
	selectedNodeData: WorkflowNodeData | null;
	/** Workflow name */
	workflowName: string;
	/** Set workflow name */
	setWorkflowName: (_name: string) => void;
	/** React Flow onNodesChange handler */
	onNodesChange: (_changes: NodeChange<WorkflowNode>[]) => void;
	/** React Flow onEdgesChange handler */
	onEdgesChange: (_changes: EdgeChange<WorkflowEdge>[]) => void;
	/** React Flow onConnect handler */
	onConnect: (_connection: Connection) => void;
	/** Add a new node from a WorkflowItem */
	addNode: (
		_item: WorkflowItem,
		_position?: { x: number; y: number }
	) => void;
	/** Remove a node by ID */
	removeNode: (_nodeId: string) => void;
	/** Update config for a specific node */
	updateNodeConfig: (
		_nodeId: string,
		_config: Partial<WorkflowNodeConfig>
	) => void;
	/** Select a node */
	selectNode: (_nodeId: string | null) => void;
	/** Save the workflow (calls onSave + persists to localStorage) */
	saveWorkflow: () => void;
	/** Clear the entire canvas */
	clearCanvas: () => void;
}

const WorkflowBuilderContext =
	createContext<WorkflowBuilderContextState | null>(null);

// ─── Provider Props ──────────────────────────────────────────────────

interface WorkflowBuilderProviderProps {
	children: React.ReactNode;
	storageKey?: string;
	initialWorkflow?: SerializedWorkflow;
	onSave?: (_workflow: SerializedWorkflow) => void;
}

// ─── Helper: Load from localStorage ──────────────────────────────────

const loadFromStorage = (key: string): SerializedWorkflow | null => {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;
		return JSON.parse(raw) as SerializedWorkflow;
	} catch {
		return null;
	}
};

// ─── Helper: Save to localStorage ────────────────────────────────────

const persistToStorage = (key: string, workflow: SerializedWorkflow): void => {
	try {
		localStorage.setItem(key, JSON.stringify(workflow));
	} catch (err) {
		console.error(
			"[WorkflowBuilder] Failed to persist to localStorage:",
			err
		);
	}
};

// ─── Provider ────────────────────────────────────────────────────────

export const WorkflowBuilderProvider = ({
	children,
	storageKey = DEFAULT_STORAGE_KEY,
	initialWorkflow,
	onSave,
}: WorkflowBuilderProviderProps): JSX.Element => {
	// Resolve initial state: prop > localStorage > empty
	const resolved = useMemo(() => {
		if (initialWorkflow) return initialWorkflow;
		return loadFromStorage(storageKey);
	}, [initialWorkflow, storageKey]);

	const [nodes, setNodes] = useState<WorkflowNode[]>(resolved?.nodes ?? []);
	console.log("[WorkflowBuilder] Nodes:", nodes);
	const [edges, setEdges] = useState<WorkflowEdge[]>(resolved?.edges ?? []);
	console.log("[WorkflowBuilder] Edges:", edges);
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const [workflowName, setWorkflowName] = useState<string>(
		resolved?.name ?? "Untitled Workflow"
	);

	// Keep a ref of the save callback so it doesn't cause re-renders
	const onSaveRef = useRef(onSave);
	onSaveRef.current = onSave;

	// ── React Flow change handlers ──────────────────────────────────

	const onNodesChange = useCallback((changes: NodeChange<WorkflowNode>[]) => {
		setNodes((nds) => applyNodeChanges(changes, nds));
	}, []);

	const onEdgesChange = useCallback((changes: EdgeChange<WorkflowEdge>[]) => {
		setEdges((eds) => applyEdgeChanges(changes, eds));
	}, []);

	const onConnect = useCallback((connection: Connection) => {
		console.log("[WorkflowBuilder] onConnect", connection);
		const newConnection = {
			...connection,
			sourceHandle: connection.sourceHandle || "source",
			targetHandle: connection.targetHandle || "target",
		};
		setEdges((eds) => addEdge(newConnection, eds));
	}, []);

	// ── Node CRUD ───────────────────────────────────────────────────

	const addNode = useCallback(
		(item: WorkflowItem, position?: { x: number; y: number }) => {
			const id = `${item.id}_${Date.now()}`;
			const newNode: WorkflowNode = {
				id,
				type: "workflowNode",
				position: position ?? { x: 250, y: (nodes.length + 1) * 100 },
				data: {
					item,
					config: { ...DEFAULT_NODE_CONFIG },
					label: item.label,
				},
			};
			setNodes((prev) => [...prev, newNode]);
		},
		[nodes.length]
	);

	const removeNode = useCallback((nodeId: string) => {
		setNodes((prev) => prev.filter((n) => n.id !== nodeId));
		setEdges((prev) =>
			prev.filter((e) => e.source !== nodeId && e.target !== nodeId)
		);
		setSelectedNodeId((prev) => (prev === nodeId ? null : prev));
	}, []);

	const updateNodeConfig = useCallback(
		(nodeId: string, config: Partial<WorkflowNodeConfig>) => {
			setNodes((prev) =>
				prev.map((n) =>
					n.id === nodeId
						? {
								...n,
								data: {
									...n.data,
									config: { ...n.data.config, ...config },
								},
							}
						: n
				)
			);
		},
		[]
	);

	// ── Selection ───────────────────────────────────────────────────

	const selectNode = useCallback((nodeId: string | null) => {
		setSelectedNodeId(nodeId);
	}, []);

	const selectedNodeData = useMemo(() => {
		if (!selectedNodeId) return null;
		const node = nodes.find((n) => n.id === selectedNodeId);
		return node?.data ?? null;
	}, [nodes, selectedNodeId]);

	// ── Persistence ─────────────────────────────────────────────────

	const saveWorkflow = useCallback(() => {
		const workflow: SerializedWorkflow = {
			name: workflowName,
			nodes,
			edges,
			updatedAt: Date.now(),
		};
		persistToStorage(storageKey, workflow);
		onSaveRef.current?.(workflow);
	}, [workflowName, nodes, edges, storageKey]);

	// Auto-persist on changes (debounced via effect)
	useEffect(() => {
		const timer = setTimeout(() => {
			const workflow: SerializedWorkflow = {
				name: workflowName,
				nodes,
				edges,
				updatedAt: Date.now(),
			};
			persistToStorage(storageKey, workflow);
		}, 500);
		return () => clearTimeout(timer);
	}, [nodes, edges, workflowName, storageKey]);

	// ── Clear canvas ────────────────────────────────────────────────

	const clearCanvas = useCallback(() => {
		setNodes([]);
		setEdges([]);
		setSelectedNodeId(null);
	}, []);

	// ── Context value ───────────────────────────────────────────────

	const contextValue: WorkflowBuilderContextState = useMemo(
		() => ({
			nodes,
			edges,
			selectedNodeId,
			selectedNodeData,
			workflowName,
			setWorkflowName,
			onNodesChange,
			onEdgesChange,
			onConnect,
			addNode,
			removeNode,
			updateNodeConfig,
			selectNode,
			saveWorkflow,
			clearCanvas,
		}),
		[
			nodes,
			edges,
			selectedNodeId,
			selectedNodeData,
			workflowName,
			onNodesChange,
			onEdgesChange,
			onConnect,
			addNode,
			removeNode,
			updateNodeConfig,
			selectNode,
			saveWorkflow,
			clearCanvas,
		]
	);

	return (
		<WorkflowBuilderContext.Provider value={contextValue}>
			{children}
		</WorkflowBuilderContext.Provider>
	);
};

/**
 * Hook to consume the WorkflowBuilder context.
 * Must be called within a <WorkflowBuilderProvider>.
 */
export const useWorkflowBuilder = (): WorkflowBuilderContextState => {
	const ctx = useContext(WorkflowBuilderContext);
	if (!ctx) {
		throw new Error(
			"useWorkflowBuilder must be used within a <WorkflowBuilderProvider>"
		);
	}
	return ctx;
};
