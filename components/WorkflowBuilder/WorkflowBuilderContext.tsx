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

// ─── Types ───────────────────────────────────────────────────────────

interface StorageData {
	workflows: Record<string, SerializedWorkflow>;
	currentId: string;
}

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
	/** List of all saved workflows */
	savedWorkflows: SerializedWorkflow[];
	/** Currently active workflow ID */
	currentWorkflowId: string;
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
	/** Save the workflow manually (calls onSave) */
	saveWorkflow: () => void;
	/** Clear the entire canvas */
	clearCanvas: () => void;
	/** Create a new blank workflow */
	createNewWorkflow: () => void;
	/** Load an existing workflow */
	loadWorkflow: (_id: string) => void;
	/** Delete a workflow */
	deleteWorkflow: (_id: string) => void;
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

// ─── Helpers ─────────────────────────────────────────────────────────

const generateId = () =>
	`wf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

const loadFromStorage = (key: string): StorageData | null => {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (
			parsed &&
			typeof parsed === "object" &&
			parsed.workflows &&
			parsed.currentId
		) {
			return parsed as StorageData;
		}
		// Backwards compatibility for single workflow format
		if (
			parsed &&
			typeof parsed === "object" &&
			parsed.nodes &&
			parsed.edges
		) {
			const id = parsed.id || generateId();
			return {
				workflows: {
					[id]: { ...parsed, id },
				},
				currentId: id,
			};
		}
		return null;
	} catch {
		return null;
	}
};

const persistToStorage = (key: string, data: StorageData): void => {
	try {
		localStorage.setItem(key, JSON.stringify(data));
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
	const onSaveRef = useRef(onSave);
	onSaveRef.current = onSave;

	const [workflows, setWorkflows] = useState<
		Record<string, SerializedWorkflow>
	>({});
	const [currentId, setCurrentId] = useState<string>("");

	const [nodes, setNodes] = useState<WorkflowNode[]>([]);
	const [edges, setEdges] = useState<WorkflowEdge[]>([]);
	const [workflowName, setWorkflowName] =
		useState<string>("Untitled Workflow");
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

	// Initialize state
	useEffect(() => {
		const data = loadFromStorage(storageKey);
		let initialWorkflows = data?.workflows ?? {};
		let initialId = data?.currentId;

		if (initialWorkflow) {
			const id = initialWorkflow.id || generateId();
			initialWorkflows = {
				...initialWorkflows,
				[id]: { ...initialWorkflow, id },
			};
			initialId = id;
		}

		if (Object.keys(initialWorkflows).length === 0) {
			const newId = generateId();
			initialId = newId;
			initialWorkflows = {
				[newId]: {
					id: newId,
					name: "Untitled Workflow",
					nodes: [],
					edges: [],
					updatedAt: Date.now(),
				},
			};
		} else if (!initialId || !initialWorkflows[initialId]) {
			initialId = Object.keys(initialWorkflows)[0];
		}

		setWorkflows(initialWorkflows);
		setCurrentId(initialId);

		const current = initialWorkflows[initialId];
		if (current) {
			setNodes(current.nodes);
			setEdges(current.edges);
			setWorkflowName(current.name);
		}
	}, [storageKey, initialWorkflow]);

	// Auto-persist debounced
	useEffect(() => {
		if (!currentId) return;

		const timer = setTimeout(() => {
			const updatedWorkflow: SerializedWorkflow = {
				id: currentId,
				name: workflowName,
				nodes,
				edges,
				updatedAt: Date.now(),
			};

			setWorkflows((prev) => {
				const next = { ...prev, [currentId]: updatedWorkflow };
				persistToStorage(storageKey, { workflows: next, currentId });
				return next;
			});
		}, 500);

		return () => clearTimeout(timer);
	}, [nodes, edges, workflowName, currentId, storageKey]);

	const loadWorkflow = useCallback(
		(id: string) => {
			if (!workflows[id]) return;
			setCurrentId(id);
			setNodes(workflows[id].nodes);
			setEdges(workflows[id].edges);
			setWorkflowName(workflows[id].name);
			setSelectedNodeId(null);
			// Update currentId in storage
			persistToStorage(storageKey, { workflows, currentId: id });
		},
		[workflows, storageKey]
	);

	const createNewWorkflow = useCallback(() => {
		const newId = generateId();
		const newWorkflow: SerializedWorkflow = {
			id: newId,
			name: "Untitled Workflow",
			nodes: [],
			edges: [],
			updatedAt: Date.now(),
		};
		setWorkflows((prev) => {
			const next = { ...prev, [newId]: newWorkflow };
			persistToStorage(storageKey, { workflows: next, currentId: newId });
			return next;
		});
		setCurrentId(newId);
		setNodes([]);
		setEdges([]);
		setWorkflowName("Untitled Workflow");
		setSelectedNodeId(null);
	}, [storageKey]);

	const deleteWorkflow = useCallback(
		(id: string) => {
			setWorkflows((prev) => {
				const next = { ...prev };
				delete next[id];

				if (Object.keys(next).length === 0) {
					const newId = generateId();
					const fallback: SerializedWorkflow = {
						id: newId,
						name: "Untitled Workflow",
						nodes: [],
						edges: [],
						updatedAt: Date.now(),
					};
					next[newId] = fallback;
					setCurrentId(newId);
					setNodes([]);
					setEdges([]);
					setWorkflowName("Untitled Workflow");
					setSelectedNodeId(null);
					persistToStorage(storageKey, {
						workflows: next,
						currentId: newId,
					});
				} else if (id === currentId) {
					const fallbackId = Object.keys(next)[0];
					const fallback = next[fallbackId];
					setCurrentId(fallbackId);
					setNodes(fallback.nodes);
					setEdges(fallback.edges);
					setWorkflowName(fallback.name);
					setSelectedNodeId(null);
					persistToStorage(storageKey, {
						workflows: next,
						currentId: fallbackId,
					});
				} else {
					persistToStorage(storageKey, {
						workflows: next,
						currentId,
					});
				}

				return next;
			});
		},
		[currentId, storageKey]
	);

	// ── React Flow change handlers ──────────────────────────────────

	const onNodesChange = useCallback((changes: NodeChange<WorkflowNode>[]) => {
		setNodes((nds) => applyNodeChanges(changes, nds));
	}, []);

	const onEdgesChange = useCallback((changes: EdgeChange<WorkflowEdge>[]) => {
		setEdges((eds) => applyEdgeChanges(changes, eds));
	}, []);

	const onConnect = useCallback((connection: Connection) => {
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
			// Use the raw item ID (e.g., serviceCode) directly so it can be easily looked up
			const id = item.id;

			// Prevent adding duplicate services since workflow path is linear and ID must be unique
			if (nodes.some((n) => n.id === id)) {
				console.warn(`Node with id ${id} already exists in workflow.`);
				return;
			}

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

	// ── Save & Clear ────────────────────────────────────────────────

	const saveWorkflow = useCallback(() => {
		const workflow: SerializedWorkflow = {
			id: currentId,
			name: workflowName,
			nodes,
			edges,
			updatedAt: Date.now(),
		};
		setWorkflows((prev) => {
			const next = { ...prev, [currentId]: workflow };
			persistToStorage(storageKey, { workflows: next, currentId });
			return next;
		});
		onSaveRef.current?.(workflow);
	}, [currentId, workflowName, nodes, edges, storageKey]);

	const clearCanvas = useCallback(() => {
		setNodes([]);
		setEdges([]);
		setSelectedNodeId(null);
	}, []);

	// ── Context value ───────────────────────────────────────────────

	const ObjectValues = useMemo(() => Object.values(workflows), [workflows]);

	const savedWorkflows = useMemo(
		() => ObjectValues.sort((a, b) => b.updatedAt - a.updatedAt),
		[ObjectValues]
	);

	const contextValue: WorkflowBuilderContextState = useMemo(
		() => ({
			nodes,
			edges,
			selectedNodeId,
			selectedNodeData,
			workflowName,
			setWorkflowName,
			savedWorkflows,
			currentWorkflowId: currentId,
			createNewWorkflow,
			loadWorkflow,
			deleteWorkflow,
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
			savedWorkflows,
			currentId,
			createNewWorkflow,
			loadWorkflow,
			deleteWorkflow,
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

export const useWorkflowBuilder = (): WorkflowBuilderContextState => {
	const ctx = useContext(WorkflowBuilderContext);
	if (!ctx) {
		throw new Error(
			"useWorkflowBuilder must be used within a <WorkflowBuilderProvider>"
		);
	}
	return ctx;
};
