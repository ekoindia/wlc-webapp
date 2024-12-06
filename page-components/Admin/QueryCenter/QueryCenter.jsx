import {
	Box,
	Flex,
	Text,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerFooter,
	useToast,
} from "@chakra-ui/react";
import { Headings, Button, ChatInput } from "components";
import { Value } from "tf-components";
import { TransactionTypes, ParamType } from "constants";
import { Endpoints } from "constants/EndPoints";
import { useApiFetch } from "hooks";
import { useEffect, useState } from "react";
// import { FaRegUser } from "react-icons/fa6";
import { FcBusinessman } from "react-icons/fc";
import { IoTicketOutline } from "react-icons/io5";
import { MdSupportAgent } from "react-icons/md";
import { QueryCenterTable } from ".";

/**
 * A <QueryCenter> page component to show a list of queries/tickets raised by the admin or its network.
 */
const QueryCenter = () => {
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [selectedTicketIndex, setSelectedTicketIndex] = useState(-1);
	const [commentsCache, setCommentsCache] = useState({});

	/**
	 * MARK: Fetch Issues
	 */
	const [fetchTickets, loading] = useApiFetch(Endpoints.TRANSACTION, {
		body: {
			interaction_type_id: TransactionTypes.GET_ALL_QUERIES_FOR_ORG,
		},
		onSuccess: (res) => {
			const _data = res?.data?.csp_list ?? [];
			if (_data?.length > 0) {
				// Process and save the list of issues
				setData(processIssues(_data));
				console.log("[QueryCenter] Data loaded:", _data, res);
			} else {
				console.error("[QueryCenter] Query list not found", res);
			}
		},
	});

	const [fetchComments, loadingComments] = useApiFetch(
		Endpoints.TRANSACTION,
		{
			body: {
				interaction_type_id: TransactionTypes.GET_QUERY_COMMENTS,
				// feedback_ticket_id
			},
		}
	);

	/**
	 * Function to fetch the list of comments for a ticket-id from the API.
	 * MARK: Fetch Comments
	 * @param {string} ticket_id The ticket-id for which the comments are to be fetched
	 * @param {boolean} [forceRefresh] Flag to force refresh the comments
	 */
	const initFetchComments = (ticket_id, forceRefresh = false) => {
		if (!ticket_id) {
			return;
		}

		// Check if comments are already loaded in the cache
		if (commentsCache[ticket_id] && !forceRefresh) {
			console.log(
				"[QueryCenter] Comments already loaded:",
				commentsCache[ticket_id]
			);
			return;
		}

		fetchComments({
			body: { feedback_ticket_id: ticket_id },
		})
			.then((res) => {
				const _comments = res?.data?.comment_list ?? [];
				if (_comments?.length > 0) {
					// Process and save the list of comments
					setCommentsCache({
						...commentsCache,
						[ticket_id]: processComments(_comments),
					});
					console.log(
						"[QueryCenter] Comments loaded:",
						processComments(_comments)
					);
				} else {
					console.error("[QueryCenter] Comments not found", res);
				}
			})
			.catch((error) => {
				console.error("[QueryCenter] Get Query Comments Error:", error);
			});
	};

	/**
	 * Fetch issues from the API on component load
	 */
	useEffect(() => {
		// if (loading) return;
		console.log("[QueryCenter] Fetch Tickets start...");
		fetchTickets();
	}, []);

	/**
	 * Fetch comments whenever a ticket is selected
	 */
	useEffect(() => {
		if (selectedTicketIndex < 0) return;
		if (!data) return;

		const ticket = data[selectedTicketIndex];
		if (!ticket) return;

		initFetchComments(ticket.id);
	}, [selectedTicketIndex, data]);

	// MARK: Main Render
	return (
		<>
			<Headings title="Query Center" hasIcon={false} />

			<Box mx={{ base: "4", md: "0" }}>
				{data?.length > 0 ? (
					<>
						<QueryCenterTable
							pageNumber={pageNumber}
							setPageNumber={setPageNumber}
							data={data}
							onSelect={(_data, index) =>
								setSelectedTicketIndex(index)
							}
						/>

						{/* Query Details */}
						{selectedTicketIndex >= 0 ? (
							<QueryDetails
								ticket={data[selectedTicketIndex]}
								comments={
									commentsCache[data[selectedTicketIndex]?.id]
								}
								loadingComments={loadingComments}
								fetchTickets={fetchTickets}
								fetchComments={initFetchComments}
								onClose={() => setSelectedTicketIndex(-1)}
							/>
						) : null}
					</>
				) : (
					<Text textAlign="center" fontSize="sm">
						{loading ? "Loading Tickets..." : "Nothing Found"}
					</Text>
				)}
			</Box>
		</>
	);
};

/**
 * QueryDetails component to show the details of a selected query/ticket in a drawer.
 * MARK: Detail Drawer
 * @param {object} props Properties passed to the component
 * @param {object} props.ticket The selected ticket object
 * @param {object[]} props.comments List of comments for the selected ticket
 * @param {boolean} props.loadingComments Flag to show loading comments
 * @param {Function} props.fetchTickets Function to fetch tickets
 * @param {Function} props.fetchComments Function to fetch comments for the selected ticket
 * @param {Function} props.onClose Function to close the drawer
 */
const QueryDetails = ({
	ticket,
	comments,
	loadingComments,
	fetchTickets,
	fetchComments,
	onClose,
}) => {
	const toast = useToast();
	const toastSuccess = (msg) =>
		toast({
			title: msg,
			status: "success",
			duration: 3000,
			isClosable: true,
		});

	const toastError = (msg) =>
		toast({
			title: msg + ". Please try again.",
			status: "error",
			duration: 5000,
			isClosable: true,
		});

	/**
	 * MARK: Add Comment API
	 */
	const [addCommentAPI, addingComment] = useApiFetch(Endpoints.TRANSACTION, {
		body: {
			interaction_type_id: TransactionTypes.ADD_QUERY_COMMENT,
			feedback_ticket_id: ticket.id,
		},
		onSuccess: (data) => {
			if (data.response_status_id == 0) {
				fetchComments(ticket.id, true);
				toastSuccess("Comment Added");
			} else {
				toastError("Error adding comment");
			}
		},
		onError: () => toastError("Error adding comment"),
	});

	const addComment = (comment) => {
		if (addingComment) return;
		addCommentAPI({ body: { comment } });
	};

	/**
	 * MARK: Close Ticket
	 */
	const [close, closing] = useApiFetch(Endpoints.TRANSACTION, {
		body: {
			interaction_type_id: TransactionTypes.CLOSE_QUERY,
			feedback_ticket_id: ticket.id,
		},
		onSuccess: (data) => {
			if (data.response_status_id == 0) {
				fetchTickets();
				toastSuccess("Ticket Closed");
			} else {
				toastError("Error closing ticket");
			}
		},
		onError: () => toastError("Error closing ticket"),
	});

	/**
	 * MARK: Escalate Ticket
	 */
	const [escalate, escalating] = useApiFetch(Endpoints.TRANSACTION, {
		body: {
			interaction_type_id: TransactionTypes.ESCALATE_QUERY,
			feedback_ticket_id: ticket.id,
		},
		onSuccess: (data) => {
			if (data.response_status_id == 0) {
				toastSuccess("Ticket Escalated");
			} else {
				toastError("Error escalating ticket");
			}
		},
		onError: () => toastError("Error escalating ticket"),
	});

	/**
	 * MARK: Reopen Ticket
	 */
	// const [reopen, reopening] = useApiFetch(Endpoints.TRANSACTION, {
	// 	body: {
	// 		interaction_type_id: TransactionTypes.REOPEN_QUERY,
	// 		feedback_ticket_id: ticket.id,
	// 	},
	// 	onSuccess: (data) => {
	// 		if (data.response_status_id == 0) {
	// 			fetchTickets();
	// 			toastSuccess("Ticket Reopened");
	// 		} else {
	// 			toastError("Error reopening ticket");
	// 		}
	// 	},
	// 	onError: () => toastError("Error reopening ticket"),
	// });

	if (!ticket) return null;

	return (
		<>
			<Drawer isOpen={true} placement="right" size="md" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent bg="bg">
					<DrawerCloseButton />

					<DrawerHeader bg="white" borderBottom="1px solid #EEE">
						Query Details
					</DrawerHeader>

					<DrawerBody p={0} color="light">
						<Flex
							direction="column"
							p={{ base: 2, md: 6 }}
							mb="1.5em"
							bg="white"
							gap={2}
						>
							<Flex fontSize="0.8em" gap="0.4em" align="center">
								<IoTicketOutline size="16px" />
								{ticket.ticketNumber}
							</Flex>
							<Text fontWeight={700}>{ticket.label}</Text>

							{/* Rest properties of the ticket... */}
							{/* modifiedTime, createdTime,  */}
							<Flex
								direction="row"
								w="100%"
								flexWrap="wrap"
								mt={6}
								gap={{ base: 3, md: 6 }}
							>
								<Val label="Status" value={ticket.status} />
								{/* <Val label="Priority" value={ticket.priority} /> */}
								<Val
									label="UserCode"
									value={ticket["CSP Code"]}
								/>
								<Val
									label="Created At"
									value={ticket.createdTime}
									typeId={ParamType.DATETIME}
									metadata="dd MMM yyyy"
								/>
								<Val
									label="Last Modified"
									value={ticket.modifiedTime}
									typeId={ParamType.DATETIME}
									metadata="dd MMM yyyy"
								/>
							</Flex>

							{/* Action buttons */}
							<Flex
								direction="row"
								// justify="flex-end"
								gap={{ base: 3, md: 6 }}
								mt={6}
								flexWrap="wrap"
							>
								{ticket.statusType === "Open" ? (
									<Button onClick={close} loading={closing}>
										Close
									</Button>
								) : null}

								{ticket.statusType === "Open" &&
								ticket.status !== "Escalated" ? (
									<Button
										variant="outline"
										onClick={escalate}
										loading={escalating}
									>
										Escalate
									</Button>
								) : null}

								{/* {ticket.statusType === "Closed" ? (
									<Button
										variant="outline"
										onClick={reopen}
										loading={reopening}
									>
										Reopen
									</Button>
								) : null} */}
							</Flex>
						</Flex>

						{loadingComments ? (
							<Text textAlign="center" fontSize="sm">
								Loading Comments...
							</Text>
						) : !comments?.length > 0 ? (
							<Text textAlign="center" fontSize="sm">
								No Comments Found
							</Text>
						) : null}

						<Flex
							direction="column"
							gap={{ base: 5, md: 8 }}
							p={{ base: 2, md: 6 }}
						>
							{/*
								MARK: Comments
							*/}
							{comments?.map((comment) => {
								const my = comment.by == "You";
								const Icon = comment.Icon;

								if (!comment.comment) return null;

								return (
									<Flex
										key={comment.timestamp}
										direction="column"
										position="relative"
										p={{ base: 3, md: 4 }}
										borderRadius="20px"
										borderTopLeftRadius={
											my ? undefined : "0"
										}
										borderBottomRightRadius={
											my ? "0" : undefined
										}
										bg={my ? "white" : "bisque"}
										shadow={my ? "sm" : "md"}
										textAlign={my ? "right" : "left"}
										alignSelf={
											my ? "flex-end" : "flex-start"
										}
										align={my ? "flex-end" : "flex-start"}
										w="fit-content"
										maxW={{ base: "90%", md: "80%" }}
										minW="60%"
										gap={2}
									>
										{comment.by && comment.by !== "You" ? (
											<Flex
												direction="row"
												align="center"
												gap="0.5em"
											>
												{Icon ? <Icon /> : null}
												<Text
													fontSize="sm"
													fontWeight={700}
												>
													{comment.by}:
												</Text>
											</Flex>
										) : null}
										<Box>
											{comment.comment
												.split(/\n/)
												.map((line, i) => (
													<p key={i}>{line}</p>
												))}
										</Box>
										<Text
											fontSize="xxs"
											color="gray.500"
											mt={2}
										>
											{
												<Value
													value={comment.timestamp}
													typeId={ParamType.DATETIME}
													metadata="dd MMM yyyy, hh:mm a"
												/>
											}
										</Text>
									</Flex>
								);
							})}
						</Flex>
					</DrawerBody>

					{/*
						MARK: Add Comment
					*/}
					<DrawerFooter bg="white" borderTop="1px solid #EEE">
						<ChatInput
							placeholder="Add a comment"
							fontSize="sm"
							color="light"
							maxLength={500}
							loading={addingComment}
							onEnter={(comment) => addComment(comment)}
						/>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
};

/**
 * Helper Component to show a value with a label
 * @param root0
 * @param root0.label
 * @param root0.value
 */
const Val = ({ label, value, ...rest }) => (
	<Value label={label} value={value} fontSize="sm" {...rest} />
);

/**
 * Function to process the list of issues and add generated fields like "label"
 * MARK: Process Issues
 * Sample issue object:
 * {
		"modifiedTime": "2024-12-04T06:24:39.000Z",
		"ticketNumber": "220884",
		"subCategory": "Eloka Role Configuration",
		"status": "Closed"
		"statusType": "Closed",
		"subject": "[IGNORE] Enable/Disable services for my organisation network",
		"dueDate": "2024-12-05T07:44:29.000Z",
		"departmentId": "40373000000278063",
		"channel": "Phone",
		"language": "English",
		"resolution": null,
		"isOverDue": false,
		"CSP Name": "omkar.singh@eko.co.in",
		"assigneeName": "Awnish .",
		"contactName": "CHAUHAN",
		"createdTime": "2024-12-02T07:44:28.000Z",
		"id": "40373000083057899",
		"Eko Code": null,
		"customerResponseTime": "2024-12-02T07:44:28.000Z",
		"productId": null,
		"contactId": "40373000011359932",
		"threadCount": "1",
		"priority": "Medium",
		"classification": "Request",
		"orgID": "3",
		"commentCount": "2",
		"accountId": null,
		"phone": "9971771929",
		"webUrl": "https://help.eko.in/support/eko/ShowHomePage.do#Cases/dv/40373000083057899",
		"CSP Code": "99027178",
	}
 * @param {Array} issues List of issues
 */
const processIssues = (issues) => {
	return issues.map((issue) => {
		issue.label =
			(issue.subCategory && issue.subCategory !== "Others"
				? issue.subCategory + " > "
				: "") + issue.subject;
		return issue;
	});
};

/**
 * Process comments for a ticket.
 * MARK: Process Comments
 * Sample comment object:
 * {
 *		"date_updated": "2024-12-02T13:14:29.000",
 *		"comment": "**Me:**  Comments:UAT TESTING!! Please ignore this ticket",
 *		"timestamp": "2024-12-02T13:14:29.000"
 *	}
 * @param comments
 */
const processComments = (comments) => {
	const regCommenter = /^\*\*(Me|Eko|Agent|Admin):\*\*/i;
	const regCommenter2 = /^\[([^\[\]\:]+)\]:/;

	return comments.map((comment) => {
		// Extract the "**Me:**", "**Eko:**", etc into a separate field
		const match = comment.comment.match(regCommenter);
		const commentBy = match ? match[1] : null;

		if (commentBy) {
			switch (commentBy.toLowerCase()) {
				case "me":
					comment.by = "You";
					break;
				case "eko":
				case "agent":
					comment.by = "Support";
					comment.Icon = MdSupportAgent;
					break;
				// case "agent":
				// 	comment.by = "Agent";
				// 	comment.Icon = FaRegUser;
				// 	break;
				case "admin":
					comment.by = "Admin";
					comment.Icon = FcBusinessman;
					break;
			}

			// Remove the ""**Me:**" part from the comment
			comment.comment = comment.comment.replace(regCommenter, "").trim();
		} else {
			// Match old style comments like "[CONNECTUSER]:"
			const match2 = comment.comment.match(regCommenter2);
			const commentBy2 = match2 ? match2[1] : null;
			if (commentBy2 === "CONNECTUSER") {
				comment.by = "You";
			}
			// Remove the "[CONNECTUSER]:" part from the comment
			comment.comment = comment.comment.replace(regCommenter2, "").trim();
		}

		// Remove the "Comment:" part from the start of the comment
		comment.comment = comment.comment.replace(/^Comments?:/i, "").trim();

		return comment;
	});
};

export default QueryCenter;
