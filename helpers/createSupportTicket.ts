import { TransactionTypes } from "constants/EpsTransactions";

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
	controller?: AbortController;
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
 * @param {AbortController} [options.controller] - The abort controller for the request
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
	controller = null,
}: SupportTicketType) => {
	let commentMessage = "";
	let fullDescription = "";

	if (comment) {
		commentMessage = `Comments:\n${comment}\n\n`;
		fullDescription = `\n<p><strong>COMMENT:</strong><br>\n${comment}\n<br><br>\n`;
	}

	if (context) {
		commentMessage += `Notes for Support Team:\n${context}\n\n`;
		fullDescription += `\n<p><strong>NOTES FOR SUPPORT TEAM:</strong><br>\n${context}\n<br><br>\n`;
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
		fullDescription += `\n<p>\n${transaction_metadata.pre_msg_template}\n`;
	}

	// Prepare the feedback data...
	const feedbackData: Record<string, string> = {
		interaction_type_id: "" + TransactionTypes.RAISE_ISSUE,

		summary: summary,
		description: fullDescription,
		category: category,
		sub_category: subCategory,

		tid: tid || "",
		tx_typeid: tx_typeid || "",
		tat: tat || "",
		priority: priority || "",
		feedback_origin: origin,
		feedback_issue_type: summary,
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
			// TODO: Add the following details...
			// last_unhandled_error: window._lastConnectGlobalError || "No Error",
			// appsource: this.appsource,
			// android_app_version: this.nativeVersion,
			// db_cache_ver: this.db_cache_ver,
		}),
	};

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

	return fetch(
		process.env.NEXT_PUBLIC_API_BASE_URL +
			"/transactions/" +
			(filesFound ? "upload" : "do"),
		{
			method: "POST",
			body: filesFound ? formData : JSON.stringify(feedbackData),
			headers: headers,
			signal: controller ? controller.signal : undefined,
		}
	).then((res) => {
		if (res.ok) {
			console.log("[RaiseIssue] feedback submit result...", res);
			return res.json();
		} else {
			console.error("[RaiseIssue] feedback submit error: ", res);
			throw new Error("Error submitting feedback");
		}
	});
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
