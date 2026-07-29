/**
 * stepGenerator.ts — Pure functions for onboarding step initialization
 *
 * This module contains ALL the logic for building the initial step list.
 * Every function here is a pure function (no side effects, no hooks, no state).
 *
 * ## Pipeline order (executed by `generateInitialSteps`):
 *   1. Visibility filter — removes steps with `isVisible: false`
 *   2. Role-based filter — keeps only steps matching the API-provided `onboardingSteps` roles
 *   3. Disabled filter — removes steps disabled by org metadata (`hide: 1`)
 *   4. Skippable marking — marks steps as optional per org metadata (`optional: 1`)
 *   5. Custom config merge — overrides `label`/`description` and attaches `orgConfig.props` from org metadata `meta`
 *   6. Resume logic — sets COMPLETED/IN_PROGRESS/NOT_STARTED based on `roleList`
 *
 * ## How to add a new filter stage:
 *   1. Create a pure function: `(steps: OnboardingStep[], ...args) => OnboardingStep[]`
 *   2. Add it to the pipeline inside `generateInitialSteps` at the appropriate position
 *   3. Pass any new parameters through the `generateInitialSteps` args object
 *   4. Update `OnboardingProvider.initializeSteps` to pass the new parameter
 *
 * ## How to add new step metadata:
 *   1. Add the field to `OnboardingStep` type in `constants/`
 *   2. Set it in `masterOnboardingSteps` for each step that needs it
 *   3. Optionally add a filter/transform stage here if the metadata drives runtime behavior
 */
import {
	masterOnboardingSteps,
	ONBOARDING_STEP_STATUS,
	type OnboardingStep,
} from "../constants";

/**
 * `meta` block of a per-step org config entry.
 * - `reason`: developer-facing note, logged only.
 * - `label`: overrides the step's native `label` (title + stepper). Org wins over
 *   the backend API label.
 * - `description`: overrides the step's native `description` (shown under the title).
 * - `props`: generic flag bag forwarded to the step component (each component
 *   reads only the keys it whitelists).
 */
export interface StepMetadataConfig {
	reason?: string;
	label?: string;
	description?: string;
	props?: Record<string, unknown>;
	[key: string]: unknown;
}

/**
 * Step configuration from metadata
 */
interface StepConfig {
	hide: 0 | 1;
	optional: 0 | 1;
	meta?: StepMetadataConfig;
}

/**
 * Per-step overrides distilled from `meta`. `label`/`description` override the step's
 * top-level fields; `props` is attached as `OnboardingStep.orgConfig.props`.
 */
export interface StepOrgConfig {
	label?: string;
	description?: string;
	props?: Record<string, unknown>;
}

/**
 * Filters step data based on onboarding step roles and sorts by API order.
 *
 * IMPORTANT: This function preserves the order from the API's onboarding_steps,
 * NOT the master list order. This ensures the UI step order matches the backend's
 * expected progression, preventing status synchronization bugs.
 * @param {OnboardingStep[]} stepData - Array of all possible onboarding steps
 * @param {Array<{ role: number; label?: string }>} onboardingSteps - Array of onboarding step configurations with roles from API
 * @returns {OnboardingStep[]} Filtered and sorted array of onboarding steps relevant to the user's roles
 */
export const filterOnboardingStepsByRoles = (
	stepData: OnboardingStep[],
	onboardingSteps: Array<{ role: number; label?: string }>
): OnboardingStep[] => {
	// Create a role-to-index map for sorting based on API order
	const roleOrderMap = new Map<number, number>();
	onboardingSteps?.forEach((step, index) => {
		roleOrderMap.set(step.role, index);
	});

	// Filter steps based on applicableRoles array and map the dynamic label from the API
	const filteredSteps = stepData.reduce((acc, step) => {
		// Find the matching API role configuration
		const matchingApiStep = onboardingSteps?.find((apiStep) =>
			step.applicableRoles?.includes(apiStep.role)
		);

		if (matchingApiStep) {
			acc.push({
				...step,
				// Overwrite the static label with the dynamic API label if it exists
				label: matchingApiStep.label || step.label,
			});
		}
		return acc;
	}, [] as OnboardingStep[]);

	// Sort by API order (using the first matching applicable role's position)
	// Steps with the same role maintain their relative master list order (stable sort)
	return filteredSteps.sort((a, b) => {
		const aIndex = Math.min(
			...(a.applicableRoles
				?.map((role) => roleOrderMap.get(role) ?? Infinity)
				.filter((idx) => idx !== Infinity) ?? [Infinity])
		);
		const bIndex = Math.min(
			...(b.applicableRoles
				?.map((role) => roleOrderMap.get(role) ?? Infinity)
				.filter((idx) => idx !== Infinity) ?? [Infinity])
		);
		return aIndex - bIndex;
	});
};

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
export interface ExtractedStepConfig {
	disabledSteps: number[] | undefined;
	skippableSteps: number[] | undefined;
	/** Map of step ID → per-step overrides (label/description/props) from `meta`. */
	stepOrgConfig: Map<number, StepOrgConfig> | undefined;
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
		return {
			disabledSteps: undefined,
			skippableSteps: undefined,
			stepOrgConfig: undefined,
		};
	}

	// Normalize user type: treat type 3 (Independent Retailer/Merchant & Retailer/Merchant during onboarding) as type 2
	const normalizedUserType = userType === 3 ? 2 : userType;

	// Get config for current userType
	const userTypeConfig = onboardingConfig[normalizedUserType.toString()];
	if (!userTypeConfig) {
		return {
			disabledSteps: undefined,
			skippableSteps: undefined,
			stepOrgConfig: undefined,
		};
	}

	const disabled: number[] = [];
	const skippable: number[] = [];
	const orgConfigMap = new Map<number, StepOrgConfig>();

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

		// Collect per-step overrides (independent of hide/optional):
		// label/description override the step's native fields; props is a flag bag.
		const { label, description, props } = config.meta ?? {};
		if (
			label !== undefined ||
			description !== undefined ||
			props !== undefined
		) {
			orgConfigMap.set(matchingStep.id, { label, description, props });
		}
	});

	return {
		disabledSteps: disabled.length > 0 ? disabled : undefined,
		skippableSteps: skippable.length > 0 ? skippable : undefined,
		stepOrgConfig: orgConfigMap.size > 0 ? orgConfigMap : undefined,
	};
};

/**
 * Filters out disabled steps based on org metadata configuration
 * @param {OnboardingStep[]} steps - Steps to filter
 * @param {number[]} [disabledSteps] - Array of step IDs to exclude
 * @returns {OnboardingStep[]} Steps with disabled ones removed
 */
export const filterDisabledStepsHelper = (
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
export const applySkippableStepsHelper = (
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
 * Applies per-step org overrides (from org metadata `meta`) onto matching steps:
 * `label`/`description` override the step's top-level fields (uniformly picked up by every
 * renderer and the stepper); `props` is attached as `step.orgConfig.props`. Never removes
 * a step. `label`/`description` are applied only when a non-empty string, so a malformed
 * config cannot blank the step title or stepper.
 * @param {OnboardingStep[]} steps - Steps to process
 * @param {Map<number, StepOrgConfig>} [stepOrgConfig] - Map of step ID → overrides
 * @returns {OnboardingStep[]} Steps with label/description overridden and `orgConfig` attached where configured
 */
export const applyStepOrgConfigHelper = (
	steps: OnboardingStep[],
	stepOrgConfig?: Map<number, StepOrgConfig>
): OnboardingStep[] => {
	if (!stepOrgConfig || stepOrgConfig.size === 0) {
		return steps;
	}

	const isNonEmptyString = (value: unknown): value is string =>
		typeof value === "string" && value.trim() !== "";

	return steps.map((step) => {
		const override = stepOrgConfig.get(step.id);
		if (!override) return step;

		const { label, description, props } = override;

		console.log(
			`[StepConfiguration] Applying org overrides to step: ${step.name} (ID: ${step.id})`,
			{ label, description, props }
		);

		return {
			...step,
			...(isNonEmptyString(label) ? { label } : {}),
			...(isNonEmptyString(description) ? { description } : {}),
			// Preserve any existing orgConfig keys while (re)setting props.
			...(props !== undefined
				? { orgConfig: { ...step.orgConfig, props } }
				: {}),
		};
	});
};

/**
 * Pure function: applies resume logic to set step completion status based on roleList
 * @param {OnboardingStep[]} steps - Filtered steps to apply status to
 * @param {Array<number> | string} [roleList] - Comma-separated string or array of PENDING role IDs
 * @returns {OnboardingStep[]} Steps with status assigned based on roleList
 */
export const calculateResumeState = (
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
		"[calculateResumeState] roleList (pending roles from API):",
		roleArray
	);

	// Find the first step whose role matches any in pending roleList
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];

		// Check if any of the step's applicable roles match the pending role list
		const isMatchingStep = step.applicableRoles?.some((r) =>
			roleArray.includes(r)
		);

		if (isMatchingStep) {
			_currentRoleIndex = i;
			console.log(
				`[calculateResumeState] Found first pending step from API at index ${i}: ${step.name} (applicableRoles: ${step.applicableRoles})`
			);
			break;
		}
	}

	// Assign step status based on current role index (immutable)
	return steps.map((step, index) => ({
		...step,
		stepStatus:
			index < _currentRoleIndex
				? ONBOARDING_STEP_STATUS.COMPLETED
				: index === _currentRoleIndex
					? ONBOARDING_STEP_STATUS.IN_PROGRESS
					: ONBOARDING_STEP_STATUS.NOT_STARTED,
	}));
};

/**
 * Pure function: generate the initial onboarding steps array.
 *
 * Runs the full filter + status pipeline in order:
 * visibility → role-based → disabled → skippable → resume logic
 *
 * This is called ONCE by `OnboardingProvider.initializeSteps()` when user data loads.
 * The result is stored in `state.stepperData`.
 * @param {object} args
 * @param {OnboardingStep[]} [args.baseStepData] - Master step list to start from
 * @param {Array<{role: number; label?: string}>} args.onboardingSteps - API-provided roles for this user
 * @param {Array<number> | string} [args.roleList] - Pending roles from API (drives resume logic)
 * @param {number[]} [args.disabledSteps] - Step IDs to remove (from org metadata `hide: 1`)
 * @param {number[]} [args.skippableSteps] - Step IDs to mark optional (from org metadata `optional: 1`)
 * @param {Map<number, StepOrgConfig>} [args.stepOrgConfig] - Step ID → per-step overrides (label/description/props) from org metadata `meta`
 * @returns {OnboardingStep[]} Fully filtered and status-initialized steps, ready for rendering
 */
export const generateInitialSteps = ({
	baseStepData = masterOnboardingSteps,
	onboardingSteps,
	roleList,
	disabledSteps,
	skippableSteps,
	stepOrgConfig,
}: {
	baseStepData?: OnboardingStep[];
	onboardingSteps: Array<{ role: number; label?: string }>;
	roleList?: Array<number> | string;
	disabledSteps?: number[];
	skippableSteps?: number[];
	stepOrgConfig?: Map<number, StepOrgConfig>;
}): OnboardingStep[] => {
	// Filter 1: Visibility filtering - Remove steps with isVisible=false (highest precedence)
	let filteredSteps = baseStepData.filter((step) => {
		if (step.isVisible === false) {
			console.log(
				`[generateInitialSteps] Filtering out invisible step: ${step.name} (ID: ${step.id})`
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
	filteredSteps = filterDisabledStepsHelper(filteredSteps, disabledSteps);

	// Filter 4: Skippable steps marking (org metadata-driven)
	filteredSteps = applySkippableStepsHelper(filteredSteps, skippableSteps);

	// Filter 5: Custom config merge (org metadata-driven) — override label/description
	// and attach orgConfig.props. Runs before resume so later stages (which clone via
	// spread) preserve the overrides.
	filteredSteps = applyStepOrgConfigHelper(filteredSteps, stepOrgConfig);

	// Filter 6: Resume logic
	filteredSteps = calculateResumeState(filteredSteps, roleList);

	return filteredSteps;
};
