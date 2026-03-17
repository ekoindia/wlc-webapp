/**
 * Node - Custom React Flow node component for the WorkflowBuilder.
 *
 * Acts as a wrapper that renders the consumer-provided `renderNode` function
 * inside standard node chrome (handles, delete button).
 * Falls back to a default display if no renderNode is provided.
 */

import { Box, Flex, Text } from "@chakra-ui/react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Icon } from "components";
import { memo } from "react";
import type {
	WorkflowItem,
	WorkflowNodeConfig,
	WorkflowNodeData,
} from "../types";

/**
 * Custom render function type — passed from the consumer via context.
 * Stored on module-level so the memo'd component can access it without prop drilling.
 */
let _renderNodeFn:
	| ((_item: WorkflowItem, _config: WorkflowNodeConfig) => React.ReactNode)
	| undefined;

/**
 * Set the custom render function (called by WorkflowBuilder before mount)
 * @param fn
 */
export const setRenderNodeFn = (
	fn?: (_item: WorkflowItem, _config: WorkflowNodeConfig) => React.ReactNode
): void => {
	_renderNodeFn = fn;
};

/**
 * Default node content when no renderNode is provided.
 * @param root0
 * @param root0.data
 */
const DefaultNodeContent = ({
	data,
}: {
	data: WorkflowNodeData;
}): JSX.Element => (
	<Box>
		<Text fontSize="sm" fontWeight="600" noOfLines={1}>
			{data.item.label}
		</Text>
		{data.item.description ? (
			<Text fontSize="xs" color="gray.500" noOfLines={2} mt="1">
				{data.item.description}
			</Text>
		) : null}
		{data.item.category ? (
			<Text fontSize="2xs" color="gray.400" mt="1">
				{data.item.category}
			</Text>
		) : null}
	</Box>
);

/**
 * WorkflowNode component rendered by React Flow.
 * @param props
 */
const WorkflowNodeComponent = (props: NodeProps): JSX.Element => {
	const data = props.data as WorkflowNodeData;
	const selected = props.selected;
	const config = data.config;

	return (
		<Box
			bg="white"
			border="2px solid"
			borderColor={selected ? "primary.DEFAULT" : "gray.200"}
			borderRadius="xl"
			p="3"
			minW="180px"
			maxW="240px"
			boxShadow={
				selected
					? "0 0 0 2px var(--chakra-colors-primary-DEFAULT)"
					: "md"
			}
			transition="all 0.15s ease"
			_hover={{ borderColor: "primary.DEFAULT", boxShadow: "lg" }}
			position="relative"
			overflow="visible"
		>
			{/* Input handle (left) */}
			<Handle
				id="target"
				type="target"
				position={Position.Left}
				isConnectable={true}
				style={{
					width: 12,
					height: 12,
					background: "#718096",
					border: "2px solid white",
					pointerEvents: "all",
				}}
			/>

			{/* Terminate-on-failure badge */}
			{config.terminateOnFailure ? (
				<Box
					position="absolute"
					top="-2"
					right="-2"
					bg="red.500"
					borderRadius="full"
					w="5"
					h="5"
					display="flex"
					alignItems="center"
					justifyContent="center"
					title="Terminates on failure"
					zIndex={5}
				>
					<Icon
						name="close"
						style={{ size: "2xs", color: "white" }}
					/>
				</Box>
			) : null}

			{/* Content */}
			<Flex direction="column" gap="1">
				{_renderNodeFn ? (
					_renderNodeFn(data.item, data.config)
				) : (
					<DefaultNodeContent data={data} />
				)}
			</Flex>

			{/* Output handle (right) */}
			<Handle
				id="source"
				type="source"
				position={Position.Right}
				isConnectable={true}
				style={{
					width: 12,
					height: 12,
					background: "#4A5568",
					border: "2px solid white",
					pointerEvents: "all",
				}}
			/>
		</Box>
	);
};

export default memo(WorkflowNodeComponent);
