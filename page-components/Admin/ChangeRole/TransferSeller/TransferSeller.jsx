import { Flex, FormControl, Text, useBreakpointValue } from "@chakra-ui/react";
import { Button, Icon, Select } from "components";
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

/**
 * A TransferSeller Tab inside ChangeRole page-component
 * @example	`<TransferSeller></TransferSeller>`
 */
const TransferSeller = ({ agentData, setResponseDetails }) => {
	const [showSelectAgent, setShowSelectAgent] = useState(false);
	const [transferAgentsFrom, setTransferAgentsFrom] = useState(null);
	const [transferAgentsTo, setTransferAgentsTo] = useState(null);

	const router = useRouter();

	const default_agent_code = agentData?.eko_code;

	const [distributors, setDistributors] = useState([]);
	const [filteredDistributors, setFilteredDistributors] = useState([]);
	const [agentListToTransferAgentsFrom, setAgentListToTransferAgentsFrom] =
		useState([]);
	const [agentListToTransferAgentsTo, setAgentListToTransferAgentsTo] =
		useState([]);

	const [selectedAgentsToTransfer, setSelectedAgentsToTransfer] = useState(
		[]
	);
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
			fetchList(
				{
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": `/network/agent-list?usertype=2&user_id=${
						transferAgentsFrom[renderer.value]
					}`,
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
				{default_agent_code ? null : (
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
							options={distributors}
							getOptionLabel={(option) => {
								return (
									<Flex as="span" align="center" gap="2">
										<Text noOfLines="1">{option.name}</Text>
										<Flex
											color="light"
											fontSize="xs"
											align="center"
											gap="1"
										>
											<Icon name="phone" size="xs" />
											{option.mobile}
										</Flex>
									</Flex>
								);
							}}
						/>
					</FormControl>
				)}

				<FormControl w={{ base: "100%", md: "500px" }}>
					<Select
						id="to-select"
						label="Select distributor to transfer agents to"
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
						getOptionLabel={(option) => {
							return (
								<Flex as="span" align="center" gap="2">
									<Text noOfLines="1">{option.name}</Text>
									<Flex
										color="light"
										fontSize="xs"
										align="center"
										gap="1"
									>
										<Icon name="phone" size="xs" />
										{option.mobile}
									</Flex>
								</Flex>
							);
						}}
					/>
				</FormControl>
			</Flex>

			{/* Select for Move */}
			{showSelectAgent && transferAgentsFrom && transferAgentsTo ? (
				<MoveAgents
					options={agentListToTransferAgentsFrom}
					onChange={handleSelectedAgents}
					setShowSelectAgent={setShowSelectAgent}
					agentList={agentListToTransferAgentsTo}
					transferAgentsTo={transferAgentsTo}
					transferAgentsFrom={transferAgentsFrom}
					selectedAgentsToTransfer={selectedAgentsToTransfer}
					setResponseDetails={setResponseDetails}
				/>
			) : null}

			{/* Button for mobile responsive */}
			<Flex
				display={{ base: "flex", md: "none" }}
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
					disabled={
						transferAgentsFrom == null ||
						transferAgentsFrom == undefined ||
						transferAgentsTo == null ||
						transferAgentsTo == undefined
					}
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

			{/* Buttons for desktop */}
			<Flex
				display={{ base: "none", md: "flex" }}
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
					disabled={!selectedAgentsToTransfer?.length > 0}
				>
					Move Now
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
