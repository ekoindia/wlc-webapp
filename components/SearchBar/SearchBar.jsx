import { Input, Box } from "@chakra-ui/react";
import { InputGroup, InputLeftElement } from "@chakra-ui/react";
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
		<Box>
			<InputGroup>
				<InputLeftElement
					pointerEvents="none"
					alignItems="center"
					children={[
						<Icon
							name="search"
							color="#555555"
							width="20"
							height="20"
							pl="20px"
						/>,
					]}
				/>
				<Input
					placeholder="Search by name or mobile number"
					size="lg"
					borderRadius="10px"
					width="600px"
					border=" 1px solid #D2D2D2"
					boxShadow="box-shadow: 0px 3px 6px #0000001A"
					bg="white"
					_focus={{
						bg: "focusbg",
						boxShadow: "0px 3px 6px #0000001A",
					}}
				/>
			</InputGroup>
		</Box>
	);
}

export default SearchBar;
