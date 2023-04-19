import {
	Box,
	Flex,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Text,
} from "@chakra-ui/react";
import { Button, Calenders, Headings, Icon, Input } from "components";
import { SearchBar } from "components/SearchBar";
import useRequest from "hooks/useRequest";
import { useState } from "react";
import { TransactionTable } from ".";

/**
 * A <Transaction> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Transaction></Transaction>`
 */

const pillsData = [
	{ id: "1", name: "All" },
	{ id: "2", name: "Send Cash" },
	{ id: "3", name: "AePS Transaction" },
	{ id: "4", name: "Indo-Nepal Transaction" },
	{ id: "5", name: "Card Payment" },
	{ id: "6", name: "UPI Payment" },
	{ id: "7", name: "Bill Payment" },
	{ id: "8", name: "Deposit" },
];

function Pill({ name, activePillIndex, index }) {
	return (
		<Box
			h="23px"
			w="100%"
			whiteSpace="nowrap"
			cursor={"pointer"}
			px="10px"
			border="1px solid #D2D2D2"
			borderRadius="30px"
			bg={activePillIndex === index ? "accent.DEFAULT" : "white"}
			color={activePillIndex === index ? "white" : "light"}
			_hover={{ bg: "accent.DEFAULT", color: "white" }}
			display={"flex"}
			justifyContent={"center"}
			alignItems="center"
		>
			<Box display={"flex"} textAlign="justify">
				<Text fontSize={"12px"}>{name}</Text>
			</Box>
		</Box>
	);
}

const Transaction = () => {
	const [activePillIndex, setActivePillIndex] = useState(0);
	const [searchValue, setSearchValue] = useState("");

	function onChangeHandler(e) {
		setSearchValue(e);
	}
	const handlePillClick = (index) => {
		setActivePillIndex(index);
	};

	const body = {
		client_ref_id: 551681714635439,
		locale: "en",
		user_id: 8888888888,
		interaction_type_id: 154,
		start_index: 0,
		limit: 10,
		account_id: 391179,
	};

	const { data, error, isLoading, mutate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		body: { ...body },
	});

	// useEffect(() => {
	// 	mutate(
	// 		process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do"
	// 		// headers
	// 	);
	// }, []);

	console.log("data", data);
	const transactionList = data?.data?.transaction_list ?? [];
	console.log("transactionList", transactionList);

	const [isOpen, setIsOpen] = useState(false);

	const onClose = () => setIsOpen(false);
	const onOpen = () => setIsOpen(true);

	return (
		<>
			<Headings title="Transaction History" />
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
				{/* <Box>
					<Text fontSize="24px" fontWeight={"semibold"}>
						Transaction History
					</Text>
				</Box> */}

				<Flex
					justifyContent={"space-between"}
					direction={{ base: "column-reverse", lg: "row" }}
					alignItems={{ base: "none", lg: "center" }}
				>
					{/* <===========================Toggles Button ===============================> */}
					<Flex
						gap="8px"
						overflowX="auto"
						mt={{ base: "40px", lg: "0px" }}
					>
						{pillsData.map((pill, index) => (
							<Box
								key={index}
								onClick={() => handlePillClick(index)}
							>
								<Pill
									name={pill.name}
									activePillIndex={activePillIndex}
									index={index}
								/>
							</Box>
						))}
					</Flex>
					<Flex gap="10px" justifyContent="space-between">
						{/* <==========Search =========> */}
						<Flex>
							<SearchBar
								inputContStyle={{
									width: {
										base: "282px",
										md: "400px",
										lg: "150px",
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
							<Button
								w="100%"
								h="36px"
								_hover={{ bg: "accent.DEFAULT" }}
								onClick={onOpen}
							>
								<Icon name="filter" width="18px" />
								&nbsp;
								<Text display={{ base: "none", md: "flex" }}>
									Filter
								</Text>
							</Button>
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
								<ModalHeader
									fontSize={"18px"}
									fontWeight="bold"
								>
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
									<Button
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
									</Button>
								</ModalFooter>
							</ModalContent>
						</Modal>
					</Flex>
				</Flex>
				{/* <=============================Transaction Table & Card ===============================> */}
				<TransactionTable transactionList={transactionList} />
			</Flex>
		</>
	);
};

export default Transaction;
