import { Box, Flex, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { Icon } from "components";
import { ReactNode } from "react";

interface DashboardWidgetProps {
	children: ReactNode;
	title?: string;
	headerRight?: ReactNode;
	isDraggable?: boolean;
}

/**
 * A wrapper component for dashboard widgets with optional drag handle.
 * @param {DashboardWidgetProps} props - Component properties
 * @returns {JSX.Element} Dashboard widget wrapper
 */
const DashboardWidget = ({
	children,
	title,
	headerRight,
	isDraggable = true,
}: DashboardWidgetProps): JSX.Element => {
	return (
		<Flex
			direction="column"
			h="100%"
			bg="white"
			borderRadius="10"
			overflow="hidden"
		>
			{(title || isDraggable) && (
				<Flex
					align="center"
					justify="space-between"
					px="4"
					py="3"
					borderBottom="1px solid"
					borderColor="divider"
					bg="white"
					className={isDraggable ? "drag-handle" : undefined}
					cursor={isDraggable ? "grab" : "default"}
					_active={isDraggable ? { cursor: "grabbing" } : undefined}
					userSelect="none"
				>
					<Flex align="center" gap="2">
						{isDraggable && (
							<Tooltip label="Drag to reorder" placement="top">
								<IconButton
									aria-label="Drag widget"
									icon={
										<Icon
											name="drag_indicator"
											size="18px"
										/>
									}
									variant="ghost"
									size="sm"
									minW="auto"
									h="auto"
									p="1"
									color="gray.400"
									_hover={{ color: "gray.600" }}
									cursor="grab"
								/>
							</Tooltip>
						)}
						{title && (
							<Text
								fontWeight="semibold"
								fontSize="sm"
								color="dark"
							>
								{title}
							</Text>
						)}
					</Flex>
					{headerRight && <Box>{headerRight}</Box>}
				</Flex>
			)}
			<Box flex="1" overflow="auto" p="4">
				{children}
			</Box>
		</Flex>
	);
};

export default DashboardWidget;
