import { Box, Center, Input } from "@chakra-ui/react";
import { Icon } from "..";

/**
 * A <SearchFilterSort> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<SearchFilterSort></SearchFilterSort>`
 */
// const SearchFilterSort = ({ className = "", ...props }) => {
// 	const [count, setCount] = useState(0); // TODO: Edit state as required

// useEffect(() => {
// 	// TODO: Add your useEffect code here and update dependencies as required
// }, []);

export function SearchBar({ onChangeHandler }) {
	return (
		<Box position="relative">
			<Input
				color="light"
				placeholder="Search by name or mobile number"
				size="lg"
				borderRadius="10px"
				width="600px"
				h="48px"
				border=" 1px solid #D2D2D2"
				boxShadow="box-shadow: 0px 3px 6px #0000001A"
				bg="white"
				_focus={{
					bg: "focusbg",
					boxShadow: "0px 3px 6px #0000001A",
					border: " 1px solid #D2D2D2",
				}}
				_placeholder={{
					color: "light",
					fontSize: "sm",
				}}
				pl="55px"
			/>
			<Center
				position="absolute"
				top="0"
				left="0"
				width="60px"
				height="100%"
				zIndex="1"
				color="light"
				h="48px"
			>
				<Icon name="search" height="20px" width="20px" />
			</Center>
		</Box>
	);
}

export default SearchBar;
