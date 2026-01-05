import { Box, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import JsonNode from "./JsonNode";
import { JsonViewerProps } from "./types";
import { parseJsonInput } from "./utils";

/**
 * JsonViewer - A reusable component that renders JSON data in a clean, collapsible tree view.
 *
 * Features:
 * - Recursive rendering with unlimited nesting
 * - Collapsible nodes with smooth animations
 * - Syntax highlighting by value type
 * - Circular reference detection
 * - Keyboard navigation (Enter/Space to toggle)
 * - ARIA tree roles for accessibility
 * - Copy to clipboard on root line
 * - Tree lines connecting parent-child nodes
 * @param props - JsonViewerProps
 * @param props.data
 * @param props.collapseAfterLevel
 * @param props.animated
 * @param props.className
 * @param props.maxHeight
 * @example
 * // Basic usage with object
 * <JsonViewer data={{ name: "John", age: 30 }} />
 * @example
 * // With JSON string
 * <JsonViewer data='{"name": "John", "age": 30}' />
 * @example
 * // Custom collapse level and no animation
 * <JsonViewer data={complexObject} collapseAfterLevel={1} animated={false} />
 */
const JsonViewer = ({
	data,
	collapseAfterLevel = 2,
	animated = true,
	maxHeight = { base: "200px", md: "350px" },
	className,
}: JsonViewerProps) => {
	// Parse input data
	const parseResult = useMemo(() => parseJsonInput(data), [data]);

	// Initial ancestor array for circular reference detection
	const initialAncestors = useMemo<object[]>(() => [], []);

	// Render error state for invalid JSON
	if (!parseResult.success) {
		return (
			<Box
				className={className}
				p={4}
				bg="white"
				borderRadius="md"
				border="1px solid"
				borderColor="error"
			>
				<Text color="error" fontWeight="500" mb={2}>
					Invalid JSON
				</Text>
				<Text color="error" fontSize="sm" fontFamily="mono">
					{parseResult.error}
				</Text>
			</Box>
		);
	}

	return (
		<Box
			className={`${className || ""} customScrollbars`}
			py={2}
			px={3}
			bg="gray.50"
			borderRadius="md"
			overflow="auto"
			maxH={maxHeight}
		>
			{/* JSON Tree */}
			<Box role="tree" aria-label="JSON data tree">
				<JsonNode
					nodeKey={null}
					value={parseResult.data}
					level={0}
					path="root"
					collapseAfterLevel={collapseAfterLevel}
					animated={animated}
					ancestors={initialAncestors}
					isLast={true}
					onCopyRoot={() => {}}
				/>
			</Box>
		</Box>
	);
};

export default JsonViewer;
