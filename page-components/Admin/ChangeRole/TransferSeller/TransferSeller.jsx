import {
	Avatar,
	Circle,
	Flex,
	FormControl,
	FormLabel,
	Text,
} from "@chakra-ui/react";
import { Button, Icon, Select } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useEffect, useState } from "react";
import { MoveAgents } from "..";

const renderer = {
	label: "name",
	value: "user_code",
};

/**
 * A TransferSeller Tab inside ChangeRole page-component
 * TODO: Write more description here
 * @example	`<TransferSeller></TransferSeller>`
 */
const TransferSeller = ({ setIsShowSelectAgent /* , onScspFromChange */ }) => {
	const [transferAgentsFrom, setTransferAgentsFrom] = useState({
		value: "",
		label: "",
	});
	const [transferAgentsTo, setTransferAgentsTo] = useState({
		value: "",
		label: "",
	});
	const [distributors, setDistributors] = useState([]);
	const [filteredDistributors, setFilteredDistributors] = useState([]);
	const [agentListToTransferAgentsFrom, setAgentListToTransferAgentsFrom] =
		useState([]);
	const [agentListToTransferAgentsTo, setAgentListToTransferAgentsTo] =
		useState([]);

	const [selectedAgentsToTransfer, setSelectedAgentsToTransfer] = useState();
	const { accessToken } = useSession();

	const handleSelectedAgents = (_agents) => {
		setSelectedAgentsToTransfer(_agents);
	};

	const fetchList = (headers, cb) => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: headers,
			token: accessToken,
		}).then((res) => {
			cb(res);
		});
	};

	const body = {
		scspFrom: transferAgentsFrom.value,
		scspTo: transferAgentsTo.value,
		selectedTransferredCSPsList: selectedAgentsToTransfer,
	};

	const handleMoveAgent = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents/profile/changeRole/transfercsps`,
				"tf-req-method": "PUT",
			},
			body: body,
			token: accessToken,
		}).then((res) => {
			console.log("res", res);
		});
	};

	const handleTransferAgentsSelectChange = (event, type) => {
		const selectedValue = event.target.value;
		const selectedLabel =
			event.target.options[event.target.selectedIndex].text;

		if (type === "FROM") {
			setTransferAgentsFrom({
				value: selectedValue,
				label: selectedLabel,
			});
		} else {
			setTransferAgentsTo({ value: selectedValue, label: selectedLabel });
		}
	};

	useEffect(() => {
		fetchList(
			{
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agent-list?usertype=1`,
				"tf-req-method": "GET",
			},
			(res) => {
				const _distributor = res?.data?.csp_list;
				setDistributors(_distributor);
			}
		);
	}, []);

	useEffect(() => {
		if (transferAgentsFrom.value == "") {
			setTransferAgentsTo({
				value: "",
				label: "",
			});
		}
	}, [transferAgentsFrom.value]);

	useEffect(() => {
		if (transferAgentsFrom.value != "") {
			fetchList(
				{
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": `/network/agent-list?usertype=2&user_id=${transferAgentsFrom.value}`,
					"tf-req-method": "GET",
				},
				(res) => {
					const _agentList = res?.data?.csp_list ?? [];
					const _filteredDistributor = distributors?.filter(
						(item) =>
							item[renderer.value] !== transferAgentsFrom.value
					);
					setAgentListToTransferAgentsFrom(_agentList);
					setFilteredDistributors(_filteredDistributor);
				}
			);
		}
		if (transferAgentsTo.value != "") {
			fetchList(
				{
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": `/network/agent-list?usertype=2&user_id=${transferAgentsTo.value}`,
					"tf-req-method": "GET",
				},
				(res) => {
					const _agentList = res?.data?.csp_list ?? [];
					setAgentListToTransferAgentsTo(_agentList);
				}
			);
		}
	}, [transferAgentsFrom.value, transferAgentsTo.value]);

	return (
		<div>
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
				<FormControl w={{ base: "100%", xl: "500px" }}>
					<FormLabel>
						Select distributor to transfer agents from
					</FormLabel>
					<Select
						id="from-select"
						value={transferAgentsFrom.value}
						onChange={(event) =>
							handleTransferAgentsSelectChange(event, "FROM")
						}
						renderer={renderer}
						options={distributors}
					/>
				</FormControl>
				<FormControl w={{ base: "100%", xl: "500px" }}>
					<FormLabel>
						Select distributor to transfer agents to
					</FormLabel>
					<Select
						id="to-select"
						value={transferAgentsTo.value}
						onChange={(event) =>
							handleTransferAgentsSelectChange(event, "TO")
						}
						renderer={renderer}
						options={filteredDistributors}
						disabled={!transferAgentsFrom.value}
					/>
				</FormControl>
			</Flex>

			{/* Select for Move */}
			{transferAgentsFrom.value && transferAgentsTo.value ? (
				<Flex mt="10.5" h="auto" display={{ base: "none", md: "flex" }}>
					<MoveAgents
						options={agentListToTransferAgentsFrom}
						label={transferAgentsFrom.label}
						onChange={handleSelectedAgents}
					/>
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
					<Flex w="500px" direction="column" gap="3">
						<Flex fontWeight="semibold" gap="1">
							<Text color="light"> Move Retailers To:</Text>
							<Text display="block">
								{transferAgentsTo.label}
							</Text>
						</Flex>
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
							{/* Move Retailer To */}
							{agentListToTransferAgentsTo?.map((ele, idx) => {
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
											name={ele.name[0]}
											bg="accent.DEFAULT"
											w="36px"
											h="36px"
										/>
										{ele.name}
									</Flex>
								);
							})}
						</Flex>
					</Flex>
				</Flex>
			) : null}

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
			{/* Buttons for desktop */}
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
					onClick={handleMoveAgent}
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
		</div>
	);
};

export default TransferSeller;
