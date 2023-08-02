import {
	Flex,
	FormControl,
	FormLabel,
	useBreakpointValue,
} from "@chakra-ui/react";
import { Button, Select } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useEffect, useState } from "react";
import { MoveAgents } from ".";

const renderer = {
	label: "name",
	value: "user_code",
};

/**
 * A TransferSeller Tab inside ChangeRole page-component
 * @example	`<TransferSeller></TransferSeller>`
 */
const TransferSeller = () => {
	const [showSelectAgent, setShowSelectAgent] = useState(false);
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

	const isSmallScreen = useBreakpointValue({ base: true, md: false });

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

		if (!isSmallScreen) {
			setShowSelectAgent(true);
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
			{showSelectAgent &&
			transferAgentsFrom.value &&
			transferAgentsTo.value ? (
				<MoveAgents
					options={agentListToTransferAgentsFrom}
					onChange={handleSelectedAgents}
					setShowSelectAgent={setShowSelectAgent}
					agentList={agentListToTransferAgentsTo}
					transferAgentsTo={transferAgentsTo}
					transferAgentsFrom={transferAgentsFrom}
					selectedAgentsToTransfer={selectedAgentsToTransfer}
				/>
			) : null}

			{/* Button for mobile responsive */}
			<Flex
				display={{ base: "flex", md: "none" }}
				direction={{ base: "column", sm: "row" }} //Refactor this
				gap={{ base: "6", md: "12" }}
			>
				<Button
					h="54px"
					fontSize="md"
					onClick={() => setShowSelectAgent(true)}
				>
					Select Agents
				</Button>
				<Button
					bg="none"
					variant="link"
					fontWeight="bold"
					color="primary.DEFAULT"
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
					color="primary.DEFAULT"
					_hover={{ textDecoration: "none" }}
				>
					Cancel
				</Button>
			</Flex>
		</Flex>
	);
};

export default TransferSeller;
