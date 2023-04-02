import {
	Avatar,
	Box,
	Button,
	Circle,
	Flex,
	Select,
	Text,
} from "@chakra-ui/react";
import { Buttons, Icon } from "components";
import { MoveAgents } from "..";
import useRequest from "hooks/useRequest";
import { useUser } from "contexts/UserContext";
import { useEffect, useState } from "react";
// text - align: left;
// font: normal normal 600 16px / 18px Inter;
// letter - spacing: 0px;
// color: #0C243B;
// opacity: 1;

const dataa = [
	{
		title: "R. J. Technology",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "R. J. Technology",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "R. J. Technology",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "R. J. Technology",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
];

const TransferCSP = ({ setIsShowSelectAgent }) => {
	const [fromValue, setFromValue] = useState("");
	const [toValue, setToValue] = useState("");

	function handleFromChange(event) {
		setFromValue(event.target.value);
	}

	function handleToChange(event) {
		setToValue(event.target.value);
	}

	const body = {
		initiator_id: "9451000001",
		org_id: "1",
		source: "WLC",
		client_ref_id: "202301031354123456",
		scspFrom: "7744",
		scspTo: "5555",
	};

	let headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": "/network/agents/profile/changeRole/transfercsps",
		"tf-req-method": "PUT",
	};

	fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do", {
		method: "POST",
		headers: headers,
		body: JSON.stringify(body),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("data", data);
		})
		.catch((error) => {
			console.error("Error:", error);
		});

	const distributor = data?.data?.allScspList ?? [];
	console.log("optionFdistributordistributorrom", distributor);

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
				<Box w={{ base: "100%", xl: "470px", "2xl": "500px" }}>
					<Text
						color="#0C243B"
						fontSize={{ base: "sm", md: "md" }}
						fontWeight="semibold"
						mb="2.5"
					>
						Select distributor to transfer agents from
					</Text>

					{/* <Select
						w="100%"
						placeholder="--Select--"
						h="12"
						icon={<Icon name="caret-down" />}
					>
						<option value="option1">Option 1</option>
						<option value="option2">Option 2</option>
						<option value="option3">Option 3</option>
					</Select> */}
					<Select
						id="from-select"
						value={fromValue}
						onChange={handleFromChange}
						w="100%"
						placeholder="--Select--"
						h="12"
						icon={<Icon name="caret-down" />}
					>
						{" "}
						{console.log("fromValue", fromValue)}
						{distributor.map((option) => (
							<option key={option.value} value={option.ekocspid}>
								{option.DisplayName}
							</option>
						))}
					</Select>
				</Box>
				<Box w={{ base: "100%", xl: "480px", "2xl": "500px" }}>
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
						icon={<Icon name="caret-down" />}
					>
						{distributor.map((option) => (
							<option key={option.value} value={option.ekocspid}>
								{option.DisplayName}
							</option>
						))}
						{console.log("TOValue", toValue)}
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
				onClick={() => setIsShowSelectAgent(true)}
			>
				<Buttons h="54px" fontSize="md">
					Select Agents
				</Buttons>
				<Buttons
					h="54px"
					variant=""
					color="accent.DEFAULT"
					fontSize="md"
				>
					Cancel
				</Buttons>
			</Flex>

			{/* Select for Move */}
			<Flex mt="10.5" h="auto" display={{ base: "none", md: "flex" }}>
				<MoveAgents />

				<Flex width="180px" align="center" justify="center">
					<Circle bg="#1F5AA7" w="82px" h="82px" color="#E9EDF1">
						<Icon name="fast-forward" width="34px" height="36px" />
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
							display={{ md: "block", lg: "inline-block" }}
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
						<Flex
							px="5"
							py="4"
							bg="inherit"
							color="accent.DEFAULT"
							fontSize="sm"
							align="center"
							columnGap="15px"
						>
							<Avatar
								name={"R"}
								bg="accent.DEFAULT"
								w="36px"
								h="36px"
							/>
							R J Finance
						</Flex>
						{dataa.map((ele, idx) => {
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
										name={ele.title[0]}
										bg="accent.DEFAULT"
										w="36px"
										h="36px"
									/>
									{ele.title}
								</Flex>
							);
						})}
					</Flex>
				</Box>
			</Flex>

			{/* Buttons */}
			<Flex
				mt="70px"
				columnGap="36px"
				display={{ base: "none", md: "flex" }}
			>
				<Buttons w="164px" h="64px" fontSize={"xl"}>
					Move Now
				</Buttons>
				<Button variant="link" color="accent.DEFAULT" fontSize={"xl"}>
					Cancel
				</Button>
			</Flex>
		</Box>
	);
};

export default TransferCSP;
