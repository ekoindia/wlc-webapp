/**
 * Sidebar - Draggable palette of available items for the WorkflowBuilder.
 *
 * Renders a list of WorkflowItems that the admin can drag onto the canvas.
 * Also supports click-to-add.
 */

import { Box, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { Icon } from "components";
import { useMemo, useState } from "react";
import type { WorkflowItem } from "./types";
import { useWorkflowBuilder } from "./WorkflowBuilderContext";

interface SidebarProps {
	/** Items available for placement */
	items: WorkflowItem[];
}

/**
 * Sidebar palette for the workflow builder.
 * Supports search filtering and drag-to-add or click-to-add.
 * @param root0
 * @param root0.items
 */
const Sidebar = ({ items }: SidebarProps): JSX.Element => {
	const { addNode } = useWorkflowBuilder();
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		if (!search.trim()) return items;
		const q = search.toLowerCase();
		return items.filter(
			(item) =>
				item.label.toLowerCase().includes(q) ||
				item.description?.toLowerCase().includes(q) ||
				item.category?.toLowerCase().includes(q)
		);
	}, [items, search]);

	/** Group items by category */
	const grouped = useMemo(() => {
		const map = new Map<string, WorkflowItem[]>();
		for (const item of filtered) {
			const cat = item.category ?? "Other";
			if (!map.has(cat)) map.set(cat, []);
			map.get(cat)!.push(item);
		}
		return map;
	}, [filtered]);

	const onDragStart = (
		event: React.DragEvent<HTMLDivElement>,
		item: WorkflowItem
	): void => {
		event.dataTransfer.setData(
			"application/workflow-item",
			JSON.stringify(item)
		);
		event.dataTransfer.effectAllowed = "move";
	};

	return (
		<Box
			w="260px"
			minW="260px"
			bg="gray.50"
			borderRight="1px solid"
			borderColor="gray.200"
			h="100%"
			overflowY="auto"
			p="3"
		>
			<Text fontSize="sm" fontWeight="700" mb="3" color="gray.700">
				Available Items
			</Text>

			<Input
				size="sm"
				placeholder="Search items..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				mb="3"
				borderRadius="md"
				bg="white"
			/>

			<VStack align="stretch" spacing="3">
				{Array.from(grouped.entries()).map(
					([category, categoryItems]) => (
						<Box key={category}>
							<Text
								fontSize="xs"
								fontWeight="600"
								color="gray.500"
								textTransform="uppercase"
								mb="1"
								letterSpacing="wider"
							>
								{category}
							</Text>

							<VStack align="stretch" spacing="1">
								{categoryItems.map((item) => (
									<Flex
										key={item.id}
										align="center"
										gap="2"
										p="2"
										bg="white"
										borderRadius="md"
										border="1px solid"
										borderColor="gray.200"
										cursor="grab"
										_hover={{
											borderColor: "primary.DEFAULT",
											bg: "primary.50",
										}}
										_active={{ cursor: "grabbing" }}
										draggable
										onDragStart={(e) =>
											onDragStart(e, item)
										}
										onClick={() => addNode(item)}
										transition="all 0.15s ease"
									>
										{item.icon ? (
											<Icon
												name={item.icon}
												style={{
													size: "xs",
													color: "gray.600",
												}}
											/>
										) : (
											<Box
												w="6"
												h="6"
												bg="gray.200"
												borderRadius="md"
												flexShrink={0}
											/>
										)}

										<Box flex="1" minW="0">
											<Text
												fontSize="xs"
												fontWeight="500"
												noOfLines={1}
											>
												{item.label}
											</Text>
											{item.description ? (
												<Text
													fontSize="2xs"
													color="gray.400"
													noOfLines={1}
												>
													{item.description}
												</Text>
											) : null}
										</Box>

										<Icon
											name="add"
											style={{
												size: "xs",
												color: "gray.400",
											}}
										/>
									</Flex>
								))}
							</VStack>
						</Box>
					)
				)}

				{filtered.length === 0 ? (
					<Text
						fontSize="xs"
						color="gray.400"
						textAlign="center"
						py="4"
					>
						No items found.
					</Text>
				) : null}
			</VStack>
		</Box>
	);
};

export default Sidebar;
