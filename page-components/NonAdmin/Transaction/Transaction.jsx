import React, { useEffect, useState } from "react";
import { Flex, Box, Text, Center } from "@chakra-ui/react";
import { SearchBar } from "components/SearchBar";
import { Buttons, Headings, Icon, IconButtons } from "components";
import { TransactionTable } from "./TransactionTable";

/**
 * A <Transaction> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Transaction></Transaction>`
 */

const toggleData = [
	{ id: "1", name: "All" },
	{ id: "2", name: "Send Cash" },
	{ id: "3", name: "AePS Transaction" },
	{ id: "4", name: "Indo-Nepal Transaction" },
	{ id: "5", name: "Card Payment" },
	{ id: "6", name: "UPI Payment" },
	{ id: "7", name: "Bill Payment" },
	{ id: "8", name: "Deposit" },
];

function Toggle({ name, activeToggleIndex, index }) {
	return (
		<Box
			h="23px"
			px="15px"
			border="1px solid #D2D2D2"
			borderRadius="30px"
			bg={activeToggleIndex === index ? "accent.DEFAULT" : "white"}
			color={activeToggleIndex === index ? "white" : "light"}
			_hover={{ bg: "accent.DEFAULT", color: "white" }}
		>
			<Center py="3px">
				<Text fontSize={"10px"}>{name}</Text>
			</Center>
		</Box>
	);
}

const Transaction = () => {
	const [count, setCount] = useState(0);
	const [activeToggleIndex, setActiveToggleIndex] = useState(0);
	const [searchValue, setSearchValue] = useState("");
	// TODO: Edit state as required

	function onChangeHandler(e) {
		setSearchValue(e);
	} // TODO: Edit state as required
	const handleToggleClick = (index) => {
		setActiveToggleIndex(index);
	};

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Flex
			w="full"
			h="auto"
			p={{ base: "0px", md: "20px", "2xl": "14px 30px 30px 30px" }}
			direction={"column"}
			border={{ base: "", md: "card" }}
			borderRadius={{ base: "0", md: "10" }}
			boxShadow={{ base: "none", md: "0px 5px 15px #0000000D;" }}
			bg={{ base: "none", md: "white" }}
		>
			<Box>
				<Text fontSize="24px" fontWeight={"semibold"}>
					Transaction History
				</Text>
			</Box>
			{console.log("toggleData", toggleData)}
			<Flex
				justifyContent={"space-between"}
				direction={{ base: "column", lg: "row" }}
			>
				<Flex gap="8px" alignItems={"center"} overflowY="auto">
					{toggleData.map((toggle, index) => (
						<Box
							key={index}
							onClick={() => handleToggleClick(index)}
						>
							<Toggle
								name={toggle.name}
								activeToggleIndex={activeToggleIndex}
								index={index}
							/>
						</Box>
					))}
				</Flex>
				<Flex gap="15px">
					<Flex>
						<SearchBar
							inputContProps={{
								width: {
									base: "250px",
									md: "400px",
									lg: "400px",
									xl: "450px",
								},
								h: "36px",
							}}
							onChangeHandler={onChangeHandler}
							value={searchValue}
						/>
					</Flex>
					<Flex>
						<Buttons
							w="100%"
							h="36px"
							_hover={{ bg: "accent.DEFAULT" }}
						>
							<Icon name="filter" width="18px" />
							&nbsp; Filter
						</Buttons>
					</Flex>
				</Flex>
			</Flex>

			<Flex></Flex>
			<TransactionTable />
		</Flex>
	);
};

export default Transaction;
