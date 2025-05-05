import {
	Box,
	Button,
	Flex,
	Input,
	Spinner,
	Text,
	Textarea,
	useToast,
} from "@chakra-ui/react";
import { Dropzone, IcoButton, Icon, InputLabel } from "components";
import { TransactionTypes } from "constants/EpsTransactions";
import { useUser } from "contexts";
import { createSupportTicket, fetcher } from "helpers";
import {
	useDebouncedState,
	useFeatureFlag,
	useFileView,
	useImageEditor,
} from "hooks";
import useRefreshToken from "hooks/useRefreshToken";
import { initializeTextClassifier } from "libs";
import { useEffect, useRef, useState } from "react";
import { RiCheckboxCircleFill, RiScreenshot2Line } from "react-icons/ri";
import Markdown from "react-markdown";

// MARK: Constants

/**
 * Type of solution to be provided for the feedback
 */
// const SOLUTION_TYPE = {
// 	TICKET: 0, // DEFAULT: Take feedback and create a support Ticket
// 	LINK: 1, // Jump to a transaction or a page inside the app
// };

/**
 * Type-IDs for generic issue types
 */
const GENERIC_ISSUE_TYPE = {
	DEFAULT: "-1", // Default generic issues
	ONBOARDING: "-2", // Onboarding generic issues
};

/**
 * Comment Type
 */
const COMMENT_TYPE = {
	DISABLED: -1,
	OPTIONAL: 0,
	MANDATORY: 1,
};

/**
 * Screenshot capture type
 */
const SCREENSHOT_TYPE = {
	DISABLED: -1,
	OPTIONAL: 0,
	MANDATORY: 1,
};

// Declare the props interface
interface RaiseIssueProps {
	heading?: string;
	showCloseIcon?: boolean;
	tid?: string;
	tx_typeid?: string;
	status?: -2 | -1 | 0 | 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9;
	transactionTime?: string;
	metadata?: any;
	context?: any;
	logo?: string;
	customIssueType?: string;
	customIssueDetails?: {
		desc?: string;
		category?: string;
		sub_category?: string;
		tat?: number;
		screenshot?: -1 | 0 | 1;
		inputs?: any; // Array of { label: string, is_required: boolean, type: number }
		files?: any; // Array of { label: string, is_required: boolean, accept: string }
		context?: string;
	};
	origin: "Response" | "History" | "Global-Help" | "Command-Bar" | "Other";
	autoCaptureScreenshot?: boolean;
	onResult?: Function;
	onClose?: Function;
	onOpenUrl?: Function;
	onRequestCamCapture?: Function;
	onHide?: Function;
	onShow?: Function;
	[key: string]: any;
}

/**
 * A component to for users to raise an issue or provide a feedback
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {string} [prop.heading] - Heading for the feedback panel
 * @param {boolean} [prop.showCloseIcon] - Whether to show a close icon on the feedback panel
 * @param {string} prop.tid - Unique ID of the transaction for which issue is being raised
 * @param {string} prop.tx_typeid - Transaction type ID. It is used to fetch the issue types for a certain transaction type. If not provided here, it will be fetched from `metadata.` (if available)
 * @param {number} prop.status - Transaction status (eg: -2, -1, 0, 1, 2, 3, 4, 6, 7, 8, 9)
 * @param {string} prop.transactionTime - Transaction time
 * @param {object} prop.metadata - Additional metadata for the transaction, like, transaction_detail, pre_msg_template, post_msg_template, parameters_formatted, etc.
 * @param {{ row_index: number }} prop.context - Contains an object of format `{ row_index: X }`, where X is the index of the row in the transaction list. It is useful for tracking the row index of the transactions shown in a list, for which the issue is being raised. This is not the same as `issue_type.context` which is used to pass additional context to the support team.
 * @param {string} prop.logo - Logo to show in the feedback panel (eg: for BBPS)
 * @param {string} prop.customIssueType - Custom issue type to capture, instead of pulling issue types for a certain transaction type. This is useful for creating custom "Raise Issue" buttons in the UI.
 * @param {object} prop.customIssueDetails - Other configurations for the Custom issue. This is useful for creating custom "Raise Issue" buttons in the UI.
 * @param {boolean} prop.autoCaptureScreenshot - Whether to capture a screenshot of the current page
 * @param {string} prop.origin - Origin of the feedback panel (eg: "transaction-list")
 * @param {Function} prop.onResult - Function to return the result of the feedback
 * @param {Function} prop.onClose - Function to close the feedback
 * @param {Function} prop.onOpenUrl - Function to open a URL
 * @param {Function} prop.onRequestCamCapture - Function to request camera capture
 * @param {Function} prop.onHide - Function to temporarily hide the feedback panel
 * @param {Function} prop.onShow - Function to show the temporarily hidden feedback panel
 * @param {...*} rest - Rest of the props
 */
const RaiseIssueCard = ({
	heading = "",
	showCloseIcon = false,
	status,
	metadata,
	tid,
	tx_typeid,
	logo,
	transactionTime,
	// description,
	context,
	customIssueType,
	customIssueDetails,
	autoCaptureScreenshot = false,
	origin,
	onResult,
	onClose,
	onOpenUrl,
	onRequestCamCapture,
	onHide,
	onShow,
	...rest
}: RaiseIssueProps) => {
	const toast = useToast();

	// User/Session data...
	const { accessToken, userData, isLoggedIn, isAdmin, isAdminAgentMode } =
		useUser();
	const { generateNewToken } = useRefreshToken();
	const onboarding = userData?.user_details?.onboarding || 0; // Is the user onboarding?

	// Issue list...
	const [statusIssueListMap, setStatusIssueListMap] = useState([]); // List of possible issues to raise
	const [categoryList, setCategoryList] = useState([]); // List of categories
	const [categoryMap, setCategoryMap] = useState({}); // Nested map of categories to sub-categories
	const [issueInputList, setIssueInputList] = useState<IssueInputType[]>([]); // List of input fields for the selected issue
	const [issueFileList, setIssueFileList] = useState<IssueFileType[]>([]); // List of file-upload fields for the selected issue
	const [comment, setComment] = useState(""); // Comment entered by the user

	// Selected category, sub-category, and issue...
	const [selectedCat, setSelectedCat] = useState<number | null>(null); // Selected category
	const [selectedSubCat, setSelectedSubCat] = useState<number | null>(null); // Selected sub-category
	const [selectedIssue, setSelectedIssue] = useState<IssueType | null>(null); // Selected issue-type
	const [feedbackSubmitResponse, setFeedbackSubmitResponse] = useState(null); // Feedback submit response

	// Screenshot
	const [screenshot, setScreenshot] = useState<string | null>(null);

	// Status flags...
	const [fetchingIssueList, setFetchingIssueList] = useState(false); // Is the issue list being fetched?
	const [issueListError, setIssueListError] = useState(false); // Is there an error fetching the issue list?
	const [submittingFeedback, setSubmittingFeedback] = useState(false); // Is the feedback being submitted?
	const [feedbackDone, setFeedbackDone] = useState(false); // Is the feedback submitted?
	const [isFormSubmitError, setIsFormSubmitError] = useState(false); // Is there an error during feedback submit?
	const [disableInputs, setDisableInputs] = useState(false); // Should the inputs be disabled?
	const [disableSubmit, setDisableSubmit] = useState(false); // Should the submit button be disabled?
	const [isRaiseAfterTimeElapsed, setIsRaisedAfterTimeElapsed] =
		useState(true); // Has the "raise_issue_after" time elapsed for the current transaction?
	const [isUserFeedbackRequired, setIsUserFeedbackRequired] =
		useState<boolean>(true); // Do we need to submit user feedback (or, just link to another page)?

	// Check if the feature is enabled...
	const [isFeatureEnabled] = useFeatureFlag("RAISE_ISSUE");
	const [isRaiseIssueAllowedForSbiKiosk] = useFeatureFlag(
		"RAISE_ISSUE_SBIKIOSK"
	);

	// Experimental text-classifier for user comments...
	// @see https://ai.google.dev/edge/mediapipe/solutions/text/text_classifier
	const [isTextClassifierEnabled] = useFeatureFlag("TEXT_CLASSIFIER");
	const [textClassifier, setTextClassifier] = useState<any>(null);
	const [classifierResult, setClassifierResult] = useState("");

	// Init Text Classifier...
	useEffect(() => {
		if (!isTextClassifierEnabled) return;
		// Initialize the text-classifier...
		initializeTextClassifier().then((_textClassifier) => {
			console.log(
				"[RaiseIssue] Text Classifier initialized...",
				_textClassifier
			);
			setTextClassifier(_textClassifier);
		});
	}, [isTextClassifierEnabled]);

	// Debounce user comments for classification...
	const [debouncedComment, setDebouncedComment] = useDebouncedState(
		null,
		500
	);
	useEffect(() => {
		setDebouncedComment(comment);
	}, [comment]);

	// Classify user comments...
	useEffect(() => {
		if (!textClassifier || !debouncedComment) return;
		if (debouncedComment.length <= 10) return;

		// Example Classification:
		// {
		// 	"classifications": [
		// 		{
		// 		"categories": [
		// 			{
		// 			"index": 0,
		// 			"score": 0.9956762194633484,
		// 			"categoryName": "negative",
		// 			"displayName": ""
		// 			},
		// 			{
		// 			"index": 1,
		// 			"score": 0.0043237595818936825,
		// 			"categoryName": "positive",
		// 			"displayName": ""
		// 			}
		// 		],
		// 		"headIndex": 0,
		// 		"headName": "probability"
		// 		}
		// 	],
		// 	"timestampMs": 1
		// }

		const result = textClassifier.classify(debouncedComment);

		if (!(result?.classifications?.length > 0)) return;

		const categories = result.classifications[0].categories;

		const catNames = {
			negative: "👎",
			positive: "👍",
		};

		// Set the classifier result...
		setClassifierResult(
			categories
				.map(
					(cat) =>
						`${
							catNames[cat.categoryName] || cat.categoryName
						} ${Math.round(cat.score * 100)}%`
				)
				.join(", ")
		);

		console.log(
			"[RaiseIssue] Classifying comment...",
			debouncedComment,
			categories
		);
	}, [textClassifier, debouncedComment]);

	/**
	 * Effect: Fetch the issue types, if the user is logged in and the transaction details change ...
	 * MARK: Get List
	 */
	useEffect(() => {
		if (!(isLoggedIn && userData)) return;

		// Custom Query? Set it as the select query. No need to fetch issue types...
		if (customIssueType) {
			console.log("Custom issue type found: ", customIssueType);

			const customIssue = {
				label: customIssueType,
				value: customIssueType,
				desc: customIssueDetails?.desc || "",
				raise_issue_after: "0d",
				reopened_tat: "0",
				tat: "" + (customIssueDetails?.tat || 0),
				screenshot: customIssueDetails?.screenshot ?? -1,
				category: {
					id: 1,
					title: customIssueDetails?.category || "Others",
				},
				sub_category: {
					id: 1,
					title: customIssueDetails?.sub_category || "Others",
				},
				inputs: customIssueDetails?.inputs || undefined,
				files: customIssueDetails?.files || undefined,
				context: customIssueDetails?.context || "",
			};

			setCategoryList([{ id: 1, title: "Others" }]);
			setCategoryMap({
				1: {
					subcat_list: [{ id: 1, title: "Others" }],
					submap: {
						1: { id: 1, title: "Others" },
					},
				},
			});
			setStatusIssueListMap([customIssue]);
			setSelectedCat(1);
			setSelectedSubCat(1);
			setSelectedIssue(customIssue);
			return;
		}

		if (fetchingIssueList) return;

		setFetchingIssueList(true);

		const _tx_typeid: string =
			tx_typeid ||
			metadata?.transaction_detail?.tx_typeid ||
			(onboarding == 1
				? GENERIC_ISSUE_TYPE.ONBOARDING
				: GENERIC_ISSUE_TYPE.DEFAULT);

		const { operator, partner_id, channel } =
			metadata?.transaction_detail || {};

		const controller = new AbortController();

		// Fetch the issue types
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
			{
				method: "POST",
				body: {
					interaction_type_id: TransactionTypes.GET_QUERY_TYPES,
					tid: tid || "",
					tx_typeid: _tx_typeid || "",
					feedback_origin: origin,
					status: status ?? "",
					operator: operator || "",
					partner_id: partner_id || "",
					channel: channel || "",
					is_admin: isAdmin && !isAdminAgentMode ? 1 : 0,
				},
				controller: controller,
				token: accessToken,
			},
			generateNewToken
		)
			.then((data) => {
				const processed_data = _processIssueList(
					data?.data?.issuetype_list
				);
				console.log(
					"[RaiseIssue] issue-type fetch result...",
					processed_data,
					data.data.issuetype_list
					// data.data.trxn_detail_from_sb,
				);

				// Set the processed data...
				setCategoryList(processed_data.category_list);
				setCategoryMap(processed_data.category_map);
				setStatusIssueListMap(processed_data.processed_issue_list);

				setIssueListError(false);

				// const _data = data?.data?.dashboard_details[0] || [];
				// setIsLoading(false);
			})
			.catch((err) => {
				console.error(`[RaiseIssue] issue-type fetch error: `, err);
				setIssueListError(true);
				// toast({
				// 	title: "Error fetching issue types. Please try again later.",
				// 	status: "error",
				// 	duration: 2000,
				// });
			})
			.finally(() => {
				setFetchingIssueList(false);
			});

		return () => {
			console.log("[RaiseIssue] issue-type fetch aborted...", controller);
			controller.abort();
		};
	}, [
		accessToken,
		isLoggedIn,
		onboarding,
		tid,
		status,
		origin,
		customIssueType,
		metadata?.transaction_detail,
	]);

	/**
	 * Effect: auto select default category, if it is the only available category, whenever the category-list updates
	 */
	useEffect(() => {
		// Auto-select category...
		if (categoryList?.length === 1) {
			setSelectedCat(categoryList[0]?.id || null);
			// this._scrollToSelector("subcat"); // Scroll to the sub-category list
		}
	}, [categoryList]);

	/**
	 * Effect: auto select default sub-categories, whenever the category changes
	 */
	useEffect(() => {
		// Auto-select sub-category...
		if (
			selectedCat &&
			categoryMap &&
			selectedCat in categoryMap &&
			categoryMap[selectedCat].subcat_list.length === 1
		) {
			setSelectedSubCat(categoryMap[selectedCat].subcat_list[0].id);
			// this._scrollToSelector("issue"); // Scroll to the issue list
		}
	}, [selectedCat, categoryMap]);

	/**
	 * Effect: process the following, whenever the selectedIssue changes:
	 * - Generate issueInputList
	 * - Generate issueFileList
	 * - Calculate solution type
	 * - Calculate isRaisedAfterTimeElapsed
	 */
	useEffect(() => {
		if (!selectedIssue) return;

		// Generate issueInputList...
		if (selectedIssue?.inputs?.length > 0) {
			// Deep copy the inputs array...
			setIssueInputList(
				selectedIssue.inputs.map((inp) => ({ value: "", ...inp }))
			);
		} else {
			setIssueInputList([]);
		}

		// Generate issueFileList...
		if (selectedIssue?.files?.length > 0) {
			// Deep copy the files array...
			setIssueFileList(selectedIssue.files);
		} else {
			setIssueFileList([]);
		}

		// Calculate solution type... If the issue type is 0 or not provided, then we assume that the user feedback is required

		setIsUserFeedbackRequired(!selectedIssue?.type);

		// Calculate isRaisedAfterTimeElapsed. If true, it indicates that the current transaction was done before the "raise_issue_after" time which is represented as a duration string like "0d", "1d", "2h", "5m", etc.
		if (transactionTime && selectedIssue?.raise_issue_after) {
			const duration = parseInt(selectedIssue.raise_issue_after);
			if (duration > 0) {
				const durationUnit = selectedIssue.raise_issue_after.charAt(
					selectedIssue.raise_issue_after.length - 1
				);
				const durationMultiplier =
					(durationUnit === "d"
						? 24 * 60
						: durationUnit === "h"
							? 60
							: 1) * 60000;
				var requiredDate =
					new Date(transactionTime).getTime() +
					duration * durationMultiplier;
				setIsRaisedAfterTimeElapsed(Date.now() >= requiredDate);
			} else {
				setIsRaisedAfterTimeElapsed(true);
			}
		} else {
			setIsRaisedAfterTimeElapsed(true);
		}
	}, [selectedIssue, transactionTime]);

	/**
	 * Effect: calculate the disabled state for inputs & submit button, whenever the form submit state changes
	 */
	useEffect(() => {
		const _disabledInpState =
			submittingFeedback || feedbackDone ? true : false;
		const _disableSubmitState =
			submittingFeedback ||
			feedbackDone ||
			isRaiseAfterTimeElapsed !== true
				? true
				: false;
		setDisableInputs(_disabledInpState);
		setDisableSubmit(_disableSubmitState);
	}, [feedbackDone, submittingFeedback, isRaiseAfterTimeElapsed]);

	/**
	 * Submit the user feedback.
	 * MARK: Submit()
	 */
	const submitFeedback = () => {
		if (!(isLoggedIn && userData)) return;

		// Is the form-submit already in progress?
		if (submittingFeedback) {
			toast({
				title: "Already in progress. Please wait.",
				status: "warning",
				duration: 1000,
			});
			console.error(
				"[RaiseIssue] Feedback submit already in progress..."
			);
			return;
		}

		// Submit the feedback...
		setSubmittingFeedback(true);

		// Validate the form...
		if (!selectedIssue) {
			console.error("[RaiseIssue] No issue selected...");
			setSubmittingFeedback(false);
			return;
		}

		// Validate the inputs...
		if (issueInputList.some((input) => input.is_required && !input.value)) {
			toast({
				title: "Please fill all the required fields",
				status: "error",
				duration: 2000,
			});
			console.error("[RaiseIssue] Required input missing...");
			setSubmittingFeedback(false);
			return;
		}

		// Validate Comment field...
		if (selectedIssue.comment === 1 && !comment) {
			toast({
				title: "Please enter your comments",
				status: "error",
				duration: 2000,
			});
			console.error(
				"[RaiseIssue] Comments missing...",
				selectedIssue,
				comment
			);
			setSubmittingFeedback(false);
			return;
		}

		// Validate the files...
		if (issueFileList.some((file) => file.is_required && !file.value)) {
			toast({
				title: "Please upload the required file(s)",
				status: "error",
				duration: 2000,
			});
			console.error("[RaiseIssue] Required files missing...");
			setSubmittingFeedback(false);
			return;
		}

		const controller = new AbortController();

		const tx_typeid: string =
			metadata?.transaction_detail?.tx_typeid ||
			(onboarding == 1
				? GENERIC_ISSUE_TYPE.ONBOARDING
				: GENERIC_ISSUE_TYPE.DEFAULT);

		createSupportTicket({
			accessToken,
			summary: selectedIssue.label,
			category: selectedIssue.category.title,
			subCategory: selectedIssue.sub_category.title,
			comment,
			context: selectedIssue.context,
			inputs: issueInputList as {
				label: string;
				value: string | number;
			}[],
			files: issueFileList as { label: string; value: File }[],
			screenshot: screenshot || undefined,
			origin,
			tat: selectedIssue.tat,
			priority: selectedIssue.priority,
			tid,
			tx_typeid,
			transaction_metadata: metadata,
			controller,
			generateNewToken,
		})
			.then((data) => {
				console.log("[RaiseIssue] feedback submit result...", data);

				const isSuccess =
					data?.status === 0 && data?.data?.feedback_ticket_id
						? true
						: false;

				if (isSuccess) {
					setFeedbackSubmitResponse({
						message: data?.message || "Submitted successfully.",
						ticket_id: data?.data?.feedback_ticket_id || "",
					});
					setFeedbackDone(true);
					onResult &&
						onResult({
							success: isSuccess,
							feedback_ticket_id:
								data?.data?.feedback_ticket_id || "",
							message: data?.message || "",
							context: context, // eg: { row_index: X }
						});
				} else {
					setIsFormSubmitError(true);
					toast({
						title: data?.message || "Error creating ticket",
						status: "error",
						duration: 2000,
					});
				}
			})
			.catch((err) => {
				console.error("[RaiseIssue] feedback submit error: ", err);
				setIsFormSubmitError(true);
				toast({
					title: "Error creating ticket. Please try again later.",
					status: "error",
					duration: 2000,
				});
			})
			.finally(() => {
				setSubmittingFeedback(false);
			});

		return () => {
			console.log("[RaiseIssue] feedback submit aborted...", controller);
			controller.abort();
		};
	};

	// Is the feature enabled?
	if (!(isFeatureEnabled || isRaiseIssueAllowedForSbiKiosk)) {
		return (
			<Text fontSize="sm" color="gray.600">
				Feature is disabled. Please contact support.
			</Text>
		);
	}

	// Show load animation while fetching issue-list
	if (fetchingIssueList) {
		return (
			<Flex w="full" h="full" justifyContent="center" alignItems="center">
				<Spinner
					size="xl"
					thickness="4px"
					speed="0.65s"
					emptyColor="gray.200"
					color="accent.dark"
				/>
			</Flex>
		);
	}

	// Show error message if issue-list fetch failed
	if (issueListError) {
		return (
			<Text fontSize="sm" color="error">
				Error fetching issue types. Please check your internet
				connection and try again later.
			</Text>
		);
	}

	//

	// MARK: JSX - Main
	return (
		<>
			{/* Show the main feedback card */}
			<Card
				heading={heading}
				showCloseIcon={showCloseIcon}
				onClose={onClose}
				{...rest}
			>
				<CategoryList
					label={
						selectedCat === null ? "Select a Category" : "Category"
					}
					categoryList={categoryList}
					selectedId={selectedCat}
					disabled={disableInputs}
					onSelect={(cat) => {
						setSelectedIssue(null); // Clear issue-type selection
						setSelectedSubCat(null); // Clear sub-category selection
						setSelectedCat(cat === null ? null : cat?.id); // Set category selection
						// this._scrollToSelector("subcat");
					}}
				/>

				{/* Show sub-categories, only if a category is selected, and it has sub-categories */}
				{categoryMap && selectedCat && selectedCat in categoryMap ? (
					<CategoryList
						label={
							selectedSubCat === null
								? "Select a Sub-Category"
								: "Sub-Category"
						}
						categoryList={categoryMap[selectedCat]?.subcat_list}
						selectedId={selectedSubCat}
						disabled={disableInputs}
						onSelect={(cat) => {
							setSelectedIssue(null); // Clear issue-type selection
							setSelectedSubCat(cat === null ? null : cat.id); // Set sub-category selection
							// this._scrollToSelector("issue");
						}}
					/>
				) : null}

				{/* Show category logo, if available */}
				{logo ? (
					<Flex mb={8} h="40px" w="full" direction="row-reverse">
						<img
							src={logo}
							alt="Product By Logo"
							height="40px"
							style={{ maxWidth: "150px" }}
							loading="lazy"
						/>
					</Flex>
				) : null}

				{/* Show the issue list */}
				{statusIssueListMap &&
				selectedCat !== null &&
				selectedSubCat !== null &&
				feedbackDone !== true ? (
					// TODO: Show category logo, if available

					<CategoryList
						isPrimaryList
						label="Select your Query/Issue"
						categoryList={statusIssueListMap.filter(
							// Filter issues based on selected category & sub-category
							(issue) =>
								issue.category.id === selectedCat &&
								issue.sub_category.id === selectedSubCat
						)}
						selectedId={selectedIssue?.label || null}
						idKey="label"
						labelKey="label"
						disabled={disableInputs}
						onSelect={(issue) => {
							setSelectedIssue(issue);
							// console.log("SELECTED ISSUE::: ", issue);
						}}
					/>
				) : null}

				{/* Show the form for the selected issue */}
				{selectedIssue && selectedIssue.value ? (
					<>
						{/* Show the issue description */}
						{selectedIssue.desc &&
						selectedIssue.desc !== selectedIssue.value ? (
							<Box mb={8}>
								<InputLabel required>Note:</InputLabel>
								<Markdown className="markdown-body">
									{selectedIssue.desc.replace(
										/<br ?\/?>/gi,
										"\n"
									)}
								</Markdown>
							</Box>
						) : null}

						{/* Show TAT */}
						{selectedIssue.tat && selectedIssue.tat !== "0" ? (
							<Box mb={8}>
								<Text fontSize="sm" color="gray.600">
									<InputLabel required>
										Expected Resolution Time:
									</InputLabel>
									{` ${selectedIssue.tat} ${
										selectedIssue.tat == "1"
											? "day"
											: "days"
									}`}
								</Text>
							</Box>
						) : null}

						{/* Show the feedback form input fields */}
						{selectedIssue && issueInputList.length > 0 ? (
							<>
								{/* Show the issue form inputs */}
								{issueInputList.map((input, index) => (
									<Box
										key={index}
										mb={4}
										maxW={{ base: "100%", md: "350px" }}
										hidden={feedbackDone}
									>
										<InputLabel
											required={input.is_required}
										>
											{input.label}
										</InputLabel>
										<Input
											type={
												input.type === 11
													? "number"
													: "text"
											}
											value={input.value || ""}
											minLength={input.length_min || 0}
											maxLength={input.length_max || 60}
											onChange={(e) => {
												const _val = e.target.value;
												// this._updateIssueInput(index, _val);
												setIssueInputList((prev) => {
													prev[index].value = _val;
													return [...prev];
												});
											}}
											isDisabled={disableInputs}
											focusBorderColor="primary.light"
										/>
										{input.is_required && !input.value ? (
											<Text
												fontSize="xs"
												fontWeight="medium"
												color="error"
											>
												* Required
											</Text>
										) : null}
									</Box>
								))}
							</>
						) : null}

						{/* Show the feedback form file-upload fields */}
						{selectedIssue && issueFileList.length > 0 ? (
							<>
								{/* Show the issue form file-upload fields */}
								{issueFileList.map((file, index) => (
									<Box
										key={index}
										mb={4}
										maxW={{ base: "100%", md: "350px" }}
										hidden={feedbackDone}
									>
										<InputLabel required={file.is_required}>
											{file.label}
										</InputLabel>
										<Dropzone
											file={file.value}
											setFile={(_file) => {
												setIssueFileList((prev) => {
													prev[index].value = _file;
													return [...prev];
												});
											}}
											accept={
												file.accept ||
												"image/jpeg,image/pjpeg,image/png,application/pdf"
											}
											disabled={disableInputs}
										></Dropzone>
										{/* <Input
											type="file"
											isDisabled={disableInputs}
											focusBorderColor="primary.light"
										/> */}
										{file.is_required ? (
											<Text
												fontSize="xs"
												fontWeight="medium"
												color="error"
											>
												* Required
											</Text>
										) : null}
									</Box>
								))}
							</>
						) : null}

						{/* Show option to capture screenshot */}
						{selectedIssue.screenshot ===
						SCREENSHOT_TYPE.DISABLED ? null : (
							<Box
								mb={4}
								maxW={{ base: "100%", md: "350px" }}
								hidden={feedbackDone}
							>
								<Screenshot
									screenshot={screenshot}
									autoCaptureScreenshot={
										autoCaptureScreenshot
									}
									disabled={disableInputs}
									onCapture={setScreenshot}
									onHide={onHide}
									onShow={onShow}
								/>
							</Box>
						)}

						{/* Show a multi-line input to capture user comment & the submit button */}
						{isUserFeedbackRequired ? (
							<>
								{/* Show the comments input */}
								{selectedIssue.comment !==
								COMMENT_TYPE.DISABLED ? (
									<Box
										mb={4}
										maxW={{ base: "100%", md: "350px" }}
										hidden={feedbackDone}
									>
										<InputLabel
											required={
												selectedIssue.comment ===
												COMMENT_TYPE.MANDATORY
													? true
													: false
											}
										>
											Comments
										</InputLabel>
										<Textarea
											value={comment}
											isDisabled={disableInputs}
											focusBorderColor="primary.light"
											placeholder="Please enter your comments or any additional details here..."
											onChange={(e) =>
												setComment(e.target.value)
											}
										/>
										{selectedIssue.comment ===
										COMMENT_TYPE.MANDATORY ? (
											<Text
												fontSize="xs"
												fontWeight="medium"
												color="error"
											>
												* Required
											</Text>
										) : null}
										{classifierResult ? (
											<Text
												fontSize="xs"
												fontWeight="medium"
												color="gray.600"
											>
												{classifierResult}
											</Text>
										) : null}
									</Box>
								) : null}

								{/* Show the submit button */}
								<Box mt={4} hidden={feedbackDone}>
									<Button
										variant="accent"
										size="lg"
										isDisabled={disableSubmit}
										rightIcon={
											<Icon
												name="arrow-forward"
												size="sm"
												ml={1}
											/>
										}
										onClick={() => {
											submitFeedback();
										}}
									>
										{submittingFeedback
											? "Please Wait..."
											: "Submit"}
									</Button>
								</Box>

								{/* Show the form-submit error message */}
								{isFormSubmitError ? (
									<Text
										mt={4}
										fontSize="sm"
										fontWeight="medium"
										color="error"
									>
										There was an error submitting your
										feedback. Please try again later.
									</Text>
								) : null}

								{/* Show the feedback submit response */}
								{feedbackDone && feedbackSubmitResponse ? (
									<Box mt={4}>
										<Flex direction="row">
											<RiCheckboxCircleFill
												size="48px"
												color="green"
												opacity="0.6"
											/>
											<Box ml="1em">
												<Text
													fontSize="lg"
													color="#555"
												>
													{
														feedbackSubmitResponse.message
													}
												</Text>
												{feedbackSubmitResponse.ticket_id ? (
													<Text
														fontSize="sm"
														color="gray.600"
													>
														Ticket ID:{" "}
														{
															feedbackSubmitResponse.ticket_id
														}
													</Text>
												) : null}
											</Box>
										</Flex>

										{/* Show the close button after form submit */}
										<Box mt="3em">
											<Button
												variant="accent"
												size="lg"
												onClick={() => {
													onClose && onClose();
												}}
											>
												Close
											</Button>
										</Box>
									</Box>
								) : null}
							</>
						) : null}
					</>
				) : null}
			</Card>
		</>
	);
};

/**
 * Container card component
 * @param {object} props - Properties passed to the component.
 * @param {string} [props.heading] - Label to show above the card.
 * @param {boolean} [props.showCloseIcon] - Whether to show a close icon on the card (default: false).
 * @param {Function} [props.onClose] - Function to call when the close icon is clicked.
 * @param {ReactNode} props.children - Content to show inside the card.
 * @param {...*} rest - Rest of the props for the card.
 * @returns {JSX.Element} - A card container.
 */
const Card = ({
	heading = "",
	showCloseIcon = false,
	onClose,
	children,
	...rest
}: React.PropsWithChildren<{
	heading?: string;
	showCloseIcon?: boolean;
	onClose?: Function;
}>) => {
	// MARK: JSX - Card
	return (
		<Flex
			boxSizing="border-box"
			w="full"
			h="auto"
			p={{
				base: "10px",
				md: "20px 30px 30px 30px",
				"2xl": "30px 40px 40px 40px",
			}}
			m={{ base: "5px", md: "0" }}
			direction={"column"}
			border="card"
			borderRadius={{ base: "8", md: "10" }}
			boxShadow={{ base: "none", md: "0px 5px 15px #0000000D;" }}
			bg="white"
			px="16px"
			sx={{
				"@media print": {
					padding: "0 !important",
					bg: "none !important",
				},
			}}
			{...rest}
		>
			<>
				{heading || showCloseIcon ? (
					<>
						<Flex
							direction="row"
							align="center"
							justify="space-between"
							w="100%"
							cursor="default"
							userSelect="none"
							mb={6}
						>
							{heading ? (
								<Text
									fontSize={{
										base: "18px",
										sm: "18px",
										md: "20px",
										lg: "25px",
										"2xl": "30px",
									}}
									color="gray.700"
									fontWeight={700}
								>
									{heading}
								</Text>
							) : null}
							{showCloseIcon ? (
								<Flex
									ml={2}
									w="35px"
									h="35px"
									rounded="full"
									align="center"
									justify="center"
									cursor="pointer"
									color="gray.700"
									_hover={{ bg: "gray.100" }}
									onClick={() => onClose()}
								>
									<Icon name="close" size="xs" />
								</Flex>
							) : null}
						</Flex>
					</>
				) : null}
				{children}
			</>
		</Flex>
	);
};

/**
 * Helper component to render a list of categories.
 * @param {object} props - Properties passed to the component.
 * @param {object[]|null} props.categoryList - List of categories. Each category is an object with properties `id` and `title`.
 * @param {string} props.label - Label to show above the category list.
 * @param {boolean} [props.isPrimaryList] - Whether this is the primary list of issue-types (default: false).
 * @param {number|string} props.selectedId - ID of the selected category.
 * @param {string} [props.idKey] - Key to use for the category ID (default: "id").
 * @param {string} [props.labelKey] - Key to use for the category title (default: "title").
 * @param {boolean} [props.disabled] - Whether the category list is disabled (default: false).
 * @param {Function} props.onSelect - Function to call when a category is selected. It receives the selected category object as an argument.
 * @param {...*} rest - Rest of the props for the outer container.
 * @returns {JSX.Element} - A list of categories to select from.
 */
const CategoryList = ({
	categoryList,
	label,
	isPrimaryList = false,
	selectedId,
	idKey = "id",
	labelKey = "title",
	disabled = false,
	onSelect,
	...rest
}: {
	categoryList: object[] | null;
	label: string;
	isPrimaryList?: boolean;
	selectedId: number | string;
	idKey?: string;
	labelKey?: string;
	disabled?: boolean;
	onSelect: Function;
}) => {
	// Hide the list of categories, if only one item available
	if (!categoryList || (isPrimaryList !== true && categoryList.length <= 1))
		return null;

	// Show selected category or sub-category...
	if (isPrimaryList !== true && selectedId) {
		const _selectedCat = categoryList.find(
			(cat) => cat[idKey] === selectedId
		);
		if (_selectedCat) {
			return (
				<Box mb={8} {...rest}>
					<Label>{label}</Label>
					<Flex
						direction="row"
						w="full"
						gap={2}
						wrap="wrap"
						cursor={disabled ? "default" : "pointer"}
						pointerEvents={disabled ? "none" : "auto"}
						opacity={disabled ? 0.5 : 1}
					>
						<CategoryButton isSelected>
							{_selectedCat[labelKey]}
						</CategoryButton>
						<CategoryButton onClick={() => onSelect(null)}>
							Change...
						</CategoryButton>
					</Flex>
				</Box>
			);
		}
	}

	// MARK: JSX - Category
	// Show the list of categories, if multiple items available...
	return (
		<Box mb={8} {...rest}>
			<Label>{label}</Label>
			<Flex
				direction="row"
				w="full"
				gap={2}
				wrap="wrap"
				cursor={disabled ? "default" : "pointer"}
				pointerEvents={disabled ? "none" : "auto"}
				opacity={disabled ? 0.5 : 1}
			>
				{categoryList.map((cat: object) => (
					<div key={cat[idKey]}>
						<CategoryButton
							isSelected={cat[idKey] === selectedId}
							isPrimary={isPrimaryList}
							onClick={() => onSelect(cat)}
						>
							{cat[labelKey]}
						</CategoryButton>
					</div>
				))}
			</Flex>
		</Box>
	);
};

/**
 * Category label component
 * @param {object} props - Properties passed to the component.
 * @param {string} props.children - Label to show for the category.
 * @param {...*} rest - Rest of the props for the label.
 * @returns {JSX.Element} - A label for the category.
 */
const Label = ({ children, ...rest }) => {
	return (
		<Text
			fontSize="12px"
			color="gray.600"
			fontWeight={500}
			ml={1}
			mb={1}
			{...rest}
		>
			{children}
		</Text>
	);
};

/**
 * Category-list button component
 * MARK: <CategoryButton>
 * @param {object} props - Properties passed to the component.
 * @param {boolean} [props.isSelected] - Whether the category is selected (default: false).
 * @param {boolean} [props.isPrimary] - Whether this is the primary category (default: false).
 * @param {Function} [props.onClick] - Function to call when the category is clicked.
 * @param {string} props.children - Label to show on the button.
 * @param {...*} rest - Rest of the props for the button.
 * @returns {JSX.Element} - A button to select a category.
 */
const CategoryButton = ({
	isSelected = false,
	isPrimary = false,
	onClick,
	children,
	...rest
}: {
	isSelected?: boolean;
	isPrimary?: boolean;
	onClick?: Function;
	children: string;
}) => {
	return (
		<Button
			variant={isSelected ? "accent" : "outline"}
			size={isPrimary ? "md" : "sm"}
			fontSize="xs"
			borderRadius="full"
			onClick={() => onClick && onClick()}
			{...rest}
		>
			{children}
		</Button>
	);
};

/**
 * Component to capture and show the current screenshot
 * MARK: <Screenshot>
 * @param {object} props - Properties passed to the component.
 * @param {string} props.screenshot - The screenshot image data.
 * @param {boolean} [props.autoCaptureScreenshot] - Whether to automatically capture the screenshot (default: false).
 * @param {boolean} [props.disabled] - Whether the screenshot capture is disabled (default: false).
 * @param {Function} props.onCapture - Function to call when the screenshot is captured.
 * @param {Function} props.onHide - Function to call to temporarily hide the Raise Query dialog so that the screenshot can be taken.
 * @param {Function} props.onShow - Function to call to show the Raise Query dialog after the screenshot is taken.
 */
const Screenshot = ({
	screenshot,
	autoCaptureScreenshot = false,
	disabled,
	onCapture,
	onHide,
	onShow,
	...rest
}) => {
	// https://developer.chrome.com/docs/web-platform/screen-sharing-controls/
	// https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture

	// Ref for the video & canvas elements
	const videoRef = useRef(null);
	// const canvasRef = useRef(null);

	const { showImage } = useFileView();
	const { editImage } = useImageEditor();
	const [originalCapture, setOriginalCapture] = useState<string | null>(null);
	const [edited, setEdited] = useState(false);
	const autoCaptureAttempted = useRef(false);

	const DISABLE_EDIT = true;

	// Auto-capture screenshot...
	useEffect(() => {
		console.log("Auto-capture screenshot 1: ", autoCaptureScreenshot);

		if (autoCaptureScreenshot && !autoCaptureAttempted.current) {
			autoCaptureAttempted.current = true;
			captureScreen();
		}
	}, [autoCaptureScreenshot, autoCaptureAttempted]);

	// Edit/crop screenshot when captured...
	useEffect(() => {
		if (originalCapture && !edited) {
			if (DISABLE_EDIT) {
				onCapture && onCapture(originalCapture);
				setEdited(true);
			} else {
				editImage(originalCapture, null, (data) => {
					if (data?.accepted && data?.image) {
						onCapture && onCapture(data.image);
						setEdited(true);
					} else {
						setOriginalCapture(null);
					}
				});
			}
		}
	}, [edited, originalCapture, onCapture]);

	const DisplayMediaOptions = {
		video: {
			displaySurface: "browser",
		},
		audio: false,
		// audio: {
		// 	suppressLocalAudioPlayback: true,
		// },
		preferCurrentTab: true,
		selfBrowserSurface: "include", // allow the user to share the current tab
		systemAudio: "exclude",
		surfaceSwitching: "exclude", // allow the user to dynamically switch between shared tabs
		monitorTypeSurfaces: "exclude", // prevent the user from sharing an entire screen.
	};

	const captureScreen = () => {
		if (disabled) {
			return;
		}
		onHide();
		navigator.mediaDevices.getDisplayMedia(DisplayMediaOptions as any).then(
			(stream) => {
				videoRef.current.srcObject = stream;
			},
			(err) => {
				console.error("Screenshot Error: " + err);
				onShow();
			}
		);
	};

	const stopCapture = () => {
		let tracks = videoRef.current.srcObject.getTracks();

		tracks.forEach((track) => track.stop());
		videoRef.current.srcObject = null;
		onShow();
	};

	const captureFrame = () => {
		// Call captureFrameDbc after a short delay (such that the video is loaded properly)
		const DELAY = 100;
		setTimeout(() => {
			const video = videoRef.current;

			// const canvas = new OffscreenCanvas(
			// 	video.videoWidth,
			// 	video.videoHeight
			// ); // canvasRef.current;

			const canvas = document.createElement("canvas");
			canvas.width = Math.floor(video.videoWidth);
			canvas.height = Math.floor(video.videoHeight);

			const context = canvas.getContext("2d") as CanvasRenderingContext2D;

			// Draw the video frame to the canvas
			context.drawImage(video, 0, 0, canvas.width, canvas.height);

			try {
				const imgUrl = canvas.toDataURL("image/jpeg", 0.8);
				setOriginalCapture(imgUrl);
				setEdited(false);
				stopCapture();
			} catch (err) {
				console.error("Blob Error: ", err);
				stopCapture();
			}
		}, DELAY);
	};

	return (
		<Flex
			w="100%"
			direction="column"
			align="center"
			justify="center"
			border="2px"
			borderStyle="dashed"
			borderColor="divider"
			borderRadius="10px"
			color="light"
			p="5"
			{...rest}
			cursor={disabled ? "default" : "pointer"}
			pointerEvents={disabled ? "none" : "auto"}
			opacity={disabled ? 0.5 : 1}
		>
			{/* Hidden video element */}
			<video
				ref={videoRef}
				controls
				autoPlay
				muted
				width="100%"
				height="auto"
				onLoadedData={captureFrame}
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					maxWidth: "90%",
					maxHeight: "90%",
					zIndex: "-9999",
					pointerEvents: "none",
					opacity: 0,
				}}
			/>

			{/* Preview Image with delete button */}
			{screenshot ? (
				<Flex position="relative">
					<img
						src={screenshot}
						style={{
							maxHeight: "200px",
							maxWidth: "200px",
							cursor: "pointer",
							borderRadius: "4px",
							boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
						}}
						alt="Screenshot"
						onClick={() => showImage(screenshot)}
					/>
					<IcoButton
						iconName="close"
						title="Discard"
						size="xs"
						theme="primary"
						// boxShadow="0px 3px 10px #11299E1A"
						_hover={{ bg: "primary.dark" }}
						position="absolute"
						top="-10px"
						right="-10px"
						onClick={() => {
							onCapture && onCapture(null);
						}}
					/>
				</Flex>
			) : null}

			{screenshot ? null : (
				<Button
					variant="primary"
					onClick={captureScreen}
					opacity={disabled ? 0.4 : 1}
				>
					<RiScreenshot2Line size="24px" />
					&nbsp; Capture Screenshot
				</Button>
			)}
		</Flex>
	);
};

/**
 * Helper function to process the issue list, and create a separate list of categories & nested sub-categories
 * MARK: fx: _processIssueList
 * @param {string} issue_list - List of issues
 * @returns {{processed_issue_list: [], category_list: [], category_map: {}}} - A processed list of issues, categories, and sub-categories
 */
const _processIssueList = (issue_list) => {
	issue_list = issue_list || [];

	var processed_issue_list = [];
	var category_list = [];
	var category_map = {}; // Temporarily map all categories/sub-categories as added-once

	issue_list.forEach(function (i) {
		// Fill missing default values...
		i.type = i.type || 0; // Default: Ticket
		i.value = i.value || i.label; // Value is same as label by default
		i.raise_issue_after = i.raise_issue_after || "0d";
		i.tat = i.tat || "0";
		i.reopened_tat = i.reopened_tat || "0";
		i.comment = i.comment || 0; // Optional Comments by default
		i.desc =
			i.desc ||
			"Please share the details of your query/issue and we will get back to you soon.";

		// Create a separate list of categories & nested sub-categories......
		i.category = i.category || { id: -1, title: "Others" };
		i.sub_category = i.sub_category || { id: -1, title: "Others" };

		// Add category...
		if (!(i.category.id in category_map)) {
			category_list.push(i.category);
			category_map[i.category.id] = { submap: {}, subcat_list: [] };
		}

		// Add sub-category...
		if (!(i.sub_category.id in category_map[i.category.id].submap)) {
			category_map[i.category.id].subcat_list.push(i.sub_category);
			category_map[i.category.id].submap[i.sub_category.id] =
				i.sub_category;
		}

		processed_issue_list.push(i);
	});

	// Merge nested sub-categories into the category list...
	// category_list.map(function (cat) {
	// 	cat.sub_category_list = category_map[cat.id].subcat_list;
	// 	return cat;
	// });

	return {
		processed_issue_list: processed_issue_list,
		category_list: category_list,
		category_map: category_map,
	};
};

// MARK: Types...

// Type of a selected issue...
interface IssueType {
	/**
	 * Solution Type: 0: Ticket, 1: Link
	 * @default 0
	 */
	type?: 0 | 1;

	/**
	 * Value of the issue (visible to the support team as the issue sub-sub-type or label)
	 */
	value: string;

	/**
	 * Label of the issue (visible to the user as the issue type). If not provided, `value` is used.
	 */
	label?: string;

	/**
	 * Additional description of the issue
	 */
	desc?: string;

	/**
	 * Time after which the issue can be raised. Eg: "0d", "1d", "2d", etc.
	 */
	raise_issue_after?: string;

	/**
	 * Number of days within which the issue is expected to be resolved. Eg: "0", "1", "2", etc.
	 */
	tat?: string;

	/**
	 * Number of days within which the issue is expected to be resolved, if reopened. Eg: "0", "1", "2", etc.
	 */
	reopened_tat?: string;

	/**
	 * Whether to allow comments while raising the issue. -1: Disabled, 0: Optional, 1: Mandatory
	 * @default 0
	 */
	comment?: -1 | 0 | 1;

	/**
	 * Additional context/comments for the support team
	 */
	context?: string;

	/**
	 * Type of screenshot capture: -1 = Disabled, 0 = Optional, 1 = Mandatory
	 * @default 0
	 */
	screenshot?: -1 | 0 | 1;

	category: { id: number; title: string };

	sub_category: { id: number; title: string };

	/**
	 * Optional array of Inputs to be captured from the user. Each input is an object with properties `label`, `type`, `length_min`, `length_max` & `is_required`.
	 */
	inputs?: IssueInputType[];

	/**
	 * Optional array of file-upload fields to be captured from the user. Each field is an object with properties `label` & `is_required`.
	 */
	files?: IssueFileType[];

	/**
	 * Priority of the issue
	 */
	priority?: string;
}

// Type of an input field to be captured with the issue...
interface IssueInputType {
	/**
	 * Type of input to capture. 9: Money, 11: Number, 12: Text (default: 12)
	 */
	type: 9 | 11 | 12;
	label: string;
	length_min?: number;
	length_max?: number;
	is_required?: boolean;
	value?: string | number;
}

// Type of a file-upload field to be captured with the issue...
interface IssueFileType {
	label: string;
	is_required?: boolean;
	/**
	 * Accepted file types. Eg: "image/jpeg,image/pjpeg,image/png,application/pdf"
	 */
	accept?: string;
	value?: File;
}

export default RaiseIssueCard;
