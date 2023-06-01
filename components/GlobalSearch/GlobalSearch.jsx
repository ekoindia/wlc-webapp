import { Flex } from "@chakra-ui/react";
import { Icon, Input, Kbd } from "components";
import { useGlobalSearch } from "contexts";
import { usePlatform } from "hooks";
import { useKBar } from "kbar";

/**
 * The Global Search Bar.
 * @param	{Object}	props	Props for this component.
 * @param	{Function}	props.onSearchKeyDown	Handler for keydown event on search input.
 * @example	`<GlobalSearch />`
 */
const GlobalSearch = ({ onSearchKeyDown, ...rest }) => {
	const { query } = useKBar();
	const { title } = useGlobalSearch();

	const { isMac } = usePlatform();

	return (
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
			onKeyDown={onSearchKeyDown}
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
