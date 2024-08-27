import { Flex, Text, useToken } from "@chakra-ui/react";
import { svgBgDotted } from "utils/svgPatterns";
import { Icon } from "..";

interface DrawerHeaderProps {
	title: string;
	onClose: () => void;
}

/**
 * A DrawerHeader component that displays a header with a title and a close button.
 * @component
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
			<Flex direction="row-reverse" onClick={onClose} w="20%">
				<Icon
					size="xs"
					name="close"
					color="light"
					_active={{ color: "error" }}
				/>
			</Flex>
		</Flex>
	);
};

export default DrawerHeader;
