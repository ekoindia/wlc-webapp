import {
	Flex,
	FormControl,
	useBreakpointValue,
	useToast,
} from "@chakra-ui/react";
import { ActionButtonGroup, Select } from "components";
import { Endpoints } from "constants";
import { UserType, UserTypeLabel } from "constants/UserTypes";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MoveAgents from "./MoveAgents";

const renderer = {
	label: "name",
	value: "user_code",
};

const independent_retailer_select_option = {
	user_code: "3",
	name: `No ${UserTypeLabel[UserType.DISTRIBUTOR]} – Transfer ${
		UserTypeLabel[UserType.I_MERCHANT]
	}s (${UserTypeLabel[UserType.MERCHANT]}s not mapped to any ${
		UserTypeLabel[UserType.DISTRIBUTOR]
	})`,
	mobile: "",
	customer_id: "",
};

/**
 * A TransferSeller Tab inside ChangeRole page-component
 * @param root0
 * @param root0.agentData
 * @param root0.showOrgChangeRoleView
 * @param root0.targetUserType
 * @example	`<TransferSeller></TransferSeller>`
 */
const TransferSeller = ({
	agentData,
	showOrgChangeRoleView,
	targetUserType = 2, // Default to Merchant
}) => {
	const [showSelectAgent, setShowSelectAgent] = useState(false);
	const [transferAgentsFrom, setTransferAgentsFrom] = useState(null);
	const [transferAgentsTo, setTransferAgentsTo] = useState(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const toast = useToast();

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
		if (isSuccess) setIsSuccess(false);
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
					default_agent_code ?? `${selectedAgentsToTransfer}`,
			},
			token: accessToken,
		})
			.then((res) => {
				if (res.response_type_id === 1872) {
					toast({
						title: res.message,
						status: "success",
						duration: 3000,
						isClosable: true,
					});
					setIsSuccess(true);
					// Optional: Refresh data or redirect if needed
				} else {
					toast({
						title: res.message,
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				}
			})
			.catch((err) => {
				toast({
					title: err?.message || "Something went wrong",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			});
	};

	const handleTransferAgentsSelectChange = (value, type) => {
		if (type === "FROM") {
			setTransferAgentsFrom(value);
		} else {
			setTransferAgentsTo(value);
		}
		if (isSuccess) setIsSuccess(false);

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
				const _distributor = res?.data?.csp_list ?? [];
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
				: `/network/agent-list?usertype=${targetUserType}&user_id=${
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
					"tf-req-uri": `/network/agent-list?usertype=${targetUserType}&user_id=${
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

	const selectAgentButtonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Select Agents",
			onClick: () => setShowSelectAgent(true),
			disabled: !transferAgentsTo,
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: () => router.back(),
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

	const moveAgentButtonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Move",
			onClick: () => handleMoveAgent(),
			disabled:
				(showOrgChangeRoleView
					? !selectedAgentsToTransfer?.length > 0
					: default_agent_code && !transferAgentsTo) || isSuccess,
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: () => router.back(),
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

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
							label={`Select ${
								UserTypeLabel[UserType.DISTRIBUTOR]
							} to transfer ${UserTypeLabel[targetUserType]}s from`}
							required={true}
							value={transferAgentsFrom}
							onChange={(value) =>
								handleTransferAgentsSelectChange(value, "FROM")
							}
							renderer={renderer}
							options={
								targetUserType === UserType.MERCHANT
									? [
											independent_retailer_select_option,
											...distributors,
										]
									: [...distributors]
							}
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
								? default_agent_type ==
									UserTypeLabel[UserType.MERCHANT] // check if we can avoid this hardcode value
									? `Select New ${
											UserTypeLabel[UserType.DISTRIBUTOR]
										}`
									: `Select ${
											UserTypeLabel[UserType.DISTRIBUTOR]
										}`
								: `Select ${
										UserTypeLabel[UserType.DISTRIBUTOR]
									} to transfer ${
										UserTypeLabel[targetUserType]
									}s to`
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
						onChange: handleSelectedAgents,
						options: agentListToTransferAgentsFrom,
						agentList: agentListToTransferAgentsTo,
						targetUserType,
					}}
				/>
			) : null}

			<ActionButtonGroup
				display={
					showOrgChangeRoleView
						? { base: "flex", md: "none" }
						: "none"
				}
				buttonConfigList={selectAgentButtonConfigList}
			/>

			<ActionButtonGroup
				display={
					showOrgChangeRoleView
						? { base: "none", md: "flex" }
						: "flex"
				}
				buttonConfigList={moveAgentButtonConfigList}
			/>
		</Flex>
	);
};

export default TransferSeller;
