import React, { useEffect, useState } from "react";
import {
	Flex,
	Box,
	Text,
	Center,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@chakra-ui/react";
import { SearchBar } from "components/SearchBar";
import { Buttons, Headings, Icon, Calenders, Input } from "components";
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
const buttonWidths = [
	"45px",
	"79px",
	"111px",
	"139px",
	"95px",
	"89px",
	"86px",
	"64px",
];

function Toggle({ name, activeToggleIndex, index }) {
	return (
		<Box
			h="23px"
			w={buttonWidths[index]}
			px="10px"
			border="1px solid #D2D2D2"
			borderRadius="30px"
			bg={activeToggleIndex === index ? "accent.DEFAULT" : "white"}
			color={activeToggleIndex === index ? "white" : "light"}
			_hover={{ bg: "accent.DEFAULT", color: "white" }}
			display={"flex"}
			justifyContent={"center"}
			alignItems="center"
		>
			<Box display={"flex"} textAlign="justify">
				<Text fontSize={"10px"}>{name}</Text>
			</Box>
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

	const [isOpen, setIsOpen] = useState(false);

	const onClose = () => setIsOpen(false);
	const onOpen = () => setIsOpen(true);

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
			px="16px"
		>
			<Box>
				<Text fontSize="24px" fontWeight={"semibold"}>
					Transaction History
				</Text>
			</Box>

			<Flex
				justifyContent={"space-between"}
				direction={{ base: "column", lg: "row" }}
				alignItems={{ base: "none", xl: "center" }}
			>
				{/* <===========================Toggles Button ===============================> */}
				<Flex gap="8px" overflowX="auto">
					{toggleData.map((toggle, index, toggleWidths) => (
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
				<Flex
					gap="10px"
					mt={{ base: "40px", lg: "0px" }}
					justifyContent="space-between"
				>
					{/* <==========Search =========> */}
					<Flex>
						<SearchBar
							inputContProps={{
								width: {
									base: "270px",
									md: "400px",
									lg: "200px",
									xl: "300px",
									"2xl": "450px",
								},
								h: "36px",
							}}
							onChangeHandler={onChangeHandler}
							value={searchValue}
						/>
					</Flex>

					{/* <==========Filter Button =========> */}
					<Flex>
						<Buttons
							w="100%"
							h="36px"
							_hover={{ bg: "accent.DEFAULT" }}
							onClick={onOpen}
						>
							<Icon name="filter" width="18px" />
							&nbsp;{" "}
							<Text display={{ base: "none", md: "flex" }}>
								Filter
							</Text>
						</Buttons>
					</Flex>

					{/* <===================Filter Modal Code ==========================> */}
					<Modal
						isOpen={isOpen}
						onClose={onClose}
						isCentered={{ base: "none", lg: "true" }}
						motionPreset="slideInBottom"
						// isCentered
						scrollBehavior="inside"
					>
						{/* <ModalOverlay /> */}
						<ModalContent
							height={{ base: "100%", lg: "initial" }}
							mt={{ base: "50%", lg: "0" }}
							borderRadius="10px 10px 0 0"
						>
							<ModalHeader fontSize={"18px"} fontWeight="bold">
								Filter Search
							</ModalHeader>
							<ModalBody>
								<Flex direction={"column"} gap="23px">
									<Flex>
										<Calenders
											w="100%"
											label="From"
											inputContStyle={{
												w: {
													base: "100%",
													md: "250px",
													lg: "300px",
													xl: "400px",
												},
												h: "42px",
												pos: "relative",
												borderRadius: "6px",
											}}
											labelStyle={{
												fontSize: { base: "sm" },
												color: "inputlabel",
												pl: "0",
												fontWeight: "semibold",
											}}
										/>
									</Flex>
									<Flex>
										<Calenders
											label="To"
											w="100%"
											inputContStyle={{
												w: {
													base: "100%",
													md: "250px",
													lg: "300px",
													xl: "400px",
												},
												h: "42px",
												pos: "relative",
												borderRadius: "6px",
											}}
											labelStyle={{
												fontSize: { base: "sm" },
												color: "inputlabel",
												pl: "0",
												fontWeight: "semibold",
											}}
										/>
									</Flex>
									<Flex>
										<Input
											w="100%"
											label="Amount"
											type="number"
											placeholder={"₹ Enter Amount"}
											// required="true"
											// defaultvalue={item.Name}
											// invalid={true}
											// errorMsg={"Please enter"}
											// mb={{ base: 10, "2xl": "4.35rem" }}
											// onChange={onChangeHandler}
											labelStyle={{
												fontSize: { base: "sm" },
												color: "inputlabel",
												pl: "0",
												fontWeight: "semibold",
											}}
											inputContStyle={{
												w: {
													base: "100%",
													md: "250px",
													lg: "300px",
													xl: "400px",
												},
												h: "42px",
												pos: "relative",
												borderRadius: "6px",
											}}
										/>
									</Flex>
									<Flex>
										<Input
											w="100%"
											label="Tracking Number"
											placeholder="Enter"
											// required="true"
											// defaultvalue={item.Name}
											// invalid={true}
											// errorMsg={"Please enter"}
											// mb={{ base: 10, "2xl": "4.35rem" }}
											// onChange={onChangeHandler}
											labelStyle={{
												fontSize: { base: "sm" },
												color: "inputlabel",
												pl: "0",
												fontWeight: "semibold",
											}}
											inputContStyle={{
												w: {
													base: "100%",
													md: "250px",
													lg: "300px",
													xl: "400px",
												},
												h: "42px",
												pos: "relative",
												borderRadius: "6px",
											}}
										/>
									</Flex>
								</Flex>
							</ModalBody>
							<ModalFooter>
								<Buttons
									onClick={onClose}
									w={{
										base: "100%",
										md: "250px",
										lg: "300px",
										xl: "400px",
									}}
									h={{ base: "64px", xl: "56px" }}
								>
									Apply Now
								</Buttons>
							</ModalFooter>
						</ModalContent>
					</Modal>
				</Flex>
			</Flex>
			{/* <=============================Transaction Table & Card ===============================> */}
			<TransactionTable />
		</Flex>
	);
};

export default Transaction;
