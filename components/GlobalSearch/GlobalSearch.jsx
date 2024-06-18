import { Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { IcoButton, Icon, Kbd } from "components";
import { useKBarReady } from "components/CommandBar";
import { useGlobalSearch } from "contexts";
import { usePlatform } from "hooks";
import { useKBar } from "kbar";

/**
 * The Global Search Bar.
 * @param	{object}	props	Props for this component.
 * @example	`<GlobalSearch />`
 */
const GlobalSearch = ({ ...rest }) => {
	const { query } = useKBar();
	const { title } = useGlobalSearch();

	const { isMac } = usePlatform();
	const isSmallScreen = useBreakpointValue({ base: true, md: false });

	// Check if CommandBar is loaded...
	const { ready } = useKBarReady();

	if (!ready) return null;

	return isSmallScreen ? (
		<IcoButton
			iconName="search"
			size="sm"
			color="light"
			onClick={() => ready && query.toggle()}
		/>
	) : (
		<Flex
			align="center"
			ml={1}
			px="15px"
			display={{ base: "none", md: "flex" }}
			cursor="text"
			w={{
				base: "auto",
				md: "280px",
				lg: "400px",
				xl: "500px",
			}}
			h="36px"
			bg="navbar.bgAlt" // ORIG_THEME: darkShade
			borderWidth="0"
			borderRadius="6px"
			radius={6}
			onClick={() => query.toggle()}
			{...rest}
		>
			<Icon
				display={{ base: "none", md: "flex" }}
				name="search"
				size="sm"
				color="navbar.textLight"
			/>
			<Text
				flexGrow={1}
				fontSize={{ base: "xs", xl: "sm" }}
				opacity={0.6}
				px="12px"
				noOfLines={1}
				color="navbar.text"
			>
				{title || "Search anything..."}
			</Text>
			<Flex
				align="center"
				color="dark"
				display={{ base: "none", md: "flex" }}
			>
				<Key>{isMac ? "⌘" : "Ctrl"}</Key>
				<Key>K</Key>
			</Flex>
		</Flex>
	);
};

/**
 *
 * @param root0
 * @param root0.children
 */
function Key({ children, ...rest }) {
	return (
		<Kbd
			display="inline-flex"
			alignItems="center"
			justifyContent="center"
			pt="1px"
			px="4px"
			ml={1}
			minH="24px"
			minW="26px"
			color="light"
			fontFamily="inherit"
			{...rest}
		>
			{children}
		</Kbd>
	);
}

export default GlobalSearch;
