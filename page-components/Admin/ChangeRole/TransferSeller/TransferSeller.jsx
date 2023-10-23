import { Flex, FormControl, useBreakpointValue } from "@chakra-ui/react";
import { Button, Select } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MoveAgents } from ".";

const renderer = {
	label: "name",
	value: "user_code",
};

const independent_retailer_select_option = {
	user_code: "3",
	name: "No Distributor – Transfer Independent Retailers (Retailers not mapped to any distributor)",
	mobile: "",
	customer_id: "",
};

/**
 * A TransferSeller Tab inside ChangeRole page-component
 * @example	`<TransferSeller></TransferSeller>`
 */
const TransferSeller = ({
	agentData,
	setResponseDetails,
	showOrgChangeRoleView,
}) => {
	const [showSelectAgent, setShowSelectAgent] = useState(false);
	const [transferAgentsFrom, setTransferAgentsFrom] = useState(null);
	const [transferAgentsTo, setTransferAgentsTo] = useState(null);

	const [distributors, setDistributors] = useState([]);
	const [filteredDistributors, setFilteredDistributors] = useState([]);
	const [agentListToTransferAgentsFrom, setAgentListToTransferAgentsFrom] =
		useState([]);
	const [agentListToTransferAgentsTo, setAgentListToTransferAgentsTo] =
		useState([]);
	const [selectedAgentsToTransfer, setSelectedAgentsToTransfer] = useState(
		[]
	);
	const router = useRouter();
	const { accessToken } = useSession();
	const isSmallScreen = useBreakpointValue({ base: true, md: false });
	const default_agent_code = agentData?.eko_code;
	const default_agent_type = agentData?.agent_type;

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

	const handleMoveAgent = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents/profile/changeRole/transfercsps`,
				"tf-req-method": "PUT",
			},
			body: {
				// scspFrom: transferAgentsFrom.value,
				scspTo: transferAgentsTo[renderer.value],
				selectedTransferredCSPsList:
					`${default_agent_code}` ?? `${selectedAgentsToTransfer}`,
			},
			token: accessToken,
		}).then((res) => {
			setResponseDetails({ status: res.status, message: res.message });
		});
	};

	const handleTransferAgentsSelectChange = (value, type) => {
		if (type === "FROM") {
			setTransferAgentsFrom(value);
		} else {
			setTransferAgentsTo(value);
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
		if (transferAgentsFrom) {
			setTransferAgentsTo(null);
		}
	}, [transferAgentsFrom]);

	useEffect(() => {
		if (transferAgentsFrom) {
			const isIndependentRetailer = transferAgentsFrom.user_code === "3";
			const _uri = isIndependentRetailer
				? "/network/agent-list?usertype=3"
				: `/network/agent-list?usertype=2&user_id=${
						transferAgentsFrom[renderer.value]
				  }`;

			fetchList(
				{
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": _uri,
					"tf-req-method": "GET",
				},
				(res) => {
					const _agentList = res?.data?.csp_list ?? [];
					const _filteredDistributor = distributors?.filter(
						(item) =>
							item[renderer.value] !==
							transferAgentsFrom[renderer.value]
					);
					setAgentListToTransferAgentsFrom(_agentList);
					setFilteredDistributors(_filteredDistributor);
				}
			);
		}

		if (transferAgentsTo) {
			fetchList(
				{
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": `/network/agent-list?usertype=2&user_id=${
						transferAgentsTo[renderer.value]
					}`,
					"tf-req-method": "GET",
				},
				(res) => {
					const _agentList = res?.data?.csp_list ?? [];
					setAgentListToTransferAgentsTo(_agentList);
				}
			);
		}
	}, [transferAgentsFrom, transferAgentsTo]);

	return (
		<Flex direction="column" gap="8">
			<Flex
				direction={{ base: "column", md: "row" }}
				gap={{ base: "8", md: "28", xl: "36" }}
			>
				{/* Hide when an agent is already selected */}
				{!showOrgChangeRoleView && default_agent_code ? null : (
					<FormControl w={{ base: "100%", md: "500px" }}>
						<Select
							id="from-select"
							label="Select distributor to transfer agents from"
							required={true}
							value={transferAgentsFrom}
							onChange={(value) =>
								handleTransferAgentsSelectChange(value, "FROM")
							}
							renderer={renderer}
							options={[
								independent_retailer_select_option,
								...distributors,
							]}
							getOptionLabel={(option) =>
								option.mobile
									? `${option.name} ✆ ${option.mobile}`
									: option.name
							}
						/>
					</FormControl>
				)}

				<FormControl w={{ base: "100%", md: "500px" }}>
					<Select
						id="to-select"
						label={
							!showOrgChangeRoleView && default_agent_code
								? default_agent_type == "Retailer" // check if we can avoid this hardcode value
									? "Select New Distributor"
									: "Select Distributor"
								: "Select distributor to transfer agents to"
						}
						required={true}
						value={transferAgentsTo}
						onChange={(value) =>
							handleTransferAgentsSelectChange(value, "TO")
						}
						renderer={renderer}
						options={
							filteredDistributors.length
								? filteredDistributors
								: distributors
						}
						disabled={!default_agent_code && !transferAgentsFrom}
						getOptionLabel={(option) =>
							`${option.name} ✆ ${option.mobile}`
						}
					/>
				</FormControl>
			</Flex>

			{/* Select for Move */}
			{showSelectAgent &&
			showOrgChangeRoleView &&
			transferAgentsFrom &&
			transferAgentsTo ? (
				<MoveAgents
					{...{
						setShowSelectAgent,
						transferAgentsTo,
						transferAgentsFrom,
						selectedAgentsToTransfer,
						setResponseDetails,
						onChange: handleSelectedAgents,
						options: agentListToTransferAgentsFrom,
						agentList: agentListToTransferAgentsTo,
					}}
				/>
			) : null}

			{/* Button for mobile responsive */}
			<Flex
				display={
					showOrgChangeRoleView
						? { base: "flex", md: "none" }
						: "none"
				}
				direction="row-reverse"
				w="100%"
				position="fixed"
				gap="0"
				align="center"
				bottom="0"
				left="0"
			>
				<Button
					size="lg"
					h="64px"
					w="100%"
					fontWeight="bold"
					borderRadius="none"
					onClick={() => setShowSelectAgent(true)}
					disabled={!transferAgentsTo}
				>
					Select Agents
				</Button>

				<Button
					h="64px"
					w="100%"
					bg="white"
					variant="link"
					fontWeight="bold"
					color="primary.DEFAULT"
					_hover={{ textDecoration: "none" }}
					borderRadius="none"
					onClick={() => router.back()}
				>
					Cancel
				</Button>
			</Flex>

			<Flex
				display={
					showOrgChangeRoleView
						? { base: "none", md: "flex" }
						: "flex"
				}
				direction={{ base: "row-reverse", md: "row" }}
				w={{ base: "100%", md: "500px" }}
				position={{ base: "fixed", md: "initial" }}
				gap={{ base: "0", md: "16" }}
				align="center"
				bottom="0"
				left="0"
			>
				<Button
					size="lg"
					h="64px"
					w={{ base: "100%", md: "250px" }}
					fontWeight="bold"
					borderRadius={{ base: "none", md: "10" }}
					onClick={handleMoveAgent}
					disabled={
						showOrgChangeRoleView
							? !selectedAgentsToTransfer?.length > 0
							: default_agent_code && !transferAgentsTo
					}
				>
					Move
				</Button>

				<Button
					h={{ base: "64px", md: "auto" }}
					w={{ base: "100%", md: "initial" }}
					bg={{ base: "white", md: "none" }}
					variant="link"
					fontWeight="bold"
					color="primary.DEFAULT"
					_hover={{ textDecoration: "none" }}
					borderRadius={{ base: "none", md: "10" }}
					onClick={() => router.back()}
				>
					Cancel
				</Button>
			</Flex>
		</Flex>
	);
};

export default TransferSeller;
