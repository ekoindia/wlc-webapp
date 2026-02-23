import { useOrgDetailContext } from "contexts";
import { useEffect, useMemo } from "react";
import { OnboardingProvider, useOnboardingContext } from "../context";
import {
	getAgreementIdFromData,
	getMobileFromData,
	getOnboardingStepsFromData,
	getRoleListFromData,
	getUserNameFromData,
	getUserTypeFromData,
} from "../utils";
import ContentRenderer from "./ContentRenderer";
import OnboardingLayout from "./OnboardingLayout";

/**
 * OnboardingStepsContent — Thin Renderer
 *
 * This component is intentionally minimal. It delegates ALL orchestration
 * (step initialization, submission, navigation, skipping) to the Fat Context
 * (`OnboardingProvider` via `useOnboardingContext`).
 *
 * Responsibilities:
 * - Sets initial geolocation in state (if pre-fetched by parent)
 * - Triggers `initializeSteps()` when user details become available
 * - Renders `OnboardingLayout` + `ContentRenderer`, passing context methods as props
 *
 * If you need to add new business logic, add it to `OnboardingProvider` instead.
 * This component should stay under ~80 lines.
 * @param root0
 * @param root0.isAssistedOnboarding
 * @param root0.userData
 * @param root0.assistedAgentDetails
 * @param root0.initialLatLong
 */
const OnboardingStepsContent = ({
	isAssistedOnboarding,
	userData,
	assistedAgentDetails,
	initialLatLong,
}: {
	isAssistedOnboarding: boolean;
	userData: any;
	assistedAgentDetails?: any;
	initialLatLong?: string;
}) => {
	const {
		state,
		actions,
		currentStepId,
		currentStepConfig,
		initializeSteps,
		advanceToNextStep,
		handleSkip,
		handleSubmit,
	} = useOnboardingContext();

	console.log("[OnboardingStepsContent]", state);

	// Set initial location in state if provided (fetched early by parent)
	useEffect(() => {
		if (initialLatLong && !state.latLong) {
			actions.setLocation(initialLatLong);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialLatLong]);

	// Determine the user details to use for onboarding
	const onboardingUserDetails = useMemo(
		() => (isAssistedOnboarding ? assistedAgentDetails : userData),
		[isAssistedOnboarding, assistedAgentDetails, userData]
	);

	/**
	 * Initialize step configuration when onboarding user details become available.
	 */
	useEffect(() => {
		// Only initialize if we have valid user details
		// This allows re-initialization when data becomes available after async fetch
		if (
			onboardingUserDetails &&
			Object.keys(onboardingUserDetails).length > 0
		) {
			initializeSteps();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onboardingUserDetails]);

	return (
		<OnboardingLayout
			steps={state?.stepperData || []}
			currentStepId={currentStepId}
		>
			<ContentRenderer
				stepConfig={currentStepConfig}
				onSubmit={handleSubmit}
				onAdvance={advanceToNextStep}
				onSkip={handleSkip}
				isLoading={state?.ui?.apiInProgress}
			/>
		</OnboardingLayout>
	);
};

/**
 * OnboardingSteps
 *
 * Wrapper component that provides OnboardingContext to OnboardingStepsContent.
 * Extracts user details and provides them to the context provider.
 * @param {object} props - Component props
 * @param {boolean} props.isAssistedOnboarding - whether assisted onboarding flow is active
 * @param {string} [props.logo] - organization logo URL (reserved for future use)
 * @param {string} [props.appName] - application display name (reserved for future use)
 * @param {string} [props.orgName] - organization name (reserved for future use)
 * @param {any} props.userData - user data object (server/context)
 * @param {any} props.assistedAgentDetails - assisted onboarding user details (when assisted)
 * @param {() => Promise<void>} props.refreshAgentProfile - refresh callback to sync profile after step changes
 * @param {string} [props.initialLatLong] - pre-fetched geolocation string (lat,long,accuracy) to populate state early
 * @returns {JSX.Element} OnboardingStepsContent wrapped with OnboardingProvider
 */
const OnboardingSteps = ({
	isAssistedOnboarding,
	logo: _logo,
	appName: _appName,
	orgName: _orgName,
	userData,
	assistedAgentDetails,
	refreshAgentProfile,
	initialLatLong,
}: {
	isAssistedOnboarding: boolean;
	logo?: string;
	appName?: string;
	orgName?: string;
	userData: any;
	assistedAgentDetails?: any;
	refreshAgentProfile: () => Promise<void>;
	initialLatLong?: string;
}) => {
	const { orgDetail } = useOrgDetailContext();

	// Determine the user details to use for onboarding
	const onboardingUserDetails = useMemo(
		() => (isAssistedOnboarding ? assistedAgentDetails : userData),
		[isAssistedOnboarding, assistedAgentDetails, userData]
	);

	const userName = useMemo(
		() => getUserNameFromData(onboardingUserDetails, isAssistedOnboarding),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	const mobile = useMemo(
		() => getMobileFromData(onboardingUserDetails, isAssistedOnboarding),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	const agreementId = useMemo(
		() =>
			getAgreementIdFromData(onboardingUserDetails, isAssistedOnboarding),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	// Extract onboarding steps and role list using proper data extractors
	// These handle both self and assisted onboarding data shapes
	const onboardingSteps = useMemo(
		() =>
			getOnboardingStepsFromData(
				onboardingUserDetails,
				isAssistedOnboarding
			),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	const roleList = useMemo(
		() => getRoleListFromData(onboardingUserDetails, isAssistedOnboarding),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	const userType = useMemo(
		() => getUserTypeFromData(onboardingUserDetails, isAssistedOnboarding),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	// For assisted onboarding, the OnboardingProvider already exists above
	// in AssistedOnboarding.tsx — skip wrapping to avoid double nesting.
	// For self-onboarding, wrap with OnboardingProvider as usual.
	if (isAssistedOnboarding) {
		return (
			<OnboardingStepsContent
				isAssistedOnboarding={isAssistedOnboarding}
				userData={userData}
				assistedAgentDetails={assistedAgentDetails}
				initialLatLong={initialLatLong}
			/>
		);
	}

	return (
		<OnboardingProvider
			userName={String(userName || "")}
			mobile={String(mobile || "")}
			agreementId={String(agreementId || "")}
			onboardingSteps={onboardingSteps}
			roleList={roleList}
			userType={userType}
			orgMetadataOnboarding={orgDetail?.metadata?.onboarding}
			refreshAgentProfile={refreshAgentProfile}
		>
			<OnboardingStepsContent
				isAssistedOnboarding={isAssistedOnboarding}
				userData={userData}
				assistedAgentDetails={assistedAgentDetails}
				initialLatLong={initialLatLong}
			/>
		</OnboardingProvider>
	);
};

export default OnboardingSteps;
