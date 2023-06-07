import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { IcoButton, Icon, Input, Kbd } from "components";
import { useGlobalSearch } from "contexts";
import { usePlatform } from "hooks";
import { useKBar } from "kbar";

/**
 * The Global Search Bar.
 * @param	{Object}	props	Props for this component.
 * @example	`<GlobalSearch />`
 */
const GlobalSearch = ({ ...rest }) => {
	const { query } = useKBar();
	const { title } = useGlobalSearch();

	const { isMac } = usePlatform();
	const isSmallScreen = useBreakpointValue({ base: true, md: false });

	return isSmallScreen ? (
		<IcoButton
			iconName="search"
			size="sm"
			color="light"
			onClick={() => query.toggle()}
		/>
	) : (
		<Input
			placeholder={title || "Search anything..."}
			inputLeftElement={
				<Icon
					display={{ base: "none", md: "flex" }}
					name="search"
					size="sm"
					color="light"
				/>
			}
			inputLeftElementStyle={{
				h: "36px",
			}}
			inputRightElement={
				<Flex
					align="center"
					color="dark"
					display={{ base: "none", md: "flex" }}
				>
					<Kbd mr={1} fontFamily="sans">
						{isMac ? "⌘" : "Ctrl"}
					</Kbd>
					<Kbd>K</Kbd>
				</Flex>
			}
			inputRightElementStyle={{
				h: "36px",
				right: 3,
			}}
			ml={1}
			display={{ base: "none", md: "flex" }}
			w={{
				base: "auto",
				md: "280px",
				lg: "400px",
				xl: "500px",
			}}
			h="36px"
			pb="3px"
			pr="70px"
			bg="darkShade"
			borderWidth="0"
			type="number"
			radius={6}
			maxLength={15}
			// value={searchValue}
			// onChange={(e) => setSearchValue(e.target.value)}
			onClick={() => query.toggle()}
			onKeyDown={() => query.toggle()}
			_placeholder={{
				fontSize: { base: "xs", xl: "sm" },
			}}
			_focus={{
				bg: "bg",
				boxShadow: "none",
				transition: "background 0.3s ease-out",
			}}
			{...rest}
		/>
	);
};

export default GlobalSearch;
