import {
	Divider,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Text,
	useDisclosure,
	useToken,
} from "@chakra-ui/react";
import { useMenuContext } from "contexts/MenuContext";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { useRef } from "react";
import { svgBgDotted } from "utils/svgPatterns";
import { Icon } from "..";

/**
 * Generates a new path for transaction navigation.
 *
 * @param {string} currentPath - The current path of the router.
 * @param {number} id - The id to be included in the new path.
 * @param {number} [group_interaction_id] - The optional group interaction id to be included in the new path.
 * @returns {string} The new path.
 */
const generateNewPath = (
	currentPath: string,
	id: number,
	group_interaction_id?: number
) => {
	const newTransactionPath = `transaction/${id}${
		group_interaction_id ? `/${group_interaction_id}` : ""
	}`;

	return currentPath.includes("transaction")
		? currentPath.replace(/transaction\/\d+(\/\d*)?/, newTransactionPath)
		: newTransactionPath;
};

const AccountDrawer = () => {
	const btnRef = useRef<HTMLButtonElement>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { menuList, otherList } = useMenuContext();

	const _list = [...menuList, ...otherList];
	console.log("_list", _list);

	return (
		<DrawerContainer {...{ isOpen, onOpen, onClose, btnRef }}>
			{_list?.map(({ id, icon, label, link }, index) => (
				<>
					<Interaction {...{ id, icon, label, link, onClose }} />
					{_list.length - 1 !== index && <Divider variant="dashed" />}
				</>
			))}
		</DrawerContainer>
	);
};

export default AccountDrawer;

const DrawerContainer = ({ isOpen, onOpen, onClose, btnRef, children }) => {
	return (
		<>
			<Flex
				direction="column"
				gap="1"
				w="100%"
				h="100%"
				align="center"
				justify="center"
				onClick={onOpen}
			>
				<Icon ref={btnRef} name="others" size="sm" color="light" />
				<Text fontSize="10px" fontWeight="medium" noOfLines={2}>
					More
				</Text>
			</Flex>
			<Drawer
				isOpen={isOpen}
				placement="bottom"
				onClose={onClose}
				finalFocusRef={btnRef}
				// isFullHeight={true}
			>
				<DrawerOverlay />
				<DrawerContent
					w="100%"
					// h="100%"
					borderTopRadius="10px"
					pb="5"
				>
					<DrawerHeader onClose={onClose} />
					<Divider />
					<Flex
						// className="customScrollbars"
						direction="column"
						overflowY="scroll"
						px="5"
						py="2"
						gap="2"
					>
						{children}
					</Flex>
				</DrawerContent>
			</Drawer>
		</>
	);
};

const DrawerHeader = ({ onClose }) => {
	const [contrast_color] = useToken("colors", ["navbar.dark"]);
	return (
		<Flex
			w="100%"
			px="5"
			minH="56px"
			align="center"
			justify="space-between"
			backgroundImage={svgBgDotted({
				fill: contrast_color,
				opacity: 0.04,
			})}
		>
			<Text fontSize="lg" fontWeight="semibold">
				More
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

/* ####################### Interaction ####################### */

type InteractionProps = {
	id: number;
	label: string;
	icon: string;
	link: string;
	onClose: () => void;
};

/**
 * `Interaction` is a component that represents a single interaction.
 * It simply passes its props to an `InteractionItem` component.
 *
 * @param {InteractionProps} props - Props for configuring the Interaction component.
 * @param {number} props.id - The ID of the interaction.
 * @param {string} props.label - The label for the interaction.
 * @param {string} props.icon - The icon for the interaction.
 * @param {string} props.link - The icon for the interaction.
 * @param {() => void} props.onClose - Callback invoked to close the modal.
 *
 * @returns {JSX.Element} An `InteractionItem` component with the same props as the `Interaction` component.
 */
const Interaction = ({
	id,
	label,
	icon,
	link,
	onClose,
}: InteractionProps): JSX.Element => {
	const router = useRouter();

	const { h } = useHslColor(label);

	const handleOnClick = () => {
		if (link) {
			router.push(link);
		} else {
			const newPath = generateNewPath(router.asPath, id);
			router.push(newPath);
		}
		onClose();
	};

	return (
		<Flex id={`${id}-${label}`} align="center" cursor="pointer">
			<Flex w="100%" gap="4" align="center" onClick={handleOnClick}>
				<Icon name={icon} size="md" color={`hsl(${h},80%,30%)`} />
				<Text fontSize="sm" fontWeight="medium">
					{label}
				</Text>
			</Flex>
			<Icon name="chevron-right" size="10px" color="light" />
		</Flex>
	);
};
