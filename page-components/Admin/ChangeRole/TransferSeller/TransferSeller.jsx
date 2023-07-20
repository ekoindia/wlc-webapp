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
		<Flex direction="column" gap="8">
			<Flex
				direction={{ base: "column", md: "row" }}
				gap={{ base: "8", md: "28", xl: "36" }}
			>
				{/* TODO FIX */}
				<FormControl w={{ base: "100%", md: "500px" }}>
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
				<FormControl w={{ base: "100%", md: "500px" }}>
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
				<Flex
					display={{ base: "none", md: "flex" }}
					align="center"
					gap="8"
				>
					<MoveAgents
						options={agentListToTransferAgentsFrom}
						label={transferAgentsFrom.label}
						onChange={handleSelectedAgents}
					/>

					<Circle
						size={{ base: "12", xl: "20" }}
						color="divider"
						bg="secondary.DEFAULT"
					>
						<Icon
							name="fast-forward"
							size={{ base: "sm", xl: "lg" }}
						/>
					</Circle>

					<TransferAgentsToBox
						agentList={agentListToTransferAgentsTo}
						transferAgentsTo={transferAgentsTo}
					/>
				</Flex>
			) : null}

			{/* Button for mobile responsive */}
			<Flex
				display={{ base: "flex", md: "none" }}
				direction={{ base: "column", sm: "row" }} //TODO fix this
				gap={{ base: "6", md: "12" }}
			>
				<Button
					h="54px"
					fontSize="md"
					onClick={() => setIsShowSelectAgent(true)}
				>
					Select Agents
				</Button>
				<Button
					bg="none"
					variant="link"
					fontWeight="bold"
					color="accent.DEFAULT"
					_hover={{ textDecoration: "none" }}
				>
					Cancel
				</Button>
			</Flex>
			{/* Buttons for desktop */}
			<Flex
				display={{ base: "none", md: "flex" }}
				gap={{ base: "6", md: "12" }}
			>
				<Button
					size="lg"
					h="54px"
					w={{ base: "100%", md: "164px" }}
					fontWeight="bold"
					onClick={handleMoveAgent}
				>
					Move Now
				</Button>
				<Button
					bg="none"
					variant="link"
					fontWeight="bold"
					color="accent.DEFAULT"
					_hover={{ textDecoration: "none" }}
				>
					Cancel
				</Button>
			</Flex>
		</Flex>
	);
};

export default TransferSeller;

const TransferAgentsToBox = ({ agentList, transferAgentsTo }) => {
	return (
		<Flex w="500px" direction="column" gap="3">
			<Flex fontWeight="semibold" gap="1">
				<Text color="light">
					Move Retailers To: &thinsp;
					<Text as="span" color="dark">
						{transferAgentsTo.label}
					</Text>
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
				{agentList?.map((row, index) => (
					<Flex
						px="5"
						py="4"
						bg="inherit"
						key={index}
						_even={{
							bg: "shade",
						}}
						color="accent.DEFAULT"
						fontSize="sm"
						columnGap="15px"
						align="center"
					>
						<Avatar
							name={row.name[0]}
							bg="accent.DEFAULT"
							w="36px"
							h="36px"
						/>
						{row.name}
					</Flex>
				))}
			</Flex>
		</Flex>
	);
};
