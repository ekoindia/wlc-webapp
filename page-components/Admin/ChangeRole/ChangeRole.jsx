import {
	Divider,
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import { Buttons, Headings } from "components";
import { useRouter } from "next/router";

import { useUser } from "contexts/UserContext";
import { useEffect, useState } from "react";
import { MoveAgents, TransferCSP } from ".";

/**
 * A <ChangeRole> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<ChangeRole></ChangeRole>`
 */

const ChangeRole = () => {
	const [isShowSelectAgent, setIsShowSelectAgent] = useState(false);
	const tab = +useRouter().query.tab;
	const [fromValue, setFromValue] = useState("");
	const [toValue, setToValue] = useState("");
	const [distributor, setDistributor] = useState([]);
	const [scspFrom, setScspFrom] = useState([]);
	const [scspto, setScspTo] = useState([]);
	const { userData } = useUser();

	const handleFromValueChange = (value) => {
		console.log("Selected fromValue:", value);
	};

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
		scspFrom: fromValue,
		scspTo: toValue,
	};

	let headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": "/network/agents/profile/changeRole/transfercsps",
		"tf-req-method": "PUT",
	};

	// let distributor =[]

	useEffect(() => {
		fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agents/profile/changeRole/transfercsps",
				"tf-req-method": "PUT",
				authorization: `Bearer ${userData.access_token}`,
			},
			body: JSON.stringify(body),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("datadatadatadatadatadatadata", data);

				const distributor = data?.data?.allScspList ?? [];
				setDistributor(distributor);

				const scspFrom = data?.data?.allCspListOfScspFrom ?? [];
				console.log("scspFrom", scspFrom);
				setScspFrom(scspFrom);

				const ScspTo = data?.data?.allCspListOfScspTo ?? [];
				setScspTo(scspto);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}, [fromValue, toValue]);

	// const transferCspData = distributor;

	function backHandler() {
		setIsShowSelectAgent((prev) => !prev);
	}

	return !isShowSelectAgent ? (
		<>
			<Headings title="Change Role" />
			<Flex
				// my={{ base: "0", md: "7.5" }}
				align={{ base: "center", md: "flex-start" }}
				pb={{ base: "0", md: "40px" }}
				bg={{ base: "none", md: "white" }}
				direction="column"
				rowGap={{ base: "10px", md: "0" }}
				border={{ base: "", md: "card" }}
				borderRadius={{ base: "0", md: "10" }}
				boxShadow={{ base: "", md: "0px 5px 15px #0000000D;" }}
				overflow={"hidden"}
			>
				<Flex
					w="100%"
					pt="3.5"
					px={{ base: "4", md: "7.5" }}
					pb={{ base: "3.5", md: "5" }}
					bg="white"
					borderTopLeftRadius={{ base: "0", md: "10" }}
					borderTopRightRadius={{ base: "0", md: "10" }}
					borderBottom={{ base: "card", md: "0" }}
					direction="column"
					rowGap={{ base: "10px", md: "0" }}
					borderRadius={{ base: "0px", md: "none" }}
					border={{ base: "1px solid #D2D2D2", md: "none" }}
					borderTop="none"
				>
					<Text
						as="h1"
						color="accent.DEFAULT"
						fontWeight="bold"
						fontSize={{ base: "lg", md: "2xl" }}
					>
						Angel Tech Private Limited
					</Text>
					<Text fontSize={{ base: "xs", md: "md" }}>
						Edit the fields below and click Preview.
						<Text
							as="span"
							display={{ base: "block", md: "inline" }}
						>
							Click Cancel to return to Client HomePage without
							submitting information.
						</Text>
					</Text>
				</Flex>

				<Divider
					w={{ base: "0", md: "calc(100% - 60px)" }}
					mx="auto"
					color="divider"
				/>

				<Tabs
					position="relative"
					defaultIndex={tab || 0}
					variant="colorful"
					//Responsive style
					bg={{ base: "#FFFFFF", md: "transparent" }}
					border={{ base: "card", md: "none" }}
					px={{ base: "0", md: "7.5" }}
					pt={{ base: "3", md: "10.5" }}
					w={{ base: "92%", md: "100%" }}
					boxShadow={{ base: "0px 5px 15px #0000000D", md: "none" }}
					borderRadius={{ base: "10px", md: "none" }}
				>
					<TabList
						color="light"
						css={{
							"&::-webkit-scrollbar": {
								display: "none",
							},
							"&::-moz-scrollbar": {
								display: "none",
							},
							"&::scrollbar": {
								display: "none",
							},
						}}
					>
						<Tab>Transfer CSPs</Tab>
						<Tab>Promote Csp To Scsp</Tab>
						<Tab>Demote Distributor</Tab>
						<Tab>Upgrade Merchant To I-Merchant</Tab>
					</TabList>

					<TabPanels
						px={{ base: "18px", md: "0" }}
						mt={{ base: "23px", md: "32px", lg: "46px" }}
					>
						<TabPanel>
							<TransferCSP
								setIsShowSelectAgent={setIsShowSelectAgent}
								distributor={distributor}
								// onFromValueChange={}
								scspTo={scspto}
							/>
						</TabPanel>
						<TabPanel>
							<p>two!</p>
						</TabPanel>
						<TabPanel>
							<p>three!</p>
						</TabPanel>
						<TabPanel>
							<p>three!</p>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Flex>
		</>
	) : (
		<>
			<Headings title="Select Agents" redirectHandler={backHandler} />

			{/* Move button for mobile responsive */}
			<MoveAgents
				ShowSelectAgents={isShowSelectAgent}
				options={scspFrom}
			/>
			<Flex
				Flex
				display={{ base: "flex", md: "none" }}
				position={"fixed"}
				w={"100%"}
				h={"15vw"}
				maxH={"80px"}
				bottom={"0%"}
				left={"0%"}
				zIndex={"99"}
				boxShadow={"0px -3px 10px #0000001A"}
			>
				<Buttons
					variant="ghost"
					w={"50%"}
					h={"100%"}
					bg={"white"}
					fontSize="18px"
					color="accent.DEFAULT"
					onClick={() => setIsShowSelectAgent(false)}
				>
					Go Back
				</Buttons>
				<Buttons
					w={"50%"}
					h={"100%"}
					fontSize="18px"
					borderRadius="none"
				>
					Move Now
				</Buttons>
			</Flex>
		</>
	);
};

export default ChangeRole;
