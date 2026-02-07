import { Endpoints } from "constants/EndPoints";
import { fetcher } from "helpers";
import type {
	ApiCallResponse,
	ApiPipelineStep,
	OnboardingStep,
	PipelineResult,
} from "../constants";

/**
 * Result of a single API call (internal use)
 */
interface ApiCallResult {
	success: boolean;
	response?: any;
	error?: any;
}

/**
 * Form data passed to the pipeline
 */
interface PipelineFormData {
	id: number;
	form_data: Record<string, any>;
	success_message?: string;
}

/**
 * Options for pipeline execution
 */
interface ExecutePipelineOptions {
	/** Step configuration */
	stepConfig: OnboardingStep;
	/** Form data from widget */
	formData: PipelineFormData;
	/** User mobile number */
	mobile: string;
	/** Access token for API calls */
	accessToken: string;
	/** Token refresh function */
	generateNewToken: (..._args: any[]) => any;
	/** Shared state for data injection */
	sharedState?: {
		mobile?: string;
		latLong?: string | null;
		aadhaar?: { number?: string; accessKey?: string; userCode?: string };
		digilocker?: { data?: { requestId?: string } };
	};
	/** Previous pipeline result (for smart retry - resumes from failed API) */
	existingResult?: PipelineResult;
	/** Callback on success (all APIs succeeded) */
	onSuccess?: (_result: PipelineResult) => void;
	/** Callback on error (any API failed) */
	onError?: (_result: PipelineResult) => void;
	/** Progress callback for each API call */
	onApiComplete?: (
		_apiId: string,
		_status: "success" | "failed" | "skipped"
	) => void;
}

/**
 * Check if a value is file data (File instance or object with fileData property)
 * @param {unknown} value - Value to check
 * @returns {boolean} True if the value is file data
 */
function isFileData(value: unknown): boolean {
	if (value instanceof File) return true;
	if (
		value &&
		typeof value === "object" &&
		"fileData" in (value as Record<string, unknown>)
	) {
		return true;
	}
	return false;
}

/**
 * Filter out file data from form data for form submissions.
 * Files cannot be sent as JSON in form calls - they must use upload calls.
 * @param {Record<string, any>} data - Form data to filter
 * @returns {Record<string, any>} Form data without file fields
 */
function filterFileDataFromForm(
	data: Record<string, unknown>
): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(data)) {
		if (!isFileData(value)) {
			result[key] = value;
		}
	}
	return result;
}

/**
 * Determine if API response indicates success based on pipeline step configuration
 * @param {any} response - API response object
 * @param {ApiPipelineStep} pipelineStep - Pipeline step configuration
 * @returns {boolean} True if response indicates success
 */
function isApiSuccess(response: any, pipelineStep: ApiPipelineStep): boolean {
	const successIds = pipelineStep.successResponseTypeIds ?? [0];
	const checkInvalidParams = pipelineStep.checkInvalidParams ?? true;

	const responseTypeId = response?.response_type_id ?? response?.status;
	const isValidResponseType = successIds.includes(responseTypeId);
	const hasInvalidParams =
		checkInvalidParams &&
		Object.keys(response?.invalid_params || {}).length > 0;

	return isValidResponseType && !hasInvalidParams;
}

/**
 * Execute a form submission API call
 * Uses fieldMapping to map form field names to API parameter names if provided.
 * @param {ApiPipelineStep} pipelineStep - Pipeline step configuration containing interaction type ID and optional fieldMapping
 * @param {Record<string, any>} formData - Form data object to submit to the API
 * @param {string} mobile - User's mobile number used as user_id and csp_id
 * @param {string} accessToken - JWT access token for authentication
 * @param {(..._args: any[]) => any} generateNewToken - Function to refresh access token on 401
 * @returns {Promise<ApiCallResult>} Result object with success flag and response/error
 */
async function executeFormCall(
	pipelineStep: ApiPipelineStep,
	formData: Record<string, any>,
	mobile: string,
	accessToken: string,
	generateNewToken: (..._args: any[]) => any
): Promise<ApiCallResult> {
	try {
		// Filter out file data - files cannot be sent as JSON, they must use upload calls
		const filteredFormData = filterFileDataFromForm(formData);

		// Apply field mapping if provided
		const fieldMapping = pipelineStep.fieldMapping || {};
		const mappedFormData: Record<string, any> = {};

		for (const [key, value] of Object.entries(filteredFormData)) {
			const mappedKey = fieldMapping[key] || key;
			mappedFormData[mappedKey] = value;
		}

		const response = await fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: accessToken,
				body: {
					interaction_type_id: pipelineStep.interactionTypeId,
					user_id: mobile,
					csp_id: mobile,
					...mappedFormData,
				},
				timeout: 30000,
			},
			generateNewToken
		);

		const success = isApiSuccess(response, pipelineStep);

		return { success, response };
	} catch (error) {
		console.error("[executePipeline] Form call error:", error);
		return { success: false, error };
	}
}

/**
 * Convert object to URL-encoded params string (matches legacy objectToFormParams)
 * @param {Record<string, any>} obj - Object to convert with key-value pairs
 * @returns {string} URL-encoded parameter string
 */
function objectToFormParams(obj: Record<string, any>): string {
	const params = Object.entries(obj).reduce(
		(acc, [key, value]) => {
			acc[key] = String(value ?? "");
			return acc;
		},
		{} as Record<string, string>
	);
	return new URLSearchParams(params).toString();
}

/**
 * Execute a file upload API call
 * Uses fieldMapping to map form field names to API file keys (file1, file2, etc.)
 * If mapping exists for a field, uses the mapped name; otherwise uses the original field key.
 * @param {ApiPipelineStep} pipelineStep - Pipeline step with docType, interaction type, and optional fieldMapping
 * @param {Record<string, any>} formData - Form data containing files and metadata
 * @param {string} mobile - User's mobile number used as user_id and csp_id
 * @param {string} accessToken - JWT access token for authentication
 * @param {(..._args: any[]) => any} generateNewToken - Function to refresh access token on 401
 * @param {ExecutePipelineOptions["sharedState"]} [sharedState] - Shared state for injecting latlong etc
 * @returns {Promise<ApiCallResult>} Result object with success flag and response/error
 */
async function executeUploadCall(
	pipelineStep: ApiPipelineStep,
	formData: Record<string, any>,
	mobile: string,
	accessToken: string,
	generateNewToken: (..._args: any[]) => any,
	sharedState?: ExecutePipelineOptions["sharedState"]
): Promise<ApiCallResult> {
	try {
		// Build FormData for file upload (matching legacy format)
		const uploadFormData = new FormData();

		// Get fieldMapping - use mapped name if exists, otherwise use original key
		const fieldMapping = pipelineStep.fieldMapping || {};
		const fileList: string[] = [];

		// Collect files and map them to API keys
		for (const [key, value] of Object.entries(formData)) {
			// CASE 1: Raw File object (from local Form/Dropzone rendering - preferred approach)
			if (value instanceof File) {
				const fileKey = fieldMapping[key] || key;
				uploadFormData.append(fileKey, value);
				fileList.push(fileKey);
				continue;
			}

			// Skip non-object values (strings, numbers, etc. - handled later as non-file fields)
			if (!value || typeof value !== "object") {
				continue;
			}

			// CASE 2: { fileData: File } structure (legacy widget support)
			if (value.fileData instanceof File) {
				const fileKey = fieldMapping[key] || key;
				uploadFormData.append(fileKey, value.fileData);
				fileList.push(fileKey);
				continue;
			}

			// CASE 3: Nested objects like aadhaarImages: { front: { fileData }, back: { fileData } }
			for (const [, subValue] of Object.entries(value)) {
				if (subValue instanceof File) {
					const fileKey = fieldMapping[key] || key;
					uploadFormData.append(fileKey, subValue);
					fileList.push(fileKey);
				} else if (
					subValue &&
					typeof subValue === "object" &&
					(subValue as any).fileData instanceof File
				) {
					const fileKey = fieldMapping[key] || key;
					uploadFormData.append(fileKey, (subValue as any).fileData);
					fileList.push(fileKey);
				}
			}
		}

		// Extract non-file fields from formData for inclusion in params
		const nonFileFields: Record<string, any> = {};
		for (const [key, value] of Object.entries(formData)) {
			// Skip file objects and nested file containers
			if (value instanceof File) continue;
			if (
				value &&
				typeof value === "object" &&
				value.fileData instanceof File
			) {
				continue;
			}
			// Include primitive values (string, number, boolean)
			if (
				typeof value === "string" ||
				typeof value === "number" ||
				typeof value === "boolean"
			) {
				nonFileFields[key] = value;
			}
		}

		// Build base params matching legacy createBaseFormData
		const baseParams: Record<string, any> = {
			client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
			user_id: mobile,
			interaction_type_id: pipelineStep.interactionTypeId,
			intent_id: 3,
			doc_type: pipelineStep.docType,
			latlong: sharedState?.latLong || "",
			source: "WLC",
			csp_id: mobile,
			// Include non-file fields from form_data
			...nonFileFields,
		};

		// Add empty file placeholders for formdata string
		for (const fileKey of fileList) {
			baseParams[fileKey] = "";
		}

		// Append as URL-encoded formdata field (matching legacy format)
		uploadFormData.append("formdata", objectToFormParams(baseParams));

		// Use raw fetch like legacy (Endpoints.UPLOAD = /transactions/upload)
		const response = await fetch(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.UPLOAD,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				body: uploadFormData,
			}
		).then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				const err = new Error("Upload failed") as any;
				err.response = res;
				err.status = res.status;
				if (res.status === 401) {
					generateNewToken(true);
				}
				throw err;
			}
		});

		const success = isApiSuccess(response, pipelineStep);

		return { success, response };
	} catch (error) {
		console.error("[executePipeline] Upload call error:", error);
		return { success: false, error };
	}
}

/**
 * Inject state values into form data based on preSubmit config
 * @param {Record<string, any>} formData - Original form data from widget
 * @param {OnboardingStep} stepConfig - Step configuration with preSubmit.inject mappings
 * @param {ExecutePipelineOptions["sharedState"]} [sharedState] - Shared state containing values to inject
 * @returns {Record<string, any>} Enriched form data with injected state values
 */
function injectStateValues(
	formData: Record<string, any>,
	stepConfig: OnboardingStep,
	sharedState?: ExecutePipelineOptions["sharedState"]
): Record<string, any> {
	const result = { ...formData };
	const injectConfig = stepConfig.preSubmit?.inject;

	if (!injectConfig || !sharedState) return result;

	for (const [targetField, sourcePath] of Object.entries(injectConfig)) {
		const value = getValueByPath(sharedState, sourcePath);
		if (value !== undefined) {
			result[targetField] = value;
		}
	}

	return result;
}

/**
 * Get a value from an object by dot-notation path
 * @param {any} obj - Source object to extract value from
 * @param {string} path - Dot-notation path like "state.latLong" or "aadhaar.number"
 * @returns {any} Value at the specified path or undefined if not found
 */
function getValueByPath(obj: any, path: string): any {
	const cleanPath = path.replace(/^state\./, "");
	return cleanPath.split(".").reduce((acc, key) => acc?.[key], obj);
}

/**
 * executePipeline
 *
 * Executes the api.pipeline configuration for a step with smart retry support.
 * - Sequential execution: APIs run in order, stop on first failure
 * - Smart retry: On retry, skips already-succeeded APIs and resumes from failed one
 * - Returns PipelineResult with status and list of all API responses
 * @param {ExecutePipelineOptions} options - Pipeline execution options
 * @returns {Promise<PipelineResult>} Final pipeline result with status and list
 */
export async function executePipeline(
	options: ExecutePipelineOptions
): Promise<PipelineResult> {
	const {
		stepConfig,
		formData,
		mobile,
		accessToken,
		generateNewToken,
		sharedState,
		existingResult,
		onSuccess,
		onError,
		onApiComplete,
	} = options;

	const pipeline = stepConfig.api?.pipeline;
	if (!pipeline || pipeline.length === 0) {
		console.warn(
			"[executePipeline] No pipeline configured for step:",
			stepConfig.name
		);
		return { status: "failed", list: [] };
	}

	console.log(
		`[executePipeline] Starting pipeline for step: ${stepConfig.name}`,
		pipeline
	);

	// Initialize result list (copy from existing or create empty)
	const resultList: ApiCallResponse[] = existingResult?.list
		? [...existingResult.list]
		: pipeline.map((step) => ({
				id: step.id,
				interactionTypeId: step.interactionTypeId,
				status: "skipped" as const,
				response: null,
			}));

	// Find resume point (first non-success API)
	const resumeIndex = existingResult?.list
		? existingResult.list.findIndex((item) => item.status !== "success")
		: 0;

	console.log(
		`[executePipeline] Resume index: ${resumeIndex}`,
		existingResult ? "(smart retry)" : "(fresh start)"
	);

	// Inject state values into form data
	const enrichedFormData = injectStateValues(
		formData.form_data,
		stepConfig,
		sharedState
	);

	console.log("[executePipeline] Enriched form data:", enrichedFormData);

	// Filter formData to only include fields defined in current step's localRenderer
	let filteredFormData = enrichedFormData;
	const localRendererFields = stepConfig.localRenderer?.formFields;

	if (localRendererFields && Array.isArray(localRendererFields)) {
		const allowedFieldNames = new Set(
			localRendererFields.map((f: { name: string }) => f.name)
		);
		filteredFormData = Object.fromEntries(
			Object.entries(enrichedFormData).filter(([key]) =>
				allowedFieldNames.has(key)
			)
		);
		console.log(
			`[executePipeline] Filtered form data to step fields: ${Array.from(allowedFieldNames).join(", ")}`,
			filteredFormData
		);
	}

	// Execute pipeline APIs sequentially
	let pipelineFailed = false;

	for (let i = 0; i < pipeline.length; i++) {
		const pipelineStep = pipeline[i];

		// SKIP already succeeded APIs (smart retry)
		if (i < resumeIndex && resultList[i]?.status === "success") {
			console.log(
				`[executePipeline] Skipping ${pipelineStep.id} — already succeeded`
			);
			continue;
		}

		// SKIP remaining APIs if pipeline already failed
		if (pipelineFailed) {
			resultList[i] = {
				id: pipelineStep.id,
				interactionTypeId: pipelineStep.interactionTypeId,
				status: "skipped",
				response: null,
			};
			if (onApiComplete) {
				onApiComplete(pipelineStep.id, "skipped");
			}
			continue;
		}

		// EXECUTE this API
		console.log(`[executePipeline] Executing ${pipelineStep.id}...`);
		let result: ApiCallResult;

		if (pipelineStep.type === "form") {
			result = await executeFormCall(
				pipelineStep,
				filteredFormData,
				mobile,
				accessToken,
				generateNewToken
			);
		} else if (pipelineStep.type === "upload") {
			result = await executeUploadCall(
				pipelineStep,
				filteredFormData,
				mobile,
				accessToken,
				generateNewToken,
				sharedState
			);
		} else {
			console.error(
				`[executePipeline] Unknown type: ${pipelineStep.type}`
			);
			result = { success: false, error: "Unknown pipeline step type" };
		}

		// Update result list
		const status = result.success ? "success" : "failed";
		resultList[i] = {
			id: pipelineStep.id,
			interactionTypeId: pipelineStep.interactionTypeId,
			status,
			response: result.response || result.error,
		};

		console.log(
			`[executePipeline] ${pipelineStep.id} result:`,
			result.success ? "SUCCESS" : "FAILED",
			result.response || result.error
		);

		// Notify progress
		if (onApiComplete) {
			onApiComplete(pipelineStep.id, status);
		}

		// STOP on failure (stop-on-fail is default behavior)
		if (!result.success) {
			pipelineFailed = true;
			console.log(
				`[executePipeline] Stopping — ${pipelineStep.id} failed`
			);
		}
	}

	// Build final result
	const allSucceeded = resultList.every((item) => item.status === "success");
	const pipelineResult: PipelineResult = {
		status: allSucceeded ? "success" : "failed",
		list: resultList,
	};

	// Call callbacks
	if (allSucceeded) {
		console.log(`[executePipeline] Pipeline completed successfully`);
		if (onSuccess) {
			onSuccess(pipelineResult);
		}
	} else {
		console.log(`[executePipeline] Pipeline failed`);
		if (onError) {
			onError(pipelineResult);
		}
	}

	return pipelineResult;
}
