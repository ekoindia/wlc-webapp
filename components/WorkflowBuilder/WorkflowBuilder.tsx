/**
 * WorkflowBuilder - Main entry component for the generic workflow builder.
 *
 * Wraps React Flow canvas with a sidebar palette and settings panel.
 * Fully generic — accepts `items`, optional `renderNode`, and `onSave` props.
 * @example
 * ```tsx
 * <WorkflowBuilder
 *   items={services.map(s => ({ id: s.serviceCode, label: s.name, ... }))}
 *   renderNode={(item, config) => <MyCustomNode item={item} config={config} />}
 *   onSave={(workflow) => console.log(workflow)}
 * />
 * ```
 */

import { Box, Flex, Input, Text } from "@chakra-ui/react";
import {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	ReactFlow,
	ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "components";
import { useCallback, useRef } from "react";
import WorkflowNodeComponent, { setRenderNodeFn } from "./nodes/Node";
import SettingsPanel from "./SettingsPanel";
import Sidebar from "./Sidebar";
import type { WorkflowBuilderProps, WorkflowItem } from "./types";
import {
	WorkflowBuilderProvider,
	useWorkflowBuilder,
} from "./WorkflowBuilderContext";

// ─── Inner component (needs context) ────────────────────────────────

interface InnerBuilderProps {
	items: WorkflowItem[];
}

const nodeTypes = {
	workflowNode: WorkflowNodeComponent as any,
};

const InnerBuilder = ({ items }: InnerBuilderProps): JSX.Element => {
	const {
		nodes,
		edges,
		onNodesChange,
		onEdgesChange,
		onConnect,
		selectNode,
		addNode,
		saveWorkflow,
		clearCanvas,
		workflowName,
		setWorkflowName,
		selectedNodeId,
	} = useWorkflowBuilder();

	const reactFlowWrapper = useRef<HTMLDivElement>(null);

	/** Handle drop from sidebar */
	const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();

			const itemData = event.dataTransfer.getData(
				"application/workflow-item"
			);
			if (!itemData) return;

			try {
				const item: WorkflowItem = JSON.parse(itemData);
				const bounds =
					reactFlowWrapper.current?.getBoundingClientRect();
				const position = {
					x: event.clientX - (bounds?.left ?? 0) - 90,
					y: event.clientY - (bounds?.top ?? 0) - 25,
				};
				addNode(item, position);
			} catch {
				// Ignore invalid data
			}
		},
		[addNode]
	);

	/** Handle node click for selection */
	const onNodeClick = useCallback(
		(_event: React.MouseEvent, node: { id: string }) => {
			selectNode(node.id);
		},
		[selectNode]
	);

	/** Handle pane click to deselect */
	const onPaneClick = useCallback(() => {
		selectNode(null);
	}, [selectNode]);

	return (
		<Flex
			direction="column"
			h="600px"
			border="1px solid"
			borderColor="gray.200"
			borderRadius="xl"
			overflow="hidden"
			bg="white"
		>
			{/* Toolbar */}
			<Flex
				align="center"
				justify="space-between"
				px="4"
				py="2"
				borderBottom="1px solid"
				borderColor="gray.200"
				bg="gray.50"
				flexWrap="wrap"
				gap="2"
			>
				<Flex align="center" gap="2">
					<Input
						size="sm"
						value={workflowName}
						onChange={(e) => setWorkflowName(e.target.value)}
						fontWeight="600"
						maxW="240px"
						variant="flushed"
						borderColor="gray.300"
						_focus={{ borderColor: "primary.DEFAULT" }}
					/>
					<Text fontSize="xs" color="gray.400">
						{nodes.length} node{nodes.length !== 1 ? "s" : ""}
					</Text>
				</Flex>

				<Flex gap="2">
					<Button
						variant="ghost"
						size="sm"
						onClick={clearCanvas}
						disabled={nodes.length === 0}
					>
						Clear
					</Button>
					<Button
						variant="primary"
						size="sm"
						icon="save"
						iconStyle={{ size: "xs" }}
						onClick={saveWorkflow}
					>
						Save Workflow
					</Button>
				</Flex>
			</Flex>

			{/* Main area */}
			<Flex flex="1" overflow="hidden">
				{/* Left sidebar */}
				<Sidebar items={items} />

				{/* Canvas */}
				<Box
					flex="1"
					ref={reactFlowWrapper}
					sx={{
						"& .react-flow__edges": {
							width: "100%",
							height: "100%",
							top: 0,
							left: 0,
						},
					}}
				>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						onNodeClick={onNodeClick}
						onPaneClick={onPaneClick}
						onDragOver={onDragOver}
						onDrop={onDrop}
						nodeTypes={nodeTypes}
						deleteKeyCode={["Backspace", "Delete"]}
						fitView={true}
						// style={{ width: "100%", height: "100%" }}
						// defaultEdgeOptions={{
						// 	style: {
						// 		stroke: "#171818",
						// 		strokeWidth: 2,
						// 	},
						// 	animated: false,
						// }}
					>
						<Controls />
						<MiniMap
							nodeStrokeWidth={3}
							style={{ height: 80, width: 120 }}
						/>
						<Background
							variant={BackgroundVariant.Dots}
							gap={16}
							size={1}
						/>
					</ReactFlow>
				</Box>

				{/* Right settings panel */}
				{selectedNodeId ? <SettingsPanel /> : null}
			</Flex>
		</Flex>
	);
};

// ─── Main exported component ─────────────────────────────────────────

/**
 * WorkflowBuilder - Generic, reusable workflow builder component.
 * @param {WorkflowBuilderProps} props - Component props
 * @returns {JSX.Element} The full workflow builder UI
 */
const WorkflowBuilder = ({
	items,
	renderNode,
	onSave,
	storageKey,
	initialWorkflow,
}: WorkflowBuilderProps): JSX.Element => {
	// Set the render function for custom nodes
	setRenderNodeFn(renderNode);

	return (
		<ReactFlowProvider>
			<WorkflowBuilderProvider
				storageKey={storageKey}
				initialWorkflow={initialWorkflow}
				onSave={onSave}
			>
				<InnerBuilder items={items} />
			</WorkflowBuilderProvider>
		</ReactFlowProvider>
	);
};

export default WorkflowBuilder;
