import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import { CopyButton, Icon } from "components";
import { memo, useCallback, useMemo, useState } from "react";
import { JsonNodeProps, JsonValue } from "./types";
import {
	addToAncestors,
	BRACKET_COLOR,
	formatPrimitiveValue,
	getCollectionInfo,
	getTypeColor,
	getValueType,
	isCircularReference,
	KEY_COLOR,
} from "./utils";

// Tree line color
const TREE_LINE_COLOR = "gray.300";

// Indentation per level in pixels
const INDENT_SIZE = 20;

/**
 * JsonNode - A memoized recursive component that renders a single JSON node.
 * Supports expand/collapse, circular reference detection, and keyboard navigation.
 */
const JsonNode = memo(function JsonNode({
	nodeKey,
	value,
	level,
	path,
	collapseAfterLevel,
	animated,
	ancestors,
	isLast = true,
	onCopyRoot,
}: JsonNodeProps & { onCopyRoot?: (_jsonString: string) => void }) {
	// Determine initial expanded state based on level
	const shouldStartExpanded = level < collapseAfterLevel;
	const [isExpanded, setIsExpanded] = useState(shouldStartExpanded);

	const valueType = getValueType(value);
	const isExpandable = valueType === "object" || valueType === "array";
	const isCircular = isExpandable && isCircularReference(value, ancestors);
	const isRoot = level === 0;

	// Calculate updated ancestors for children (add current value if it's an object/array)
	const childAncestors = useMemo(() => {
		if (isExpandable && value && !isCircular) {
			return addToAncestors(value as object, ancestors);
		}
		return ancestors;
	}, [isExpandable, value, ancestors, isCircular]);

	// Get children entries for objects/arrays
	const children = useMemo(() => {
		if (!isExpandable || isCircular || value === null) return [];

		if (Array.isArray(value)) {
			return value.map((item, index) => ({
				key: index,
				value: item as JsonValue,
				path: `${path}[${index}]`,
			}));
		}

		return Object.entries(value as Record<string, JsonValue>).map(
			([k, v]) => ({
				key: k,
				value: v,
				path: `${path}.${k}`,
			})
		);
	}, [isExpandable, isCircular, value, path]);

	// Toggle expand/collapse
	const handleToggle = useCallback(() => {
		if (isExpandable && !isCircular) {
			setIsExpanded((prev) => !prev);
		}
	}, [isExpandable, isCircular]);

	// Keyboard navigation
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				handleToggle();
			}
		},
		[handleToggle]
	);

	// Calculate margin for tree line positioning
	const indent = level * INDENT_SIZE;

	// Trailing comma
	const comma = isLast ? "" : ",";

	// Render key portion
	const renderKey = () => {
		if (nodeKey === null) return null;

		const keyDisplay =
			typeof nodeKey === "number" ? null : (
				<>
					<Text as="span" color={KEY_COLOR} fontWeight="500">
						{nodeKey}
					</Text>
					<Text as="span" color={BRACKET_COLOR}>
						:{" "}
					</Text>
				</>
			);

		return keyDisplay;
	};

	// Render primitive value
	const renderPrimitiveValue = () => {
		const formatted = formatPrimitiveValue(value, valueType);
		return (
			<Text as="span" color={getTypeColor(valueType)}>
				{formatted}
				<Text as="span" color={BRACKET_COLOR}>
					{comma}
				</Text>
			</Text>
		);
	};

	// Common row styles with tree line
	const getRowStyles = (hasTreeLine: boolean) => ({
		position: "relative" as const,
		pl: `${indent + (level > 0 ? INDENT_SIZE : 0)}px`,
		py: "1px",
		fontFamily: "mono",
		fontSize: "13px",
		lineHeight: "1.6",
		// Tree line
		...(hasTreeLine && level > 0
			? {
					_before: {
						content: '""',
						position: "absolute",
						left: `${indent + 8}px`,
						top: 0,
						bottom: isLast ? "50%" : 0,
						width: "1px",
						bg: TREE_LINE_COLOR,
					},
					_after: {
						content: '""',
						position: "absolute",
						left: `${indent + 8}px`,
						top: "50%",
						width: `${INDENT_SIZE - 12}px`,
						height: "1px",
						bg: TREE_LINE_COLOR,
					},
				}
			: {}),
	});

	// Render circular reference
	if (isCircular) {
		return (
			<Flex
				{...getRowStyles(true)}
				role="treeitem"
				aria-level={level + 1}
			>
				{renderKey()}
				<Text as="span" color="red.500" fontStyle="italic">
					[Circular]
				</Text>
				<Text as="span" color={BRACKET_COLOR}>
					{comma}
				</Text>
			</Flex>
		);
	}

	// Render primitive values
	if (!isExpandable) {
		return (
			<Flex
				{...getRowStyles(true)}
				role="treeitem"
				aria-level={level + 1}
			>
				{renderKey()}
				{renderPrimitiveValue()}
			</Flex>
		);
	}

	// Render expandable nodes (objects/arrays)
	const isArray = valueType === "array";
	const openBracket = isArray ? "[" : "{";
	const closeBracket = isArray ? "]" : "}";
	const isEmpty = children.length === 0;
	const collectionInfo = getCollectionInfo(value as object);

	return (
		<Box role="treeitem" aria-level={level + 1} aria-expanded={isExpanded}>
			{/* Header row with toggle */}
			<Flex
				{...getRowStyles(!isRoot)}
				align="center"
				cursor={isEmpty ? "default" : "pointer"}
				onClick={isEmpty ? undefined : handleToggle}
				onKeyDown={isEmpty ? undefined : handleKeyDown}
				tabIndex={isEmpty ? -1 : 0}
				borderRadius="sm"
				_hover={isEmpty ? {} : { bg: "blackAlpha.50" }}
				_focus={{ outline: "none" }}
			>
				{/* Chevron icon */}
				{!isEmpty && (
					<Box
						as="span"
						mr="4px"
						ml="-2px"
						transition={animated ? "transform 0.15s ease" : "none"}
						transform={
							isExpanded ? "rotate(0deg)" : "rotate(-90deg)"
						}
					>
						<Icon name="expand-more" size="xs" color="gray.500" />
					</Box>
				)}

				{renderKey()}

				{/* Opening bracket or collapsed preview */}
				<Text as="span" color={BRACKET_COLOR}>
					{openBracket}
				</Text>

				{/* Collapsed info */}
				{!isExpanded && !isEmpty && (
					<>
						<Text as="span" color="gray.400" fontSize="xs" mx="1">
							{collectionInfo.slice(1, -1)}
						</Text>
						<Text as="span" color={BRACKET_COLOR}>
							{closeBracket}
							{comma}
						</Text>
					</>
				)}

				{/* Empty collection */}
				{isEmpty && (
					<Text as="span" color={BRACKET_COLOR}>
						{closeBracket}
						{comma}
					</Text>
				)}

				{/* Copy button for root */}
				{isRoot && onCopyRoot && (
					<Box ml="auto" onClick={(e) => e.stopPropagation()}>
						<CopyButton
							text={JSON.stringify(value, null, 2)}
							size="xs"
						/>
					</Box>
				)}
			</Flex>

			{/* Children (lazy rendered) with tree line container */}
			{!isEmpty && (
				<Collapse in={isExpanded} animateOpacity={animated}>
					<Box
						role="group"
						position="relative"
						// Vertical line for children
						_before={
							level >= 0
								? {
										content: '""',
										position: "absolute",
										left: `${indent + INDENT_SIZE + 8}px`,
										top: 0,
										bottom: 0,
										width: "1px",
										bg: TREE_LINE_COLOR,
									}
								: {}
						}
					>
						{isExpanded &&
							children.map((child, index) => (
								<JsonNode
									key={child.path}
									nodeKey={child.key}
									value={child.value}
									level={level + 1}
									path={child.path}
									collapseAfterLevel={collapseAfterLevel}
									animated={animated}
									ancestors={childAncestors}
									isLast={index === children.length - 1}
								/>
							))}
					</Box>
				</Collapse>
			)}

			{/* Closing bracket (only when expanded and non-empty) */}
			{isExpanded && !isEmpty && (
				<Flex
					pl={`${indent + (level > 0 ? INDENT_SIZE : 0)}px`}
					py="1px"
					fontFamily="mono"
					fontSize="13px"
					lineHeight="1.6"
				>
					<Text as="span" color={BRACKET_COLOR}>
						{closeBracket}
						{comma}
					</Text>
				</Flex>
			)}
		</Box>
	);
});

export default JsonNode;
