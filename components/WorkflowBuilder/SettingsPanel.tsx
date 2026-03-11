/**
 * SettingsPanel - Configuration panel for the selected workflow node.
 *
 * Appears on the right when a node is clicked.
 * Allows configuring terminateOnFailure and viewing item metadata.
 */

import { Box, Divider, Flex, Switch, Text, VStack } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { useWorkflowBuilder } from "./WorkflowBuilderContext";

/**
 * Settings panel for configuring the currently selected node.
 */
const SettingsPanel = (): JSX.Element | null => {
	const {
		selectedNodeId,
		selectedNodeData,
		updateNodeConfig,
		removeNode,
		selectNode,
	} = useWorkflowBuilder();

	if (!selectedNodeId || !selectedNodeData) return null;

	const { item, config } = selectedNodeData;

	return (
		<Box
			w="280px"
			minW="280px"
			bg="white"
			borderLeft="1px solid"
			borderColor="gray.200"
			h="100%"
			overflowY="auto"
			p="4"
		>
			{/* Header */}
			<Flex justify="space-between" align="center" mb="4">
				<Text fontSize="sm" fontWeight="700" color="gray.700">
					Node Settings
				</Text>
				<Box
					as="button"
					onClick={() => selectNode(null)}
					cursor="pointer"
					p="1"
					borderRadius="md"
					_hover={{ bg: "gray.100" }}
				>
					<Icon
						name="close"
						style={{ size: "xs", color: "gray.500" }}
					/>
				</Box>
			</Flex>

			<VStack align="stretch" spacing="4">
				{/* Item info */}
				<Box>
					<Text fontSize="md" fontWeight="600">
						{item.label}
					</Text>
					{item.description ? (
						<Text fontSize="xs" color="gray.500" mt="1">
							{item.description}
						</Text>
					) : null}
					{item.category ? (
						<Text fontSize="xs" color="gray.400" mt="1">
							Category: {item.category}
						</Text>
					) : null}
					<Text fontSize="xs" color="gray.400" mt="1">
						ID: {item.id}
					</Text>
				</Box>

				<Divider />

				{/* Configuration */}
				<Box>
					<Text
						fontSize="sm"
						fontWeight="600"
						mb="3"
						color="gray.600"
					>
						Configuration
					</Text>

					<Flex justify="space-between" align="center">
						<Box>
							<Text fontSize="sm">Terminate on Failure</Text>
							<Text fontSize="xs" color="gray.400">
								Stop the entire workflow if this step fails
							</Text>
						</Box>
						<Switch
							isChecked={config.terminateOnFailure}
							onChange={(e) =>
								updateNodeConfig(selectedNodeId, {
									terminateOnFailure: e.target.checked,
								})
							}
							colorScheme="red"
							size="md"
						/>
					</Flex>
				</Box>

				<Divider />

				{/* Meta info */}
				{item.meta && Object.keys(item.meta).length > 0 ? (
					<Box>
						<Text
							fontSize="sm"
							fontWeight="600"
							mb="2"
							color="gray.600"
						>
							Metadata
						</Text>
						<VStack align="stretch" spacing="1">
							{Object.entries(item.meta).map(([key, value]) => (
								<Flex
									key={key}
									justify="space-between"
									fontSize="xs"
								>
									<Text color="gray.500">{key}</Text>
									<Text color="gray.700" fontWeight="500">
										{String(value)}
									</Text>
								</Flex>
							))}
						</VStack>
					</Box>
				) : null}

				{/* Delete node */}
				<Button
					variant="outline"
					size="sm"
					icon="delete"
					onClick={() => {
						removeNode(selectedNodeId);
					}}
				>
					Remove Node
				</Button>
			</VStack>
		</Box>
	);
};

export default SettingsPanel;
