import { Icon, Input } from "components";

/**
 * The Global Search Bar.
 * @param	{Object}	props	Props for this component.
 * @param	{Function}	props.onSearchKeyDown	Handler for keydown event on search input.
 * @example	`<GlobalSearch />`
 */
const GlobalSearch = ({ onSearchKeyDown, ...rest }) => {
	return (
		<Input
			placeholder="Search by Transaction ID, Mobile, Account, etc"
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
			ml={1}
			display={{ base: "none", md: "flex" }}
			w={{
				base: "auto",
				md: "280px",
				lg: "400px",
				xl: "500px",
			}}
			h="36px"
			bg="darkShade"
			borderWidth="0"
			type="number"
			radius={6}
			maxLength={15}
			// value={searchValue}
			// onChange={(e) => setSearchValue(e.target.value)}
			onKeyDown={onSearchKeyDown}
			_placeholder={{ fontSize: "sm" }}
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
