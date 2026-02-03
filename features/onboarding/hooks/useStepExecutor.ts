import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useCallback, useState } from "react";
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
 * Form data passed to the step executor
 */
interface StepFormData {
	id: number;
	form_data: Record<string, any>;
	success_message?: string;
}

/**
 * Shared state values needed for form data injection
 */
interface SharedState {
	latLong: string | null;
	mobile: string;
	aadhaar: {
		number: string | null;
		accessKey: string | null;
		userCode: string | null;
	};
	digilocker: {
		data?: {
			requestId?: string;
		};
	};
	pintwin: {
		bookletNumber: any;
		bookletKeys: any[];
	};
}

/**
 * Props for useStepExecutor hook
 */
interface UseStepExecutorProps {
	/** Current step configuration */
	stepConfig: OnboardingStep;
	/** Shared state for data injection */
	sharedState: SharedState;
	/** User ID for API calls */
	userId: string;
	/** CSP ID for API calls */
	cspId: string;
	/** Callback when pipeline completes successfully */
	onComplete?: (_response: any) => void;
	/** Callback when pipeline fails */
	onError?: (_error: any) => void;
}

/**
 * Return type for useStepExecutor hook
 */
interface UseStepExecutorReturn {
	/** Execute the step pipeline with form data */
	execute: (
		_formData: StepFormData,
		_existingPipelineState?: PipelineState
	) => Promise<PipelineState>;
	/** Current pipeline state */
	pipelineState: PipelineState;
	/** Whether any API call is in progress */
	isExecuting: boolean;
}

/**
 * useStepExecutor
 *
 * Executes the api.pipeline configuration for a step with smart retry support.
 * Tracks per-step status so retries skip already-succeeded steps.
 * @param {UseStepExecutorProps} props - Configuration for the executor
 * @returns {UseStepExecutorReturn} Executor methods and state
 */
export const useStepExecutor = ({
	stepConfig,
	sharedState,
	userId,
	cspId,
	onComplete,
	onError,
}: UseStepExecutorProps): UseStepExecutorReturn => {
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();

	const [pipelineState, setPipelineState] = useState<PipelineState>({});
	const [isExecuting, setIsExecuting] = useState(false);

	/**
	 * Inject state values into form data based on preSubmit config
	 */
	const injectStateValues = useCallback(
		(formData: Record<string, any>): Record<string, any> => {
			const result = { ...formData };
			const injectConfig = stepConfig.preSubmit?.inject;

			if (!injectConfig) return result;

			for (const [targetField, sourcePath] of Object.entries(
				injectConfig
			)) {
				// Parse source path like "state.latLong"
				const value = getValueByPath(sharedState, sourcePath);
				if (value !== undefined) {
					result[targetField] = value;
				}
			}

			return result;
		},
		[stepConfig.preSubmit?.inject, sharedState]
	);

	/**
	 * Check if a value is file data (File instance or object with fileData property)
	 * @param {any} value - Value to check
	 * @returns {boolean} True if the value is file data
	 */
	const isFileData = useCallback((value: unknown): boolean => {
		if (value instanceof File) return true;
		if (
			value &&
			typeof value === "object" &&
			"fileData" in (value as Record<string, unknown>)
		) {
			return true;
		}
		return false;
	}, []);

	/**
	 * Filter out file data from form data for form submissions.
	 * Files cannot be sent as JSON in form calls - they must use upload calls.
	 * @param {Record<string, any>} data - Form data to filter
	 * @returns {Record<string, any>} Form data without file fields
	 */
	const filterFileData = useCallback(
		(data: Record<string, unknown>): Record<string, unknown> => {
			const result: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(data)) {
				if (!isFileData(value)) {
					result[key] = value;
				}
			}
			return result;
		},
		[isFileData]
	);

	/**
	 * Execute a single form submission API call
	 */
	const executeFormCall = useCallback(
		async (
			pipelineStep: ApiPipelineStep,
			formData: Record<string, any>
		): Promise<ApiCallResult> => {
			try {
				// Filter out file data - files cannot be sent as JSON
				const filteredFormData = filterFileData(formData);

				const response = await fetcher(
					process.env.NEXT_PUBLIC_API_BASE_URL +
						Endpoints.TRANSACTION,
					{
						token: accessToken,
						body: {
							interaction_type_id: pipelineStep.interactionTypeId,
							user_id: userId,
							csp_id: cspId,
							...filteredFormData,
						},
						timeout: 30000,
					},
					generateNewToken
				);

				const success =
					(response?.status === 0 ||
						response?.response_type_id === 0) &&
					!(Object.keys(response?.invalid_params || {}).length > 0);

				return { success, response };
			} catch (error) {
				return { success: false, error };
			}
		},
		[accessToken, userId, cspId, generateNewToken, filterFileData]
	);

	/**
	 * Execute a file upload API call
	 */
	const executeUploadCall = useCallback(
		async (
			pipelineStep: ApiPipelineStep,
			formData: Record<string, any>
		): Promise<ApiCallResult> => {
			try {
				// Build FormData for file upload
				const uploadFormData = new FormData();
				uploadFormData.append("user_id", userId);
				uploadFormData.append("csp_id", cspId);
				uploadFormData.append("doc_type", String(pipelineStep.docType));

				const fileKeyMapping = pipelineStep.fileKeyMapping || {};
				let fileIndex = 1;

				// Append files and other form data
				for (const [key, value] of Object.entries(formData)) {
					// Handle file data objects (e.g., { url, fileData })
					if (
						value &&
						typeof value === "object" &&
						"fileData" in value &&
						value.fileData instanceof File
					) {
						const mappedKey =
							fileKeyMapping[key] || `file${fileIndex++}`;
						uploadFormData.append(mappedKey, value.fileData);
					}
					// Handle direct File instances
					else if (value instanceof File) {
						const mappedKey =
							fileKeyMapping[key] || `file${fileIndex++}`;
						uploadFormData.append(mappedKey, value);
					}
				}

				const response = await fetcher(
					process.env.NEXT_PUBLIC_API_BASE_URL +
						Endpoints.FILE_UPLOAD,
					{
						token: accessToken,
						body: uploadFormData,
						isMultipart: true,
						timeout: 60000,
					},
					generateNewToken
				);

				const success =
					response?.status === 0 || response?.response_type_id === 0;

				return { success, response };
			} catch (error) {
				return { success: false, error };
			}
		},
		[accessToken, userId, cspId, generateNewToken]
	);

	/**
	 * Execute the full pipeline with smart retry support
	 */
	const execute = useCallback(
		async (
			_formData: StepFormData,
			_existingPipelineState: PipelineState = {}
		): Promise<PipelineState> => {
			const pipeline = stepConfig.api?.pipeline;
			if (!pipeline || pipeline.length === 0) {
				console.warn(
					"[useStepExecutor] No pipeline configured for step:",
					stepConfig.name
				);
				return _existingPipelineState;
			}

			setIsExecuting(true);
			const state: PipelineState = { ..._existingPipelineState };

			// Inject state values into form data
			const enrichedFormData = injectStateValues(_formData.form_data);

			for (const pipelineStep of pipeline) {
				// SKIP already succeeded steps (smart retry)
				if (state[pipelineStep.id]?.status === "success") {
					console.log(
						`[Pipeline] Skipping ${pipelineStep.id} — already succeeded`
					);
					continue;
				}

				// CHECK dependency — if dependency failed or not succeeded, stop
				if (
					pipelineStep.dependsOn &&
					state[pipelineStep.dependsOn]?.status !== "success"
				) {
					console.log(
						`[Pipeline] Stopping — dependency ${pipelineStep.dependsOn} not successful`
					);
					break;
				}

				// EXECUTE this step
				console.log(`[Pipeline] Executing ${pipelineStep.id}...`);
				let result: ApiCallResult;

				if (pipelineStep.type === "form") {
					result = await executeFormCall(
						pipelineStep,
						enrichedFormData
					);
				} else if (pipelineStep.type === "upload") {
					result = await executeUploadCall(
						pipelineStep,
						enrichedFormData
					);
				} else {
					console.error(
						`[Pipeline] Unknown type: ${pipelineStep.type}`
					);
					result = {
						success: false,
						error: "Unknown pipeline step type",
					};
				}

				// Update state
				state[pipelineStep.id] = {
					status: result.success ? "success" : "failed",
					response: result.response || result.error,
				};

				// Show toast
				if (result.success) {
					// toast({ title: _formData.success_message || "Success", status: "success", duration: 2000 });
					console.log(
						`Success: ${_formData.success_message || "Success"}`
					);
				} else {
					// toast({ title: error_message, status: "error", duration: 3000 });
					console.error(
						result.response?.message ||
							result.error?.message ||
							"Something went wrong"
					);
				}

				// STOP if this step failed and has continueOnSuccess flag
				if (!result.success && pipelineStep.continueOnSuccess) {
					console.log(
						`[Pipeline] Stopping — ${pipelineStep.id} failed`
					);
					break;
				}
			}

			setPipelineState(state);
			setIsExecuting(false);

			// Check if entire pipeline succeeded
			const allSucceeded = pipeline.every(
				(step) => state[step.id]?.status === "success"
			);

			if (allSucceeded) {
				const lastResponse =
					state[pipeline[pipeline.length - 1].id]?.response;
				if (onComplete) onComplete(lastResponse);
			} else {
				// Find the first failed step
				const failedStep = pipeline.find(
					(step) => state[step.id]?.status === "failed"
				);
				if (onError) {
					onError(
						failedStep
							? state[failedStep.id]?.response
							: "Pipeline failed"
					);
				}
			}

			return state;
		},
		[
			stepConfig.api?.pipeline,
			stepConfig.name,
			injectStateValues,
			executeFormCall,
			executeUploadCall,
			onComplete,
			onError,
		]
	);

	return {
		execute,
		pipelineState,
		isExecuting,
	};
};

/**
 * Get a value from an object by dot-notation path
 * @param {object} obj - Source object
 * @param {string} path - Dot-notation path (e.g., "state.latLong")
 * @returns {any} Value at path or undefined
 */
function getValueByPath(obj: any, path: unknown): any {
	// Guard against non-string paths
	if (typeof path !== "string") {
		console.warn(
			"[getValueByPath] Expected string path, received:",
			typeof path,
			path
		);
		return undefined;
	}
	// Remove "state." prefix if present (since we're already passing the state object)
	const cleanPath = path.replace(/^state\./, "");
	return cleanPath.split(".").reduce((acc, key) => acc?.[key], obj);
}
