import {
	Drawer as ChakraDrawer,
	Divider,
	DrawerBody,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Text,
	useToken,
} from "@chakra-ui/react";
import { IcoButton } from "components";
import { NavHeight } from "components/NavBar";
import { useSwipe } from "hooks";
import { svgBgDotted } from "utils/svgPatterns";

interface DrawerProps {
	id: string;
	size?: "xs" | "sm" | "md" | "lg" | string;
	children: React.ReactNode;
	title?: string;
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	finalFocusRef?: React.RefObject<HTMLElement>;
	isSideBarMode?: boolean;
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
 * @param {boolean} props.isOpen - Boolean indicating whether the drawer is open.
 * @param {Function} props.onOpen - Function to be called when the drawer is opened.
 * @param {Function} props.onClose - Function to be called when the drawer is closed.
 * @param {boolean} [props.isSideBarMode] - Boolean indicating whether the drawer should be placed on the left side (for medium to large screens in compact-sidebar mode).
 * @param {React.RefObject<HTMLElement>} [props.finalFocusRef] - The element to receive focus when the drawer closes.
 * @param {...object} rest - Additional properties passed to the Chakra UI Drawer component.
 * @example
 * <Drawer
 *   id="myDrawer"
 *   size="md"
 *   title="Drawer Title"
 *   isOpen={isOpen}
 *   onOpen={handleOpen}
 *   onClose={handleClose}
 * 	 isSideBarMode={true}
 * >
 *   <p>Drawer Content</p>
 * </Drawer>
 */
const BottomAppBarDrawer = ({
	id,
	size = "xs",
	children,
	title,
	isOpen,
	onOpen,
	onClose,
	finalFocusRef,
	isSideBarMode = false,
	...rest
}: DrawerProps) => {
	const drawerContentStyles = isSideBarMode
		? {
				// Left DrawerContent Style
				mt: NavHeight,
				borderRadius: "0 6px 6px 0",
				motionProps: {
					variants: {
						enter: {
							x: "80px",
							transition: { duration: 0.2 },
						},
						exit: {
							x: "-100%",
							transition: { duration: 0.1 },
						},
					},
				},
			}
		: {
				// Bottom DrawerContent Style
				maxH: "70%",
				w: "100%",
				borderTopRadius: "10px",
				pb: "5",
			};

	const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(
		isSideBarMode
			? { onSwipedLeft: () => onClose() }
			: {
					onSwipedDown: () => onClose(),
				}
	);

	return (
		<ChakraDrawer
			variant={isSideBarMode ? "compactSidebar" : undefined}
			placement={isSideBarMode ? "left" : "bottom"}
			{...{ id, size, isOpen, onClose, finalFocusRef }}
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

interface DrawerHeaderProps {
	title: string;
	onClose: () => void;
}

/**
 * A DrawerHeader component that displays a header with a title and a close button.
 * MARK: Header
 * @param {DrawerHeaderProps} props - Properties passed to the component
 * @param {string} props.title - The title of the drawer header.
 * @param {Function} props.onClose - Function to be called when the close button is clicked.
 * @example
 * <DrawerHeader title="Drawer Header" onClose={handleClose} />
 */
const DrawerHeader = ({ title, onClose }: DrawerHeaderProps) => {
	const [contrast_color] = useToken("colors", ["navbar.dark"]);
	return (
		<Flex
			w="100%"
			minH="56px"
			align="center"
			justify="space-between"
			px="5"
			backgroundImage={svgBgDotted({
				fill: contrast_color,
				opacity: 0.04,
			})}
		>
			<Text fontSize="lg" fontWeight="semibold" userSelect="none">
				{title}
			</Text>
			<IcoButton
				size="sm"
				iconName="close"
				iconSize="xs"
				color="light"
				theme="ghost"
				_hover={{ color: "error" }}
				_active={{ color: "error" }}
				onClick={onClose}
			/>
		</Flex>
	);
};

export default BottomAppBarDrawer;
