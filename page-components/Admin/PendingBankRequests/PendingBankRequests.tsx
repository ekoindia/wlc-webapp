import {
	Box,
	Button,
	Flex,
	FormLabel,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Text,
	Textarea,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { PaddingBox, PageTitle, Table } from "components";
import { Endpoints } from "constants/index";
import { useOrgDetailContext, usePubSub, useSession, useUser } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useRouter } from "next/router";
import {
	type ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

interface PendingRequest {
	createdAt: string;
	reason: string;
	data: string;
	changeType: string;
	agentName?: string | null;
	agent_name?: string | null;
	agent?: { agent_name?: string | null } | null;
	makerName?: string | null;
	maker_name?: string | null;
	name?: string | null;
	user_name?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	transactionId: string;
	requestId?: string;
	intentId?: string;
	status?: number | string | null;
	actionMessage?: string;
	profile?: { agent_name?: string | null };
}

interface ParsedBankData {
	ifsc: string;
	accountNumber: string;
}

const parseData = (dataStr: string): ParsedBankData | null => {
	try {
		return JSON.parse(dataStr);
	} catch {
		return null;
	}
};

const getAgentName = (item: PendingRequest) => {
	const rawName =
		item.agentName ??
		item.agent_name ??
		item.profile?.agent_name ??
		item.agent?.agent_name ??
		item.name ??
		item.user_name ??
		(item.first_name || item.last_name
			? `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim()
			: undefined);

	if (typeof rawName === "string" && rawName.trim()) {
		// Filter out symbol references like #sym:makerName
		if (rawName.startsWith("#sym:")) {
			return "—";
		}
		return rawName;
	}

	if (typeof rawName === "object" && rawName !== null) {
		return (
			(rawName as any).agent_name ||
			(rawName as any).name ||
			JSON.stringify(rawName)
		);
	}

	return "—";
};

const getMakerName = (item: PendingRequest) => {
	const rawName =
		item.makerName ??
		item.maker_name ??
		item.name ??
		item.user_name ??
		(item.first_name || item.last_name
			? `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim()
			: undefined);

	if (typeof rawName === "string" && rawName.trim()) {
		// Filter out symbol references like #sym:makerName
		if (rawName.startsWith("#sym:")) {
			return "—";
		}
		return rawName;
	}

	if (typeof rawName === "object" && rawName !== null) {
		return (
			(rawName as any).maker_name ||
			(rawName as any).name ||
			JSON.stringify(rawName)
		);
	}

	return "—";
};

const PendingBankRequests = () => {
	const router = useRouter();
	const { accessToken, userId } = useSession();
	const { userData } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();
	const [requests, setRequests] = useState<PendingRequest[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isActioning, setIsActioning] = useState(false);
	const [actioningRequest, setActioningRequest] = useState<{
		requestId: string;
		action: "approve" | "reject";
	} | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [rejectDialog, setRejectDialog] = useState<{
		isOpen: boolean;
		requestId: string;
		intentId: string;
	}>({ isOpen: false, requestId: "", intentId: "" });
	const [rejectReason, setRejectReason] = useState("");

	const userCode = useMemo(() => {
		const rawCode =
			router.query.user_code ||
			router.query.userCode ||
			userData?.userDetails?.code;
		if (Array.isArray(rawCode)) {
			return rawCode[0];
		}
		return rawCode ?? "";
	}, [
		router.query.user_code,
		router.query.userCode,
		userData?.userDetails?.code,
	]);

	// PubSub to notify other components about changes
	const { publish, TOPICS } = usePubSub();

	const shouldFetch = Boolean(accessToken && orgDetail?.org_id);

	const fetchRequests = useCallback(async () => {
		if (!shouldFetch) {
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response: any = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					headers: {
						"tf-req-uri-root-path": "/ekoicici/v1",
						"tf-req-uri": `/request`,
						"tf-req-method": "POST",
					},
					body: {
						interaction_type_id: "1060",
						bc: "3",
						operation_type: 2,
						initiator_id: userId,
						org_id: orgDetail?.org_id,
						lang: "null",
						source: "WLC",
						version: "v2",
					},
					token: accessToken,
				},

				generateNewToken
			);

			if (response && response.status === 0) {
				const raw =
					response?.data?.agent_details ?? response?.data ?? [];
				setRequests(Array.isArray(raw) ? raw : []);
			} else {
				setError(response.message || "Failed to fetch requests");
			}
		} catch (err: any) {
			setError(err.message || "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}, [shouldFetch, accessToken, orgDetail?.org_id, generateNewToken, userId]);

	const handleRequestAction = async (
		requestId: string,
		intentId: string | undefined,
		operationType: number,
		reason?: string
	) => {
		if (!shouldFetch || !requestId) {
			return;
		}

		setIsActioning(true);
		setError(null);

		try {
			// Generate client_ref_id for tracking
			const clientRefId =
				Date.now() + "" + Math.floor(Math.random() * 1000);

			// Get realsourceip from org metadata or environment
			let realSourceIp =
				orgDetail?.metadata?.realsourceip ||
				process.env.NEXT_PUBLIC_REAL_SOURCE_IP ||
				undefined;

			const response: any = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					headers: {
						"tf-req-uri-root-path": "/ekoicici/v1",
						"tf-req-uri": `/request`,
						"tf-req-method": "POST",
					},
					body: {
						interaction_type_id: "1060",
						client_ref_id: clientRefId,
						bc: "3",
						operation_type: operationType,
						intent_id: intentId ? parseInt(intentId) : 2,
						request_id: requestId,
						user_code: userCode,
						initiator_id: String(userId),
						org_id: String(orgDetail?.org_id),
						lang: "null",
						source: "WLC",
						version: "v2",
						realsourceip: realSourceIp,
						...(reason ? { reason } : {}),
					},
					token: accessToken,
				},
				generateNewToken
			);

			if (response && response.status === 0) {
				const statusValue = intentId
					? parseInt(intentId as any)
					: undefined;
				const actionLabel =
					statusValue === 2
						? "Approved"
						: statusValue === 5
							? "Rejected"
							: "Updated";
				const actionMessage =
					response.message || `${actionLabel} successful`;

				// Optimistically update local state so UI (cards/rows) reflects the new status immediately.
				setRequests((prev) =>
					prev.map((r) => {
						const idMatch =
							(r.requestId && r.requestId === requestId) ||
							(r.transactionId && r.transactionId === requestId);
						if (idMatch) {
							return {
								...r,
								status: statusValue ?? r.status,
								actionMessage,
							};
						}
						return r;
					})
				);
				toast({
					title: actionMessage,
					status: "success",
					duration: 4000,
					isClosable: true,
				});

				// Ensure source-of-truth by refetching
				await fetchRequests();

				// Notify other parts of the app (e.g., ProfilePanel) so they can refresh their data
				try {
					publish?.(TOPICS?.PENDING_BANK_REQUEST_UPDATED, {
						requestId,
						transactionId: requestId,
					});
				} catch (_e) {
					// noop
				}
			} else {
				const failureMessage =
					response.message || "Failed to update request status";
				setError(failureMessage);
				toast({
					title: failureMessage,
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			}
		} catch (err: any) {
			setError(err.message || "Something went wrong");
		} finally {
			setIsActioning(false);
		}
	};

	useEffect(() => {
		if (shouldFetch) {
			fetchRequests();
		}
	}, [fetchRequests, shouldFetch]);

	const noRequests = !isLoading && requests.length === 0;

	const columns = [
		{
			label: "#",
			show: "#",
			visible_in_table: true,
			render: (_item: any, _column: any, index: number) => index + 1,
		},
		{
			name: "transactionId",
			label: "Transaction ID",
			visible_in_table: true,
		},
		{
			name: "agentName",
			label: "Agent",
			visible_in_table: true,
			render: (item: PendingRequest) => getAgentName(item),
		},
		{
			name: "makerName",
			label: "Requested by CSO",
			visible_in_table: true,
			render: (item: PendingRequest) => getMakerName(item),
		},
		{
			name: "accountNumber",
			label: "Account Number",
			visible_in_table: true,
			render: (item: PendingRequest) => {
				const d = parseData(item.data);
				return d?.accountNumber || "—";
			},
		},
		{
			name: "ifsc",
			label: "IFSC",
			visible_in_table: true,
			render: (item: PendingRequest) => {
				const d = parseData(item.data);
				return d?.ifsc || "—";
			},
		},
		// {
		// 	name: "status",
		// 	label: "Status",
		// 	visible_in_table: true,
		// 	render: (item: PendingRequest) => {
		// 		const { label, color } = statusLabel(item.status);
		// 		return (
		// 			<Text color={color} fontWeight="medium">
		// 				{label}
		// 			</Text>
		// 		);
		// 	},
		// },
		{
			name: "result",
			label: "Status",
			visible_in_table: true,
			render: (item: PendingRequest) => {
				if (item.actionMessage) {
					return (
						<VStack align="flex-start" spacing={1}>
							<Text fontWeight="medium" color="primary.DEFAULT">
								{item.actionMessage}
							</Text>
							<Text fontSize="xs" color="gray.500">
								Requested data:{" "}
								{parseData(item.data)?.accountNumber || "—"} /{" "}
								{parseData(item.data)?.ifsc || "—"}
							</Text>
						</VStack>
					);
				}
				return <Text color="gray.500">Awaiting approval</Text>;
			},
		},
		{
			name: "actions",
			label: "Actions",
			visible_in_table: true,
			render: (item: PendingRequest) => {
				const rowId = item.requestId ?? item.transactionId;
				const isApproving =
					actioningRequest?.requestId === rowId &&
					actioningRequest.action === "approve";
				const isRejecting =
					actioningRequest?.requestId === rowId &&
					actioningRequest.action === "reject";

				return (
					<VStack align="stretch" spacing={2}>
						<Button
							size="sm"
							bg="success"
							color="white"
							_hover={{
								bg: "success",
								filter: "brightness(0.92)",
							}}
							_active={{
								bg: "success",
								filter: "brightness(0.85)",
							}}
							isLoading={isApproving}
							isDisabled={isRejecting}
							onClick={async () => {
								setActioningRequest({
									requestId: rowId,
									action: "approve",
								});
								try {
									await handleRequestAction(rowId, "2", 3);
								} finally {
									setActioningRequest(null);
								}
							}}
						>
							Approve
						</Button>
						<Button
							size="sm"
							bg="error"
							color="white"
							_hover={{ bg: "error", filter: "brightness(0.92)" }}
							_active={{
								bg: "error",
								filter: "brightness(0.85)",
							}}
							isLoading={isRejecting}
							isDisabled={isApproving}
							onClick={() => {
								setRejectReason("");
								setRejectDialog({
									isOpen: true,
									requestId: rowId,
									intentId: "5",
								});
							}}
						>
							Reject
						</Button>
					</VStack>
				);
			},
		},
	];

	return (
		<PaddingBox>
			<PageTitle title="Pending Bank Requests" />

			{!shouldFetch ? (
				<Flex justify="center" align="center" minH="320px">
					<Text color="gray.500">
						Provide a valid user_code query parameter or log in as
						an agent to view requests.
					</Text>
				</Flex>
			) : isLoading ? (
				<Flex justify="center" align="center" minH="400px">
					<Spinner
						size="xl"
						color="primary.DEFAULT"
						thickness="4px"
					/>
				</Flex>
			) : error ? (
				<Flex justify="center" align="center" minH="400px">
					<Text color="red.500">{error}</Text>
				</Flex>
			) : noRequests ? (
				<Flex justify="center" align="center" minH="400px">
					<Text color="gray.500">
						No pending bank requests found.
					</Text>
				</Flex>
			) : (
				<Box overflowX="auto">
					<Table
						{...{
							isLoading,
							onRowClick: undefined,
							pageNumber: 1,
							totalRecords: requests.length,
							setPageNumber: () => {},
							data: requests,
							variant: "stripedActionNone",
							renderer: columns,
							tableName: "pending-bank-requests",
							visibleColumns: columns.length,
							ResponsiveCard: undefined,
							isReceipt: false,
							printExpansion: false,
							tableRowLimit: 9999,
							rest: {},
						}}
					/>
				</Box>
			)}

			{/* Reject Reason Dialog */}
			<Modal
				isOpen={rejectDialog.isOpen}
				onClose={() =>
					setRejectDialog({
						isOpen: false,
						requestId: "",
						intentId: "",
					})
				}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Reason for Rejection</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormLabel>Please provide a reason</FormLabel>
						<Textarea
							value={rejectReason}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
								setRejectReason(e.target.value)
							}
							placeholder="Enter rejection reason..."
							rows={4}
						/>
					</ModalBody>
					<ModalFooter gap={3}>
						<Button
							variant="ghost"
							onClick={() =>
								setRejectDialog({
									isOpen: false,
									requestId: "",
									intentId: "",
								})
							}
						>
							Cancel
						</Button>
						<Button
							bg="error"
							color="white"
							_hover={{ bg: "error", filter: "brightness(0.92)" }}
							_active={{
								bg: "error",
								filter: "brightness(0.85)",
							}}
							isLoading={isActioning}
							isDisabled={!rejectReason.trim()}
							onClick={async () => {
								setActioningRequest({
									requestId: rejectDialog.requestId,
									action: "reject",
								});
								try {
									await handleRequestAction(
										rejectDialog.requestId,
										rejectDialog.intentId,
										3,
										rejectReason
									);
								} finally {
									setActioningRequest(null);
								}
								setRejectDialog({
									isOpen: false,
									requestId: "",
									intentId: "",
								});
								setRejectReason("");
							}}
						>
							Confirm Reject
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</PaddingBox>
	);
};

export default PendingBankRequests;
