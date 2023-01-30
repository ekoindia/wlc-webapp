import {
	Box,
	Center,
	Input,
	StackDivider,
	Text,
	VStack,
} from "@chakra-ui/react";
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

export function SearchBar({ onChangeHandler, value }) {
	return (
		<Box position="relative">
			<Input
				value={value}
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
				onChange={(e) => onChangeHandler(e.target.value)}
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
			{value !== "" && (
				<Box
					position="absolute"
					top="106%"
					width="100%"
					h="214px"
					zIndex="1"
					bg="white"
					borderRadius="10"
					border="1px solid #D2D2D2"
					p="20px 29px 24px 20px "
				>
					<VStack
						align="flex-start"
						divider={<StackDivider />}
						spacing="15px"
					>
						<Box>
							<Text as="p" fontSize="sm">
								9891745076
							</Text>
							<Text as="p" fontSize="10px" color="#11299E">
								Rajesh Enterprises
							</Text>
						</Box>
						<Box>
							<Text as="p" fontSize="sm">
								9891745076
							</Text>
							<Text as="p" fontSize="10px" color="#11299E">
								Rajesh Enterprises
							</Text>
						</Box>
						<Box>
							<Text as="p" fontSize="sm">
								9891745076
							</Text>
							<Text as="p" fontSize="10px" color="#11299E">
								Rajesh Enterprises
							</Text>
						</Box>
					</VStack>
				</Box>
			)}
		</Box>
	);
}

export default SearchBar;
