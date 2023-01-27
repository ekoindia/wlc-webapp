import React, { useEffect, useState } from "react";
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
		<Box position="relative">
			<Input
				placeholder="Search by name or mobile"
				size="lg"
				width="600px"
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
