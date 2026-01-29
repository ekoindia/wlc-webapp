import { Endpoints } from "constants/EndPoints";
import { fetcher } from "helpers";
import type { ApiPipelineStep, OnboardingStep } from "../constants";
import type { PipelineState } from "../context";

/**
 * Result of a single API call in the pipeline
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
	/** Previous pipeline state (for smart retry) */
	existingPipelineState?: PipelineState;
	/** Callback on success */
	onSuccess?: (_response: any) => void;
	/** Callback on error */
	onError?: (_error: any) => void;
	/** Progress callback for each step */
	onStepComplete?: (_stepId: string, _status: "success" | "failed") => void;
}

/**
 * Execute a form submission API call
 * @param {ApiPipelineStep} pipelineStep - Pipeline step configuration containing interaction type ID
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
		const response = await fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: accessToken,
				body: {
					interaction_type_id: pipelineStep.interactionTypeId,
					user_id: mobile,
					csp_id: mobile,
					...formData,
				},
				timeout: 30000,
			},
			generateNewToken
		);

		const success =
			(response?.status === 0 || response?.response_type_id === 0) &&
			!(Object.keys(response?.invalid_params || {}).length > 0);

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
 * Resolve file key from mapping or generate default
 * @param {Record<string, string>} [fileKeyMapping] - Mapping from form paths to backend keys
 * @param {string} formPath - The form data path (e.g., "aadhaarImages.front")
 * @param {number} fileIndex - Current file index for fallback naming
 * @returns {string} The file key to use
 */
function resolveFileKey(
	fileKeyMapping: Record<string, string> | undefined,
	formPath: string,
	fileIndex: number
): string {
	if (fileKeyMapping && fileKeyMapping[formPath]) {
		return fileKeyMapping[formPath];
	}
	return `file${fileIndex}`;
}

/**
 * Execute a file upload API call
 * Matches the legacy upload format from useFileUpload.ts
 * @param {ApiPipelineStep} pipelineStep - Pipeline step with docType, interaction type, and fileKeyMapping
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
		const { fileKeyMapping } = pipelineStep;

		// Collect files and build file list for formdata params
		const fileList: string[] = [];
		let fileIndex = 1;

		for (const [key, value] of Object.entries(formData)) {
			// CASE 1: Raw File object (from local Form/Dropzone rendering - preferred approach)
			if (value instanceof File) {
				const fileKey = resolveFileKey(fileKeyMapping, key, fileIndex);
				uploadFormData.append(fileKey, value);
				fileList.push(fileKey);
				fileIndex++;
				continue;
			}

			// Skip non-object values (strings, numbers, etc. - handled later as non-file fields)
			if (!value || typeof value !== "object") {
				continue;
			}

			// CASE 2: { fileData: File } structure (legacy widget support)
			if (value.fileData instanceof File) {
				const fileKey = resolveFileKey(fileKeyMapping, key, fileIndex);
				uploadFormData.append(fileKey, value.fileData);
				fileList.push(fileKey);
				fileIndex++;
				continue;
			}

			// CASE 3: Nested objects like aadhaarImages: { front: { fileData }, back: { fileData } } (legacy widget)
			for (const [subKey, subValue] of Object.entries(value)) {
				if (subValue instanceof File) {
					// Nested raw File (unlikely but supported)
					const formPath = `${key}.${subKey}`;
					const fileKey = resolveFileKey(
						fileKeyMapping,
						formPath,
						fileIndex
					);
					uploadFormData.append(fileKey, subValue);
					fileList.push(fileKey);
					fileIndex++;
				} else if (
					subValue &&
					typeof subValue === "object" &&
					(subValue as any).fileData instanceof File
				) {
					// Nested { fileData: File } structure
					const formPath = `${key}.${subKey}`;
					const fileKey = resolveFileKey(
						fileKeyMapping,
						formPath,
						fileIndex
					);
					uploadFormData.append(fileKey, (subValue as any).fileData);
					fileList.push(fileKey);
					fileIndex++;
				}
			}
		}

		// Extract non-file fields from formData for inclusion in params
		// This captures panNumber, shopType, shopName, etc.
		const { fieldMapping } = pipelineStep;
		const nonFileFields: Record<string, any> = {};
		for (const [key, value] of Object.entries(formData)) {
			// Skip file objects and nested file containers
			if (value instanceof File) continue;
			if (
				value &&
				typeof value === "object" &&
				(value.fileData instanceof File ||
					key === "aadhaarImages" ||
					key === "panImage" ||
					key === "videoKyc" ||
					key === "passbookImage")
			) {
				continue;
			}
			// Include primitive values (string, number, boolean)
			if (
				typeof value === "string" ||
				typeof value === "number" ||
				typeof value === "boolean"
			) {
				// Use fieldMapping if available, otherwise use original key
				const apiKey = fieldMapping?.[key] ?? key;
				nonFileFields[apiKey] = value;
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

		const success =
			response?.status === 0 || response?.response_type_id === 0;

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
 * This is a standalone function (not a hook) that can be called at runtime.
 * @param {ExecutePipelineOptions} options - Pipeline execution options
 * @returns {Promise<PipelineState>} Final pipeline state
 */
export async function executePipeline(
	options: ExecutePipelineOptions
): Promise<PipelineState> {
	const {
		stepConfig,
		formData,
		mobile,
		accessToken,
		generateNewToken,
		sharedState,
		existingPipelineState = {},
		onSuccess,
		onError,
		onStepComplete,
	} = options;

	const pipeline = stepConfig.api?.pipeline;
	if (!pipeline || pipeline.length === 0) {
		console.warn(
			"[executePipeline] No pipeline configured for step:",
			stepConfig.name
		);
		return existingPipelineState;
	}

	console.log(
		`[executePipeline] Starting pipeline for step: ${stepConfig.name}`,
		pipeline
	);

	const state: PipelineState = { ...existingPipelineState };

	// Inject state values into form data
	const enrichedFormData = injectStateValues(
		formData.form_data,
		stepConfig,
		sharedState
	);

	console.log("[executePipeline] Enriched form data:", enrichedFormData);

	// Filter formData to only include fields defined in current step's localRenderer.
	// This prevents files from previous steps (e.g., Aadhaar) from being included when processing
	// the current step (e.g., PAN), which would cause incorrect file key assignments.
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

	for (const pipelineStep of pipeline) {
		// SKIP already succeeded steps (smart retry)
		if (state[pipelineStep.id]?.status === "success") {
			console.log(
				`[executePipeline] Skipping ${pipelineStep.id} — already succeeded`
			);
			continue;
		}

		// CHECK dependency — if dependency failed or not succeeded, stop
		if (
			pipelineStep.dependsOn &&
			state[pipelineStep.dependsOn]?.status !== "success"
		) {
			console.log(
				`[executePipeline] Stopping — dependency ${pipelineStep.dependsOn} not successful`
			);
			break;
		}

		// EXECUTE this step
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

		// Update state
		state[pipelineStep.id] = {
			status: result.success ? "success" : "failed",
			response: result.response || result.error,
		};

		console.log(
			`[executePipeline] ${pipelineStep.id} result:`,
			result.success ? "SUCCESS" : "FAILED",
			result.response || result.error
		);

		// Notify progress
		if (onStepComplete) {
			onStepComplete(
				pipelineStep.id,
				result.success ? "success" : "failed"
			);
		}

		// STOP if this step failed and has continueOnSuccess flag
		if (!result.success && pipelineStep.continueOnSuccess) {
			console.log(
				`[executePipeline] Stopping — ${pipelineStep.id} failed`
			);
			break;
		}
	}

	// Check if entire pipeline succeeded
	const allSucceeded = pipeline.every(
		(step) => state[step.id]?.status === "success"
	);

	if (allSucceeded) {
		console.log(`[executePipeline] Pipeline completed successfully`);
		if (onSuccess) {
			const lastResponse =
				state[pipeline[pipeline.length - 1].id]?.response;
			onSuccess(lastResponse);
		}
	} else {
		console.log(`[executePipeline] Pipeline failed`);
		if (onError) {
			const failedStep = pipeline.find(
				(step) => state[step.id]?.status === "failed"
			);
			onError(
				failedStep ? state[failedStep.id]?.response : "Pipeline failed"
			);
		}
	}

	return state;
}
