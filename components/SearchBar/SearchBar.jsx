import {
	Box,
	Center,
	Input,
	StackDivider,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Icon } from "..";

export function SearchBar({ onChangeHandler, value }) {
	return (
		<Box
			position="relative"
			w={"fit-content"}
			h={{
				base: "8.5vw",
				sm: "5vw",
				md: "4vw",
				lg: "3vw",
				xl: "2.5vw",
				"2xl": "2vw",
			}}
			mx={{ base: "auto", sm: "0px" }}
			my={{ base: "2vw", md: "1vw" }}
		>
			<Input
				value={value}
				placeholder="Search by name or mobile number"
				size="lg"
				borderRadius="10px"
				width={{
					base: "95vw",
					sm: "45vw",
					md: "40vw",
					lg: "30vw",
					xl: "30vw",
					"2xl": "30vw",
				}}
				h="100%"
				fontSize={{ base: "xs", "2xl": "sm" }}
				border=" 1px solid #D2D2D2"
				boxShadow="box-shadow: 0px 3px 6px #0000001A"
				bg="white"
				_focus={{
					bg: "focusbg",
					boxShadow: "0px 3px 6px #0000001A",
					border: " 1px solid #D2D2D2",
				}}
				pl={{ base: "30px", lg: "35px", "2xl": "55px" }}
				onChange={(e) => onChangeHandler(e.target.value)}
			/>
			<Center
				position="absolute"
				top="0"
				left="0"
				width={{ base: "35px", lg: "40px", "2xl": "60px" }}
				height="100%"
				zIndex="1"
				// h="48px"
				color={"light"}
			>
				<Icon name="search" height="40%" />
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
