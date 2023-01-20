import { Box, Input } from "@chakra-ui/react";

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
		<Box>
			<Input
				placeholder="Search by name or mobile number"
				size="lg"
				width="600px"
				_focus={{
					bg: "focusbg",
					boxShadow: "0px 3px 6px #0000001A",
					borderColor: "hint",
					transition: "box-shadow 0.3s ease-out",
				}}
			/>
		</Box>
	);
}

export default SearchBar;
