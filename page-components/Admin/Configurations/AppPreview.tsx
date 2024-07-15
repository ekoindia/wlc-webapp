import { Box, Flex, Text } from "@chakra-ui/react";

const w = "300px";
const h = "200px";

interface AppPreviewProps {
	primary?: string;
	primaryDark?: string;
	accent?: string;
	navStyle?: "light" | "dark";
}

/**
 * Component to show a preview of a website with theme colors and navigation.
 * @component
 * @param {AppPreviewProps} props - Props for configuring the preview.
 * @param {string} [props.primary] - Primary color theme for the preview.
 * @param {string} [props.primaryDark] - Dark variant of the primary color theme.
 * @param {string} [props.accent] - Accent color theme for highlighting elements.
 * @param {"light" | "dark"} [props.navStyle] - Navigation style, either light or dark.
 */
const AppPreview = ({
	primary,
	primaryDark,
	accent,
	navStyle,
}: AppPreviewProps): JSX.Element => {
	return (
		<Flex
			direction="column"
			w={w}
			h={h}
			border="1px solid #999"
			borderRadius={6}
			overflow="hidden"
			fontSize="5px"
			shadow="base"
			pointerEvents="none"
			userSelect="none"
		>
			{primary && accent ? (
				<>
					{/* Top Bar */}
					<Flex
						bg={navStyle === "light" ? primary : "white"}
						h="8%"
						minH="8%"
						w="100%"
						align="center"
						px="1em"
						fontSize="6px"
						fontWeight="700"
						color={navStyle === "light" ? "#FFFFFF90" : "#666"}
						transition="background 0.5s ease-in"
					>
						Logo
					</Flex>

					{/* Main Content */}
					<Flex direction="row" w="100%" h="100%" flex="1">
						{/* Left Menu */}
						<Flex
							bg={navStyle === "light" ? "white" : primary}
							w="25%"
							h="100%"
							direction="column"
							color={navStyle === "light" ? "#222" : "white"}
							transition="background 0.5s ease-in"
						>
							{/* Left Menu Items */}
							{["Home", "Transaction", "Others"].map(
								(item, i) => (
									<MenuItem
										key={i}
										item={item}
										primaryDark={primaryDark}
										accent={accent}
										selected={i === 1}
									/>
								)
							)}
						</Flex>

						{/* Right Pane */}
						<Flex
							direction="column"
							flex="1"
							align="center"
							bg="bg"
							w="30px"
							h="100%"
							p="3%"
						>
							{/* Transaction Card */}
							<Flex
								bg="white"
								w="100%"
								h="80%"
								direction="column"
								borderRadius={3}
								p="3%"
								shadow="base"
							>
								<Text fontSize="1.2em" fontWeight="500">
									Transaction
								</Text>
								<Box flex="1"></Box>
								{/* Proceed Button */}
								<Flex
									bg={accent}
									w="20%"
									h="10%"
									align="center"
									justify="center"
									borderRadius={2}
									px="4px"
									color="white"
									fontSize="0.9em"
									transition="background 0.5s ease-in"
								>
									Proceed
								</Flex>
							</Flex>
						</Flex>
					</Flex>
				</>
			) : (
				<Box w={w} h={h} />
			)}
		</Flex>
	);
};

export default AppPreview;

interface MenuItemProps {
	item: string;
	primaryDark?: string;
	accent?: string;
	selected?: boolean;
}

/**
 * Menu Item component for the preview.
 * @component
 * @param {MenuItemProps} props - Props for configuring the menu item
 * @param {string} props.item - Text content of the menu item.
 * @param {string} [props.primaryDark] - Dark variant color to indicate selection.
 * @param {string} [props.accent] - Accent color for highlighting elements.
 * @param {string} [props.selected] - Indicates whether the menu item is selected.
 */
const MenuItem = ({
	item,
	primaryDark,
	accent,
	selected = false,
}: MenuItemProps): JSX.Element => {
	return (
		<Flex
			direction="row"
			bg={selected ? primaryDark : ""}
			color={selected ? "white" : ""}
			borderBottom="1px solid #999"
			h="15px"
			w="100%"
			align="center"
			transition="background 0.5s ease-in"
		>
			<Box h="100%" w="3px" mr="3px" bg={selected ? accent : ""}></Box>
			{item}
		</Flex>
	);
};
