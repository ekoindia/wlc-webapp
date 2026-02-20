import { Box, Flex } from "@chakra-ui/react";
import { DragHandleProps } from "./types";

/**
 * DragHandle component - renders a draggable header bar with grip icon.
 * Use this in widget components to create a draggable area.
 *
 * The component uses the `.drag-handle` className which is recognized by
 * react-grid-layout's drag configuration.
 * @param {DragHandleProps} props - Component properties
 * @param {React.ReactNode} props.children - Content to render inside the drag handle
 * @param {boolean} [props.isDraggable] - Whether dragging is enabled (affects cursor style)
 * @returns {JSX.Element} The rendered drag handle component
 * @example
 * ```tsx
 * <DragHandle isDraggable={isDraggable}>
 *   <Heading size="sm">Widget Title</Heading>
 * </DragHandle>
 * ```
 */
export const DragHandle = ({
	children,
	isDraggable = true,
}: DragHandleProps): JSX.Element => {
	return (
		<Flex
			className="drag-handle"
			align="center"
			justify="space-between"
			w="100%"
			cursor={isDraggable ? "grab" : "default"}
			_active={isDraggable ? { cursor: "grabbing" } : undefined}
			userSelect="none"
		>
			{children}
			{/* Drag indicator icon */}
			<Box
				as="span"
				fontSize="16px"
				color="light"
				opacity={0.5}
				transition="color 0.2s, opacity 0.2s"
				ml="2"
				_groupHover={{
					color: "dark",
					opacity: 1,
				}}
				sx={{
					".drag-handle:hover &": {
						color: "dark",
						opacity: 1,
					},
				}}
			>
				⠿
			</Box>
		</Flex>
	);
};

export default DragHandle;
