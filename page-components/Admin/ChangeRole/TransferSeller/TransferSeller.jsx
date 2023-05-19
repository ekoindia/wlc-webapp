import { Avatar, Box, Circle, Flex, Select, Text } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { Endpoints } from "constants/EndPoints";
// import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useState } from "react";
import { MoveAgents as FromAgents } from "..";

const TransferSeller = ({ setIsShowSelectAgent, onScspFromChange }) => {
	function handleSelectedEkocspids(newSelectedEkocspids) {
		setSelectedEkocspids(newSelectedEkocspids);
	}

	const [selectedEkocspids, setSelectedEkocspids] = useState([]);

	const [fromValue, setFromValue] = useState("");
	const [toValue, setToValue] = useState("");
	const [distributor, setDistributor] = useState([]);
	const [scspFrom, setScspFrom] = useState([]);
	const [scspto, setScspTo] = useState([]);
	const { accessToken } = useSession();
	// const { orgDetail } = useOrgDetailContext();
	const [fromSellerid, setFromSellerid] = useState([]);

	const handleFromChange = (event) => {
		setFromValue(event.target.value);
	};
	function handleToChange(event) {
		setToValue(event.target.value);
	}

	const handleMoveagent = () => {
		setFromSellerid(selectedEkocspids);
	};

	const body = {
		scspFrom: fromValue,
		scspTo: toValue,
		selectedTransferredCSPList: fromSellerid,
	};

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"Content-Type": "application/json",
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agents/profile/changeRole/transfercsps",
				"tf-req-method": "PUT",
			},
			body: body,
			token: accessToken,
		})
			.then((data) => {
				const distributor = data?.data?.allScspList ?? [];
				console.log("distributor", distributor);
				setDistributor(distributor);

				const scspFrom = data?.data?.allCspListOfScspFrom ?? [];
				console.log("scspFrom", scspFrom);
				setScspFrom(scspFrom);

				const scspTo = data?.data?.allCspListOfScspTo ?? [];
				console.log("scsp", scspTo);
				setScspTo(scspTo);

				// Call the onScspFromChange function with the scspFrom values
				onScspFromChange(scspFrom);
			})
			.catch((error) => {
				console.error("📡 Fetch Error:", error);
			});
	}, [fromValue, toValue, fromSellerid]);

	return (
		<Box>
			{/* Select  */}
			<Flex
				px="0"
				columnGap={{
					base: "0",
					md: "180px",
					xl: "160px",
					"2xl": "180px",
				}}
				rowGap={{ base: "40px", md: "30px" }}
				flexWrap="wrap"
			>
				<Box w={{ base: "100%", xl: "460px", "2xl": "500px" }}>
					<Text
						color="#0C243B"
						fontSize={{ base: "sm", md: "md" }}
						fontWeight="semibold"
						mb="2.5"
					>
						Select distributor to transfer agents from
					</Text>

					<Select
						id="from-select"
						value={fromValue}
						onChange={handleFromChange}
						w="100%"
						placeholder="--Select--"
						h="12"
						icon={
							<Icon
								name="caret-down"
								size="14px"
								// h="10px"
								color="light"
							/>
						}
						distributor={distributor}
					>
						{distributor?.map((option) => (
							<option key={option.value} value={option.ekocspid}>
								{option.DisplayName}
							</option>
						))}
					</Select>
				</Box>
				<Box w={{ base: "100%", xl: "460px", "2xl": "500px" }}>
					<Text
						color="#0C243B"
						fontSize={{ base: "sm", md: "md" }}
						fontWeight="semibold"
						mb="2.5"
					>
						Select distributor to transfer agents to
					</Text>
					<Select
						id="to-select"
						value={toValue}
						onChange={handleToChange}
						w="100%"
						placeholder="--Select--"
						h="12"
						icon={
							<Icon
								name="caret-down"
								size="14px"
								// h="10px"
								color="light"
							/>
						}
					>
						{distributor.map((option) => (
							<option key={option.value} value={option.ekocspid}>
								{option.DisplayName}
							</option>
						))}
					</Select>
				</Box>
			</Flex>

			{/* Button for mobile responsive */}
			<Flex
				mt="70px"
				mb="14px"
				display={{ base: "flex", md: "none" }}
				direction={{ base: "column", sm: "row" }}
				columnGap="30px"
				rowGap="24px"
			>
				<Button
					h="54px"
					fontSize="md"
					onClick={() => setIsShowSelectAgent(true)}
				>
					Select Agents
				</Button>
				<Button
					h="54px"
					variant="ghost"
					color="accent.DEFAULT"
					fontSize="md"
				>
					Cancel
				</Button>
			</Flex>

			{/* Select for Move */}
			<Flex mt="10.5" h="auto" display={{ base: "none", md: "flex" }}>
				<FromAgents
					options={scspFrom}
					selectedEkocspids={selectedEkocspids}
					onSelectedEkocspidsChange={handleSelectedEkocspids}
				/>{" "}
				<Flex width="180px" align="center" justify="center">
					<Circle
						bg="secondary.DEFAULT"
						w="82px"
						h="82px"
						color="divider"
					>
						<Icon
							name="fast-forward"
							// width="34px"
							size="36px"
						/>
					</Circle>
				</Flex>
				<Box w="500px">
					<Text
						color="#0C243B"
						fontSize={"md"}
						fontWeight="semibold"
						mb="15px"
					>
						<Text
							as="span"
							color="light"
							display={{ base: "block", lg: "inline-block" }}
						>
							Move Sellers To:
						</Text>{" "}
						AngelTech Private Limited
					</Text>
					<Flex
						w="100%"
						direction="column"
						border="card"
						borderRadius="10"
						h="635px"
						overflow="auto"
						css={{
							"&::-webkit-scrollbar": {
								width: "7px",
							},
							"&::-webkit-scrollbar-track": {
								width: "7px",
							},
							"&::-webkit-scrollbar-thumb": {
								background: "#555555",
								borderRadius: "5px",
								border: "1px solid #707070",
							},
						}}
					>
						{/* Move Sellerr To */}
						{scspto.length
							? scspto.map((ele, idx) => {
									return (
										<Flex
											px="5"
											py="4"
											bg="inherit"
											key={idx}
											_even={{
												bg: "shade",
											}}
											color="accent.DEFAULT"
											fontSize="sm"
											columnGap="15px"
											align="center"
										>
											<Avatar
												name={ele.DisplayName[0]}
												bg="accent.DEFAULT"
												w="36px"
												h="36px"
											/>
											{ele.DisplayName}
										</Flex>
									);
							  })
							: null}
					</Flex>
				</Box>
			</Flex>

			{/* Buttons */}
			<Flex
				mt="70px"
				columnGap="36px"
				display={{ base: "none", md: "flex" }}
				align={"center"}
				h="64px"
			>
				<Button
					w="164px"
					h="100%"
					fontSize={"xl"}
					onClick={handleMoveagent}
				>
					Move Now
				</Button>
				<Button
					variant="ghost"
					color="accent.DEFAULT"
					fontSize={"xl"}
					h="100%"
				>
					Cancel
				</Button>
			</Flex>
		</Box>
	);
};

export default TransferSeller;
