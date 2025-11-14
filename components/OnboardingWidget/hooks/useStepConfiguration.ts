import {
	filterOnboardingStepsByRoles,
	masterOnboardingSteps,
	type OnboardingStep,
} from "constants/OnboardingSteps";
import { useCallback } from "react";
import { type UnifiedUserData } from "../utils";

/**
 * Session storage key for onboarding step states
 */
const ONBOARDING_STEPS_STORAGE_KEY = "onboarding_steps_state";

/**
 * Saves step states to session storage for persistence across page refreshes
 * @param {OnboardingStep[]} steps - Steps to save
 * @param {string} userIdentifier - User mobile or identifier for cache validation
 * @returns {void}
 */
const saveStepsToSessionStorage = (
	steps: OnboardingStep[],
	userIdentifier: string
): void => {
	if (!userIdentifier) return;

	try {
		const stateToSave = {
			steps: steps.map((s) => ({
				id: s.id,
				name: s.name,
				stepStatus: s.stepStatus,
			})),
			lastUpdated: Date.now(),
			userIdentifier,
		};
		sessionStorage.setItem(
			ONBOARDING_STEPS_STORAGE_KEY,
			JSON.stringify(stateToSave)
		);
		console.log("[StepConfiguration] Saved step states to session storage");
	} catch (error) {
		console.error(
			"[StepConfiguration] Failed to save to session storage:",
			error
		);
	}
};

/**
 * Loads step states from session storage
 * @param {string} userIdentifier - User mobile or identifier for cache validation
 * @returns {Map<number, number>} Map of step ID to step status
 */
const loadStepsFromSessionStorage = (
	userIdentifier: string
): Map<number, number> => {
	const statusMap = new Map<number, number>();

	if (!userIdentifier) return statusMap;

	try {
		const stored = sessionStorage.getItem(ONBOARDING_STEPS_STORAGE_KEY);
		if (!stored) return statusMap;

		const parsed = JSON.parse(stored);

		// Validate cache: check user identifier matches
		if (parsed.userIdentifier !== userIdentifier) {
			console.log(
				"[StepConfiguration] Session storage cache invalid: different user"
			);
			sessionStorage.removeItem(ONBOARDING_STEPS_STORAGE_KEY);
			return statusMap;
		}

		// Validate cache age: only use if less than 24 hours old
		const age = Date.now() - (parsed.lastUpdated || 0);
		if (age > 24 * 60 * 60 * 1000) {
			console.log("[StepConfiguration] Session storage cache expired");
			sessionStorage.removeItem(ONBOARDING_STEPS_STORAGE_KEY);
			return statusMap;
		}

		// Build map of step ID -> status
		if (Array.isArray(parsed.steps)) {
			parsed.steps.forEach((step: { id: number; stepStatus: number }) => {
				if (step.id && typeof step.stepStatus === "number") {
					statusMap.set(step.id, step.stepStatus);
				}
			});
			console.log(
				"[StepConfiguration] Loaded step states from session storage"
			);
		}

		return statusMap;
	} catch (error) {
		console.error(
			"[StepConfiguration] Failed to load from session storage:",
			error
		);
		return statusMap;
	}
};

/**
 * Step configuration from metadata
 */
interface StepConfig {
	hide: 0 | 1;
	optional: 0 | 1;
	meta?: {
		reason?: string;
		[key: string]: any;
	};
}

/**
 * Metadata configuration structure for onboarding
 */
interface OnboardingMetadata {
	[userType: string]: {
		[stepKey: string]: StepConfig;
	};
}

/**
 * Result of extracting disabled and skippable steps
 */
interface ExtractedStepConfig {
	disabledSteps: number[] | undefined;
	skippableSteps: number[] | undefined;
}

/**
 * Creates a lookup map for fast O(1) step access by name or ID
 * @param {OnboardingStep[]} steps - Master list of steps
 * @returns {Map} Map with step name and ID as keys
 */
export const createStepLookupMap = (
	steps: OnboardingStep[]
): Map<string, OnboardingStep> => {
	const lookupMap = new Map<string, OnboardingStep>();
	steps.forEach((step) => {
		lookupMap.set(step.name, step);
		lookupMap.set(step.id.toString(), step);
	});
	return lookupMap;
};

/**
 * Extracts disabled and skippable steps from metadata for a specific user type
 * @param {OnboardingMetadata} onboardingConfig - Metadata configuration
 * @param {number} userType - User type (1=Distributor, 2=Retailer/Merchant, 3=Retailer/Merchant)
 * @param {Map<string, OnboardingStep>} stepLookupMap - Pre-built lookup map for O(1) access
 * @returns {ExtractedStepConfig} Arrays of disabled and skippable step IDs
 */
export const extractStepConfiguration = (
	onboardingConfig: OnboardingMetadata | undefined,
	userType: number | undefined,
	stepLookupMap: Map<string, OnboardingStep>
): ExtractedStepConfig => {
	// Early return if no config or userType
	if (!onboardingConfig || !userType) {
		return { disabledSteps: undefined, skippableSteps: undefined };
	}

	// Normalize user type: treat type 3 (Independent Retailer/Merchant & Retailer/Merchant during onboarding) as type 2
	const normalizedUserType = userType === 3 ? 2 : userType;

	// Get config for current userType
	const userTypeConfig = onboardingConfig[normalizedUserType.toString()];
	if (!userTypeConfig) {
		return { disabledSteps: undefined, skippableSteps: undefined };
	}

	const disabled: number[] = [];
	const skippable: number[] = [];

	// Process each step configuration
	Object.entries(userTypeConfig).forEach(([stepKey, config]) => {
		if (!config || typeof config !== "object") return;

		// O(1) lookup using pre-built map
		const matchingStep = stepLookupMap.get(stepKey);

		if (!matchingStep) {
			console.warn(
				`[StepConfiguration] No step found for key: ${stepKey}`
			);
			return;
		}

		// hide takes precedence over optional
		if (config.hide === 1) {
			disabled.push(matchingStep.id);
			console.log(
				`[StepConfiguration] Step disabled: ${matchingStep.name} (ID: ${matchingStep.id})${config.meta?.reason ? ` - ${config.meta.reason}` : ""}`
			);
		} else if (config.optional === 1) {
			skippable.push(matchingStep.id);
			console.log(
				`[StepConfiguration] Step skippable: ${matchingStep.name} (ID: ${matchingStep.id})${config.meta?.reason ? ` - ${config.meta.reason}` : ""}`
			);
		}
	});

	return {
		disabledSteps: disabled.length > 0 ? disabled : undefined,
		skippableSteps: skippable.length > 0 ? skippable : undefined,
	};
};

/**
 * Gets the appropriate step data based on user type
 * Returns the master list of all steps - filtering happens via API roles
 * @param {number} userType - The user type identifier (validated but not used for step selection)
 * @returns {OnboardingStep[]} Master list of all onboarding steps
 */
const getStepsForUserType = (userType: number): OnboardingStep[] => {
	// Return master list for all user types
	// API-driven filtering happens in filterOnboardingStepsByRoles
	if (userType === undefined || userType === null) {
		console.warn(`No user type provided`);
		return [];
	}
	return masterOnboardingSteps;
};

/**
 * Filters out disabled steps based on org metadata configuration
 * @param {OnboardingStep[]} steps - Steps to filter
 * @param {number[]} [disabledSteps] - Array of step IDs to exclude
 * @returns {OnboardingStep[]} Steps with disabled ones removed
 */
const filterDisabledSteps = (
	steps: OnboardingStep[],
	disabledSteps?: number[]
): OnboardingStep[] => {
	if (!disabledSteps || disabledSteps.length === 0) {
		return steps;
	}

	const filteredSteps = steps.filter((step) => {
		const isDisabled = disabledSteps.includes(step.id);
		if (isDisabled) {
			console.log(
				`[StepConfiguration] Filtering out disabled step: ${step.name} (ID: ${step.id})`
			);
		}
		return !isDisabled;
	});

	return filteredSteps;
};

/**
 * Marks steps as skippable (isRequired = false) based on org metadata configuration
 * @param {OnboardingStep[]} steps - Steps to process
 * @param {number[]} [skippableSteps] - Array of step IDs that should be marked as skippable
 * @returns {OnboardingStep[]} Steps with isRequired updated for skippable ones
 */
const applySkippableSteps = (
	steps: OnboardingStep[],
	skippableSteps?: number[]
): OnboardingStep[] => {
	if (!skippableSteps || skippableSteps.length === 0) {
		return steps;
	}

	return steps.map((step) => {
		const isSkippable = skippableSteps.includes(step.id);
		if (isSkippable) {
			console.log(
				`[StepConfiguration] Marking step as skippable: ${step.name} (ID: ${step.id})`
			);
			return {
				...step,
				isRequired: false,
			};
		}
		return step;
	});
};

/**
 * Applies the filter chain to onboarding steps
 * Filter order: 1) Visibility filtering, 2) Role-based filtering, 3) Disabled steps filtering, 4) Skippable steps marking
 * @param {OnboardingStep[]} baseStepData - Master list of all steps
 * @param {Array<{ role: number; label?: string }>} onboardingSteps - API onboarding steps with roles
 * @param {number[]} [disabledSteps] - Array of step IDs to exclude from org metadata
 * @param {number[]} [skippableSteps] - Array of step IDs to mark as skippable (isRequired=false)
 * @returns {OnboardingStep[]} Filtered and configured steps (without status assignment)
 */
const applyStepFilters = (
	baseStepData: OnboardingStep[],
	onboardingSteps: Array<{ role: number; label?: string }>,
	disabledSteps?: number[],
	skippableSteps?: number[]
): OnboardingStep[] => {
	// Filter 1: Visibility filtering - Remove steps with isVisible=false (highest precedence)
	let filteredSteps = baseStepData.filter((step) => {
		if (step.isVisible === false) {
			console.log(
				`[StepConfiguration] Filtering out invisible step: ${step.name} (ID: ${step.id})`
			);
			return false;
		}
		return true;
	});

	// Filter 2: Role-based filtering (API-driven)
	filteredSteps = filterOnboardingStepsByRoles(
		filteredSteps,
		onboardingSteps
	);

	// Filter 3: Disabled steps filtering (org metadata-driven)
	filteredSteps = filterDisabledSteps(filteredSteps, disabledSteps);

	// Filter 4: Skippable steps marking (org metadata-driven)
	filteredSteps = applySkippableSteps(filteredSteps, skippableSteps);

	return filteredSteps;
};

/**
 * Applies resume logic to set step completion status based on roleList
 * Logic:
 * - roleList contains PENDING roles (roles that still need to be completed)
 * - Find the first step whose role appears in roleList (first incomplete step)
 * - Mark all steps before as completed (3)
 * - Mark the current step as pending (1)
 * - Mark all steps after as not started (0)
 * @param {OnboardingStep[]} steps - Filtered steps to apply status to
 * @param {Array<number> | string} [roleList] - Comma-separated string or array of PENDING role IDs
 * @returns {OnboardingStep[]} Steps with status assigned based on roleList
 */
const applyResumeLogic = (
	steps: OnboardingStep[],
	roleList?: Array<number> | string
): OnboardingStep[] => {
	if (!roleList) {
		return steps;
	}

	let _currentRoleIndex = -1;

	// Convert roleList to array of numbers
	const roleArray = Array.isArray(roleList)
		? roleList
		: roleList.split(",").map(Number);

	console.log(
		"[applyResumeLogic] roleList (pending roles from API):",
		roleArray
	);

	// Find the first step whose role matches any in pending roleList
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		if (roleArray.includes(step.role)) {
			_currentRoleIndex = i;
			console.log(
				`[applyResumeLogic] Found first pending step from API at index ${i}: ${step.name} (role: ${step.role})`
			);
			break;
		}
	}

	// Assign step status based on current role index (immutable)
	return steps.map((step, index) => ({
		...step,
		stepStatus:
			index < _currentRoleIndex
				? 3 // completed
				: index === _currentRoleIndex
					? 1 // pending
					: 0, // not started
	}));
};

/**
 * Merges step states from session storage with API-derived states
 * Session storage takes precedence for completed/skipped steps to handle:
 * - Multiple steps sharing the same role
 * - Preserving skip states across refreshes
 * @param {OnboardingStep[]} apiSteps - Steps with status from API roleList
 * @param {Map<number, number>} cachedStates - Cached step states from session storage
 * @returns {OnboardingStep[]} Steps with merged status
 */
const mergeWithCachedStates = (
	apiSteps: OnboardingStep[],
	cachedStates: Map<number, number>
): OnboardingStep[] => {
	if (cachedStates.size === 0) {
		console.log(
			"[mergeWithCachedStates] No cached states, using API states"
		);
		return apiSteps;
	}

	console.log(
		"[mergeWithCachedStates] Merging session storage with API states"
	);

	return apiSteps.map((step) => {
		const cachedStatus = cachedStates.get(step.id);

		// If step is completed (3) or skipped (4) in cache, preserve that status
		// This handles cases where multiple steps share the same role
		if (cachedStatus === 3 || cachedStatus === 4) {
			console.log(
				`[mergeWithCachedStates] Using cached status for ${step.name}: ${cachedStatus}`
			);
			return {
				...step,
				stepStatus: cachedStatus,
			};
		}

		// Otherwise, use API-derived status
		return step;
	});
};

/**
 * Onboarding actions interface for step configuration
 */
interface OnboardingActions {
	setStepperData: (_data: OnboardingStep[]) => void;
}

/**
 * Props for useStepConfiguration hook
 */
interface UseStepConfigurationProps {
	actions: OnboardingActions;
	userType: number;
	onboardingSteps: Array<{ role: number; label?: string }>;
	roleList?: Array<number> | string;
	disabledSteps?: number[];
	skippableSteps?: number[];
	userIdentifier?: string; // Mobile number or user ID for session storage validation
}

/**
 * Return type for useStepConfiguration hook
 */
interface UseStepConfigurationReturn {
	initializeSteps: (_userData: UnifiedUserData) => void;
	updateStepStates: (_steps: OnboardingStep[]) => void;
}

/**
 * Custom hook for handling onboarding step configuration
 * Manages step setup based on user type for both normal and assisted onboarding flows
 * @param {UseStepConfigurationProps} props - Configuration object for the hook
 * @param {OnboardingActions} props.actions - State management actions for updating step data
 * @returns {UseStepConfigurationReturn} Object containing step configuration methods
 */
export const useStepConfiguration = ({
	actions,
	userType,
	onboardingSteps,
	roleList,
	disabledSteps,
	skippableSteps,
	userIdentifier,
}: UseStepConfigurationProps): UseStepConfigurationReturn => {
	/**
	 * Initializes onboarding steps based on user data
	 * Applies filter chain: 1) Role-based, 2) Disabled steps, 3) Skippable steps, 4) Resume logic, 5) Session storage merge
	 */
	const initializeSteps = useCallback(
		(userData) => {
			console.log(
				"[StepConfiguration] Initializing steps for userData:",
				userData
			);

			// Validate user type
			if (!userType) {
				console.warn(
					"[StepConfiguration] No user type found in userData"
				);
				return;
			}

			// Get base step data (master list)
			const baseStepData = getStepsForUserType(userType);
			if (baseStepData.length === 0) {
				console.warn(
					"[StepConfiguration] No base step data found for user type:",
					userType
				);
				return;
			}

			// Validate onboarding steps from API
			if (!onboardingSteps || onboardingSteps.length === 0) {
				console.warn("[StepConfiguration] No onboarding steps found");
				return;
			}

			// Apply filter chain:
			// 1. Role-based filtering (API-driven)
			// 2. Disabled steps filtering (org metadata-driven)
			// 3. Skippable steps marking (org metadata-driven)
			let filteredSteps = applyStepFilters(
				baseStepData,
				onboardingSteps,
				disabledSteps,
				skippableSteps
			);

			// Apply resume logic: Set step completion status based on roleList from API
			filteredSteps = applyResumeLogic(filteredSteps, roleList);

			// Load cached step states from session storage
			const cachedStates = loadStepsFromSessionStorage(
				userIdentifier || ""
			);

			// Merge cached states with API states
			// This handles multiple steps with same role and preserves skip states
			filteredSteps = mergeWithCachedStates(filteredSteps, cachedStates);

			console.log(
				"[StepConfiguration] Final filtered steps after merge:",
				filteredSteps.map((s) => ({
					id: s.id,
					name: s.name,
					status: s.stepStatus,
					isRequired: s.isRequired,
				}))
			);

			// Set the stepper data with filtered steps
			// Create a new array to prevent reference issues
			actions.setStepperData([...filteredSteps]);

			// Save to session storage for future refreshes
			saveStepsToSessionStorage(filteredSteps, userIdentifier || "");
		},
		[
			actions,
			userType,
			onboardingSteps,
			roleList,
			disabledSteps,
			skippableSteps,
			userIdentifier,
		]
	);

	/**
	 * Updates step status and persists to session storage
	 * Call this after any step status change (complete, skip, etc.)
	 * @param {OnboardingStep[]} steps - Updated steps array
	 */
	const updateStepStates = useCallback(
		(steps: OnboardingStep[]) => {
			actions.setStepperData([...steps]);
			saveStepsToSessionStorage(steps, userIdentifier || "");
			console.log(
				"[StepConfiguration] Updated and saved step states to session storage"
			);
		},
		[actions, userIdentifier]
	);

	return {
		initializeSteps,
		updateStepStates,
	};
};
