import {
	Drawer as ChakraDrawer,
	Divider,
	DrawerBody,
	DrawerContent,
	DrawerOverlay,
} from "@chakra-ui/react";
import { useSwipe } from "hooks";
import { DrawerHeader } from ".";

interface DrawerProps {
	id: string;
	size?: "xs" | "sm" | "md" | "lg" | string;
	children: React.ReactNode;
	title?: string;
	placement?: "top" | "right" | "bottom" | "left";
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	finalFocusRef?: React.RefObject<HTMLElement>;
	isFullHeight?: boolean;
	[key: string]: any;
}

/**
 * A Drawer component that uses Chakra UI's Drawer components.
 * @component
 * @param {DrawerProps} props - Properties passed to the component
 * @param {string} props.id - The id of the drawer.
 * @param {string} [props.size] - The size of the drawer. Can be 'xs', 'sm', 'md', 'lg', or a custom size string.
 * @param {React.ReactNode} props.children - The content to be displayed inside the drawer.
 * @param {string} [props.title] - The title of the drawer header.
 * @param {string} [props.placement] - The placement of the drawer. Can be 'top', 'right', 'bottom', or 'left'.
 * @param {boolean} props.isOpen - Boolean indicating whether the drawer is open.
 * @param {Function} props.onOpen - Function to be called when the drawer is opened.
 * @param {Function} props.onClose - Function to be called when the drawer is closed.
 * @param {React.RefObject<HTMLElement>} [props.finalFocusRef] - The element to receive focus when the drawer closes.
 * @param {boolean} [props.isFullHeight] - Boolean indicating whether the drawer should take full height.
 * @param {...object} rest - Additional properties passed to the Chakra UI Drawer component.
 * @example
 * <Drawer
 *   id="myDrawer"
 *   size="md"
 *   title="Drawer Title"
 *   isOpen={isOpen}
 *   onOpen={handleOpen}
 *   onClose={handleClose}
 *   isFullHeight={false}
 * >
 *   <p>Drawer Content</p>
 * </Drawer>
 */
const Drawer = ({
	id,
	size = "xs",
	children,
	title,
	placement = "bottom",
	isOpen,
	onOpen,
	onClose,
	finalFocusRef,
	isFullHeight = true,
	...rest
}: DrawerProps) => {
	const drawerContentStyles = isFullHeight
		? {}
		: { maxH: "70%", w: "100%", borderTopRadius: "10px", pb: "5" };

	const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
		onSwipedDown: () => onClose(),
	});

	return (
		<ChakraDrawer
			{...{ id, size, isOpen, onClose, placement, finalFocusRef }}
			{...rest}
		>
			<DrawerOverlay />
			<DrawerContent
				{...{ onTouchStart, onTouchMove, onTouchEnd }}
				{...drawerContentStyles}
			>
				<DrawerHeader {...{ title, onClose }} />
				<Divider />
				<DrawerBody p="0">{children}</DrawerBody>
			</DrawerContent>
		</ChakraDrawer>
	);
};

export default Drawer;
