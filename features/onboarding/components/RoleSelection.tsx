import {
	Box,
	Circle,
	Flex,
	Heading,
	Spinner,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Button, Icon } from "components";
import { UserTypeIcon } from "constants/UserTypes";
import { useSession } from "contexts";
import { useHslColor, useRefreshToken, useUserTypes } from "hooks";
import { useCallback, useState } from "react";
import {
	APPLICANT_TYPES,
	createRoleSelectionStep,
	masterOnboardingSteps,
	ONBOARDING_STEP_IDS,
	type Role,
	visibleAgentTypes,
} from "../constants";
import { useOnboardingState } from "../hooks";
import { executePipeline } from "../utils";

/**
 * Map applicant_type to user_type_id for icon lookup
 * APPLICANT_TYPES are different from UserType IDs
 */
const APPLICANT_TO_USER_TYPE: Record<number, number> = {
	[APPLICANT_TYPES.RETAILER]: 2, // Maps to UserType.MERCHANT
	[APPLICANT_TYPES.DISTRIBUTOR]: 1, // Maps to UserType.DISTRIBUTOR
	[APPLICANT_TYPES.ENTERPRISE]: 23, // Maps to UserType.ENTERPRISE_PARTNER_ADMIN
};

/**
 * Get icon name for a given applicant type
 * @param {number} applicantType - Applicant type id
 * @returns {string} Icon name
 */
const getIconForApplicantType = (applicantType: number): string => {
	const userTypeId = APPLICANT_TO_USER_TYPE[applicantType];
	return UserTypeIcon[userTypeId] || "person";
};

interface RoleCardProps {
	role: Role;
	isSelected: boolean;
	isDisabled: boolean;
	onClick: () => void;
}

/**
 * Custom role selection card with icon, label, and description
 * @param {RoleCardProps} props - Role card props
 * @returns {JSX.Element} Role card
 */
const RoleCard = (props: RoleCardProps): JSX.Element => {
	const { role, isSelected, isDisabled, onClick } = props;
	const iconName = getIconForApplicantType(role.applicant_type);
	const { h } = useHslColor(role.label);
	const borderColor = isSelected ? "primary.DEFAULT" : "transparent";
	const hoverBorderColor = isDisabled
		? undefined
		: isSelected
			? "primary.DEFAULT"
			: "primary.light";

	const handleClick = () => {
		if (isDisabled) return;
		onClick();
	};

	return (
		<Flex
			as="button"
			type="button"
			onClick={handleClick}
			disabled={isDisabled}
			aria-disabled={isDisabled}
			tabIndex={isDisabled ? -1 : 0}
			w="100%"
			bg="white"
			p={4}
			borderRadius="xl"
			align="center"
			gap={4}
			cursor={isDisabled ? "not-allowed" : "pointer"}
			border="2px solid"
			borderColor={borderColor}
			boxShadow={isSelected ? "md" : "sm"}
			transition="all 0.2s ease"
			_hover={{
				borderColor: hoverBorderColor,
				boxShadow: isDisabled ? undefined : "md",
				transform: isDisabled ? undefined : "translateY(-1px)",
			}}
			_active={{
				transform: isDisabled ? undefined : "scale(0.99)",
			}}
			_focusVisible={{
				outline: "2px solid",
				outlineColor: `hsl(${h},70%,44%)`,
				outlineOffset: "2px",
			}}
			opacity={isDisabled ? 0.6 : 1}
		>
			{/* Icon */}
			<Flex
				w="48px"
				h="48px"
				bg={`hsl(${h},70%,96%)`}
				borderRadius="12px"
				align="center"
				justify="center"
				flexShrink={0}
				transition="all 0.2s"
			>
				<Icon size="md" name={iconName} color={`hsl(${h},70%,45%)`} />
			</Flex>

			{/* Content */}
			<Flex direction="column" align="flex-start" flex={1} gap={1}>
				<Text
					fontSize="md"
					fontWeight="semibold"
					color="gray.800"
					textAlign="left"
					lineHeight="short"
				>
					{role.label}
				</Text>
				<Text
					fontSize="sm"
					color="gray.500"
					textAlign="left"
					noOfLines={2}
					lineHeight="short"
				>
					{role.description}
				</Text>
			</Flex>

			{/* Selection Indicator */}
			<Circle
				size="24px"
				bg={isSelected ? "primary.DEFAULT" : "gray.200"}
				color="white"
				flexShrink={0}
				transition="all 0.2s"
			>
				{isSelected && <Icon name="check" size="xs" strokeWidth={3} />}
			</Circle>
		</Flex>
	);
};

/**
 * RoleSelection component for selecting user role during onboarding
 * @param {object} props - Properties passed to the component
 * @param {Function} props.setStep - Function to set the current step in the onboarding process
 * @param {object} props.userData - User data object
 * @param {boolean} props.isAssistedOnboarding - Flag indicating if it's assisted onboarding
 * @param {Function} props.setSelectedRole - Function to set the selected role
 * @param {object} [props.assistedAgentDetails] - Details of the assisted agent (if any)
 * @param {number[]} [props.allowedMerchantTypes] - Optional list of allowed merchant types for the onboarding process. Eg: [1,3] for Retailer and Distributor only.
 * @param {Function} props.refreshAgentProfile - Function to refresh the agent profile data
 * @returns {JSX.Element} The rendered RoleSelection component
 */
const RoleSelection = ({
	setStep,
	userData,
	isAssistedOnboarding,
	setSelectedRole,
	assistedAgentDetails,
	allowedMerchantTypes,
	refreshAgentProfile,
}) => {
	const [selectedApplicantType, setSelectedApplicantType] = useState<
		number | null
	>(null);

	const mobile = isAssistedOnboarding
		? assistedAgentDetails?.user_detail?.mobile
		: userData?.userDetails?.signup_mobile;

	const { state, actions } = useOnboardingState();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();

	// Get the role selection step config from masterOnboardingSteps
	const roleStepConfig = masterOnboardingSteps.find(
		(step) => step.id === ONBOARDING_STEP_IDS.SELECTION_SCREEN
	);

	/**
	 * Submit role selection using the pipeline executor
	 */
	const submitRoleSelection = useCallback(
		async (applicantType: number) => {
			if (!roleStepConfig) {
				console.error(
					"[RoleSelection] Role selection step config not found"
				);
				return;
			}

			actions.setApiInProgress(true);

			try {
				await executePipeline({
					stepConfig: roleStepConfig,
					formData: {
						id: ONBOARDING_STEP_IDS.SELECTION_SCREEN,
						form_data: {
							applicant_type: applicantType,
							csp_id: mobile,
						},
					},
					mobile: String(mobile || ""),
					accessToken,
					generateNewToken,
					sharedState: {
						mobile: String(mobile || ""),
						latLong: state.latLong,
					},
					onSuccess: async (response) => {
						console.log(
							"[RoleSelection] Pipeline success:",
							response
						);
						// Check if role selection was successful (response_type_id 1566)
						if (response?.response_type_id === 1566) {
							// Refresh user profile if configured
							if (roleStepConfig?.postSubmit?.refreshProfile) {
								await refreshAgentProfile();
							}
							setStep("KYC_FLOW");
						}
					},
					onError: async (error) => {
						console.error("[RoleSelection] Pipeline error:", error);
						actions.setApiInProgress(false);
					},
				});
			} catch (error) {
				console.error("[RoleSelection] Submission error:", error);
				actions.setApiInProgress(false);
			}
		},
		[
			roleStepConfig,
			actions,
			mobile,
			accessToken,
			generateNewToken,
			state.latLong,
			refreshAgentProfile,
			setStep,
		]
	);

	const { userTypeLabels } = useUserTypes();

	const forAgentTypes = isAssistedOnboarding
		? visibleAgentTypes.assistedOnboarding
		: allowedMerchantTypes || visibleAgentTypes.selfOnboarding;

	const onboardingRoleStep = createRoleSelectionStep(forAgentTypes, {
		userTypeLabel: userTypeLabels,
	});

	const roles: Role[] = onboardingRoleStep?.form_data?.roles || [];

	/**
	 * Handle role tile selection
	 * @param {number} applicantType - Applicant type id
	 * @returns {void}
	 */
	const handleRoleSelect = (applicantType: number) => {
		if (state.ui?.apiInProgress) return;
		setSelectedApplicantType(applicantType);
	};

	/**
	 * Handle continue button click
	 */
	const handleContinue = () => {
		if (selectedApplicantType === null) return;

		// Update selected role state
		setSelectedRole(selectedApplicantType);

		// Submit role selection via pipeline executor
		submitRoleSelection(selectedApplicantType);
	};

	return (
		<Flex
			direction="column"
			align="center"
			w="100%"
			h="100%"
			minH="100vh"
			py={8}
			px={{ base: 4, md: 8 }}
			bg="gray.100"
		>
			<Box w="100%" maxW="480px">
				{/* Title */}
				<Heading
					as="h1"
					size="md"
					fontWeight="semibold"
					color="dark"
					mb={6}
				>
					{onboardingRoleStep?.label || "Tell us who you are?"}
				</Heading>

				{/* Role Cards */}
				<VStack spacing={4} w="100%" align="stretch" mb={8}>
					{roles.map((role) => (
						<RoleCard
							key={role.id}
							role={role}
							isSelected={
								selectedApplicantType === role.applicant_type
							}
							isDisabled={Boolean(state.ui?.apiInProgress)}
							onClick={() =>
								handleRoleSelect(role.applicant_type)
							}
						/>
					))}
				</VStack>

				{/* Continue Button */}
				<Button
					variant="primary"
					w="100%"
					size="lg"
					isDisabled={
						selectedApplicantType === null ||
						state.ui?.apiInProgress
					}
					onClick={handleContinue}
					_disabled={{
						opacity: 0.5,
						cursor: "not-allowed",
					}}
				>
					{state.ui?.apiInProgress ? (
						<Spinner size="sm" />
					) : (
						onboardingRoleStep?.primaryCTAText || "Continue"
					)}
				</Button>
			</Box>
		</Flex>
	);
};

export default RoleSelection;
