import { TransactionTypes } from "constants/EpsTransactions";

const DEFAULT_TIMEOUT = 120000; // 2 minutes

interface SupportTicketType {
	accessToken: string;
	summary: string;
	category?: string;
	subCategory?: string;
	comment?: string;
	inputs?: Array<{ label: string; value: string | number }>;
	files?: Array<{ label: string; value: File }>;
	screenshot?: string;
	origin?: string;
	tat?: string;
	priority?: string;
	context?: string;
	tid?: string;
	tx_typeid?: string;
	transaction_metadata?: any;
	technicalNotes?: any;
	appSource?: string;
	androidAppVersion?: string;
	controller?: AbortController;
	generateNewToken?: Function;
}

/**
 * Create a support ticket for the given issue...
 * @param {object} options
 * @param {string} options.accessToken - The access token for the user
 * @param {string} options.summary - The issue-type value
 * @param {string} [options.category] - The category of the issue
 * @param {string} [options.subCategory] - The sub-category of the issue
 * @param {string} [options.comment] - Any additional comments
 * @param {Array} [options.inputs] - Additional inputs to be sent
 * @param {Array} [options.files] - Additional files to be sent
 * @param {string} [options.screenshot] - The screenshot of the issue
 * @param {string} [options.origin] - The origin of the issue
 * @param {string} [options.tat] - The TAT for the issue
 * @param {string} [options.priority] - The priority of the issue
 * @param {string} [options.context] - Optional info to be shared with the support team. Not visible to the user
 * @param {string} [options.tid] - The transaction ID
 * @param {string} [options.tx_typeid] - The transaction type ID
 * @param {object} [options.transaction_metadata] - The transaction metadata
 * @param {object} [options.technicalNotes] - Any additional technical notes
 * @param {string} [options.appSource] - The source of the app (e.g., androidwebview, pwa, etc.)
 * @param {string} [options.androidAppVersion] - The version of the android wrapper app (if applicable)
 * @param {AbortController} [options.controller] - The abort controller for the request
 * @param {Function} [options.generateNewToken] - The function to generate a new token
 * @returns {Promise} - The promise object representing the feedback submission
 * @throws {Error} - If there is an error submitting the feedback
 */
export const createSupportTicket = ({
	accessToken,
	summary, // issue-type value
	category = "Others",
	subCategory = "Others",
	comment = "",
	inputs = [],
	files = [],
	screenshot,
	origin = "",
	tat = "",
	priority = "",
	context = "",
	tid = "",
	tx_typeid = "",
	transaction_metadata = {},
	technicalNotes = {},
	appSource = "",
	androidAppVersion = "",
	controller = null,
	generateNewToken = null,
}: SupportTicketType) => {
	let commentMessage = "";
	let fullDescription = "";

	// Timeout controller for the fetch request
	const _controller = controller || new AbortController();

	const timeout_id = setTimeout(() => _controller.abort(), DEFAULT_TIMEOUT);

	// Add UAT TESTING comment for non-production environments...
	if (process.env.NEXT_PUBLIC_ENV !== "production") {
		comment = `UAT TESTING!! Please ignore this ticket.<br><br>${comment}`;
	}

	// Convert new lines to HTML breaks...
	comment = nl2br(comment);
	context = nl2br(context);

	if (comment) {
		commentMessage = `<p>Comments:<br>${comment}</p>`;
		fullDescription = `<p><strong>COMMENT:</strong><br>${comment}</p>\n`;
	}

	if (context) {
		commentMessage += `<p>Notes for Support Team:<br>${context}</p>`;
		fullDescription += `<p><strong>NOTES FOR SUPPORT TEAM:</strong><br>${context}</p>`;
	}

	if (inputs?.length > 0) {
		fullDescription += "<ul>";
		for (let i = 0; i < inputs.length; i++) {
			if (!inputs[i].value) {
				continue;
			}

			fullDescription +=
				"<li><strong>" +
				(inputs[i].label + ":</strong> " + inputs[i].value + "</li>\n");

			commentMessage += inputs[i].label + ": " + inputs[i].value + "\n";
		}
		fullDescription += "</ul>";
	}

	if (transaction_metadata?.pre_msg_template) {
		fullDescription += `\n<p>${transaction_metadata.pre_msg_template}</p>`;
	}

	// Prepare the feedback data...
	const feedbackData: Record<string, string> = {
		interaction_type_id: "" + TransactionTypes.RAISE_ISSUE,

		summary:
			(process.env.NEXT_PUBLIC_ENV !== "production" ? "[IGNORE] " : "") +
			summary, // Subject line
		description: fullDescription,
		category: category,
		sub_category: subCategory,
		feedback_issue_type: summary, // sub-sub-category

		tid: tid || "",
		tx_typeid: tx_typeid || "",
		tat: tat || "",
		priority: priority || "",
		feedback_origin: origin,
		comment: commentMessage,

		technical_notes: JSON.stringify({
			...technicalNotes,
			...getSessionDetails(),
			transaction_details: transaction_metadata?.transaction_detail,
			useragent: navigator.userAgent,
			screen:
				(window.innerWidth || document.body.clientWidth) +
				"x" +
				(window.innerHeight || document.body.clientHeight) +
				" of " +
				screen.width +
				"x" +
				screen.height,
			device_time: new Date().toISOString(),
			appsource: appSource,
			android_app_version: androidAppVersion,
			// TODO: Add the following details...
			// web_app_version: process.env.NEXT_PUBLIC_APP_VERSION,
			// last_unhandled_error: window._lastConnectGlobalError || "No Error",
			// db_cache_ver: this.db_cache_ver,
		}),
	};

	console.log("[RaiseIssue] feedback submit...", feedbackData);

	const formData = new FormData();
	formData.append("formdata", new URLSearchParams(feedbackData).toString());
	let filesFound = false;

	if (files?.length) {
		for (let i = 0; i < files.length; i++) {
			if (!files[i].value) {
				continue;
			}
			const fileName =
				`file_${i + 1}_` +
				(files[i].label || "")
					.replace(/[^0-9a-zA-Z]+/g, "_")
					.toLowerCase();
			formData.append(fileName, files[i].value);
			filesFound = true;
		}
	}

	if (screenshot) {
		// const screenshotFile = new File(
		// 	[screenshot],
		// 	"screenshot.jpg",
		// 	screenshot
		// );

		// Convert the base64 screenshot to a File...
		const filename = "screenshot.jpg";
		const blobBin = atob(screenshot.split(",")[1]);
		const l_blobBin = blobBin.length;
		let array = [];
		for (let i = 0; i < l_blobBin; i++) {
			array.push(blobBin.charCodeAt(i));
		}
		const screenshotFile = new File([new Uint8Array(array)], filename, {
			type: "image/jpeg",
		});
		formData.append(filename, screenshotFile);
		filesFound = true;
	}

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	if (filesFound !== true) {
		headers["Content-Type"] = "application/json";
	}

	const fetchPromise = fetch(
		process.env.NEXT_PUBLIC_API_BASE_URL +
			"/transactions/" +
			(filesFound ? "upload" : "do"),
		{
			method: "POST",
			body: filesFound ? formData : JSON.stringify(feedbackData),
			headers: headers,
			signal: controller ? controller.signal : undefined,
		}
	)
		.then((res) => {
			if (res.ok) {
				console.log("[RaiseIssue] feedback submit result...", res);
				return res.json();
			} else {
				console.error("[RaiseIssue] feedback submit error: ", res);
				throw new Error("Error submitting feedback");
			}
		})
		.finally(() => {
			// Cancel aborting the fetch request after timeout
			clearTimeout(timeout_id);
		});

	// Try to update the access-token, if token is nearing expiry
	if (typeof generateNewToken === "function") {
		generateNewToken();
	}

	return fetchPromise;
};

/**
 * Get the org, session and app details from sessionStorage...
 */
const getSessionDetails = () => {
	const org = JSON.parse(sessionStorage.getItem("org_detail"));
	const user = JSON.parse(sessionStorage.getItem("user_details"));

	// Get

	return {
		// TODO: Add app details like, source (web/android), version (web/android/DB), last-unhandled-error (from error-boundry), etc...
		app: {
			url: window.location.href,
			org_id: org?.org_id || "",
			is_org_admin: org?.is_org_admin || 0,
			org_name: org?.org_name || "",
			app_name: org?.app_name || "",
		},
		user: {
			user_name: user?.name || "",
			user_type: user?.user_type || "",
			user_code: user?.code || "",
			user_zoho_id: user?.zoho_id || "",
			shop_name: user?.shop_name || "",
			shop_address: user?.shopaddress || "",
			roles: user?.role_list || "",
		},
	};
};

/**
 * Utility function to convert new lines to HTML breaks...
 * @param str
 */
const nl2br = (str: string) => {
	return str.replace(/(?:\r\n|\r|\n)/g, "<br>");
};
