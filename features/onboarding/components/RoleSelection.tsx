import {
	Box,
	Circle,
	Flex,
	Heading,
	Spinner,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { Button, Icon } from "components";
import { UserTypeIcon } from "constants/UserTypes";
import { useHslColor, useUserTypes } from "hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { APPLICANT_TYPES, RESPONSE_TYPE_IDS } from "../constants";
import { useOnboardingState } from "../hooks";
import { executePipeline } from "../utils";
import {
	createRoleSelectionStep,
	getCardKey,
	ROLE_SELECTION_STEP_CONFIG,
	visibleAgentTypes,
	type Role,
} from "../utils/roleSelection";

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
	// Enterprise has no UserTypeIcon entry; use the business/briefcase glyph
	// instead of the generic "person" fallback.
	const enterpriseFallback =
		applicantType === APPLICANT_TYPES.ENTERPRISE
			? "business-center"
			: "person";
	return UserTypeIcon[userTypeId] || enterpriseFallback;
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
	// The two Enterprise variant cards must look identical (same enterprise
	// icon + colour), so seed the colour from a shared key rather than the
	// per-card label — otherwise each label hashes to a different hue.
	const colorSeed = role.businessVerticalCode ? "enterprise" : role.label;
	const { h } = useHslColor(colorSeed);
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
 * @param {string} [props.agentMobile] - Mobile number of the assisted agent
 * @param {number[]} [props.allowedRoleIds] - Optional list of allowed role ids (1: Retailer, 2: Distributor, 3: Enterprise). Eg: [1,2] for Retailer and Distributor only.
 * @param {string} [props.businessVertical] - Optional canonical business vertical ("EPS" | "Eloka" | "SBI Kiosk" | "Enterprise") from the `?bv` query param; submitted as `business_vertical` when present.
 * @param {Function} props.refreshAgentProfile - Function to refresh the agent profile data
 * @param props.accessToken
 * @param props.generateNewToken
 * @param props.showEnterprise
 * @returns {JSX.Element} The rendered RoleSelection component
 */
const RoleSelection = ({
	setStep,
	userData,
	isAssistedOnboarding,
	setSelectedRole,
	assistedAgentDetails,
	agentMobile,
	allowedRoleIds,
	businessVertical,
	showEnterprise,
	refreshAgentProfile,
	accessToken,
	generateNewToken,
}) => {
	// Selection is keyed by the stable per-card key (see getCardKey), not
	// applicant_type — the two Enterprise variant cards share applicant_type.
	const [selectedCardKey, setSelectedCardKey] = useState<string | null>(null);

	const toast = useToast();

	const mobile =
		agentMobile ||
		assistedAgentDetails?.userDetails?.mobile ||
		userData?.userDetails?.signup_mobile;

	console.log("[Onboarding] RoleSelection mobile:", mobile);
	console.log(
		"[Onboarding] RoleSelection assistedAgentDetails:",
		assistedAgentDetails
	);
	console.log("[Onboarding] RoleSelection userData:", userData);
	console.log("[Onboarding] RoleSelection mobile:", mobile);

	const { state, actions } = useOnboardingState();

	/**
	 * Submit role selection using the pipeline executor
	 */
	const submitRoleSelection = useCallback(
		async (role: Role) => {
			actions.setApiInProgress(true);

			// A variant card carries its own vertical (EPS/Eloka); otherwise fall
			// back to the URL-derived `businessVertical`. Sent only when resolved.
			const resolvedBusinessVertical =
				role.businessVertical ?? businessVertical;

			try {
				await executePipeline({
					stepConfig: ROLE_SELECTION_STEP_CONFIG,
					formData: {
						id: ROLE_SELECTION_STEP_CONFIG.id,
						form_data: {
							applicant_type: role.applicant_type,
							csp_id: mobile,
							...(resolvedBusinessVertical
								? {
										business_vertical:
											resolvedBusinessVertical,
									}
								: {}),
						},
					},
					mobile: String(mobile || ""),
					accessToken,
					generateNewToken,
					sharedState: {
						mobile: String(mobile || ""),
						latLong: state.latLong,
					},
					onSuccess: async (result) => {
						console.log(
							"[RoleSelection] Pipeline success:",
							result
						);
						// Check if role selection was successful (response_type_id 1566)
						const apiResponse = result?.list?.[0]?.response;
						if (
							apiResponse?.response_type_id ===
							RESPONSE_TYPE_IDS.SELECTION_SCREEN
						) {
							// Refresh user profile if configured
							if (
								ROLE_SELECTION_STEP_CONFIG.postSubmit
									?.refreshProfile
							) {
								await refreshAgentProfile();
							}
							setStep("KYC_FLOW");
						}
					},
					onError: async (result) => {
						console.error(
							"[RoleSelection] Pipeline error:",
							result
						);
						// show toast here
						const failedStep = result?.list?.find(
							(r: any) => r.status === "failed"
						);
						const errorMessage =
							failedStep?.response?.message ||
							"Something went wrong. Please try again.";

						toast({
							title: "Account creation failed",
							description: errorMessage,
							status: "error",
							duration: 4000,
							isClosable: true,
						});

						actions.setApiInProgress(false);
					},
				});
			} catch (error) {
				console.error("[RoleSelection] Submission error:", error);
				actions.setApiInProgress(false);
			}
		},
		[
			actions,
			mobile,
			businessVertical,
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
		: allowedRoleIds || visibleAgentTypes.selfOnboarding;

	// Show the two Enterprise vertical cards when the org enables Enterprise and
	// no `?bv` already pinned the vertical (a bare `?role=3` still needs the user
	// to pick a vertical, so it splits too). A resolved `?bv` keeps the legacy
	// single-card auto-submit path below.
	const splitEnterprise = Boolean(showEnterprise) && !businessVertical;

	const onboardingRoleStep = createRoleSelectionStep(forAgentTypes, {
		userTypeLabel: userTypeLabels,
		splitEnterprise,
	});

	const roles: Role[] = onboardingRoleStep?.form_data?.roles || [];

	// Track if auto-submit has been triggered to prevent duplicate submissions
	const autoSubmitTriggered = useRef(false);

	/**
	 * Auto-select and auto-submit when only one role is available
	 * This optimizes the flow for assisted onboarding where typically only one user type exists
	 */
	useEffect(() => {
		// Only auto-submit if:
		// 1. Exactly one role is available
		// 2. Not already submitting
		// 3. Haven't already auto-submitted
		if (
			roles.length === 1 &&
			!state.ui?.apiInProgress &&
			!autoSubmitTriggered.current
		) {
			autoSubmitTriggered.current = true;
			const singleRole = roles[0];

			// Auto-select the role
			setSelectedCardKey(getCardKey(singleRole));

			// Update selected role state
			setSelectedRole(singleRole.applicant_type);

			// Auto-submit via pipeline executor
			submitRoleSelection(singleRole);
		}
	}, [roles, state.ui?.apiInProgress, submitRoleSelection, setSelectedRole]);

	/**
	 * Handle role tile selection
	 * @param {Role} role - The selected role card
	 * @returns {void}
	 */
	const handleRoleSelect = (role: Role) => {
		if (state.ui?.apiInProgress) return;
		setSelectedCardKey(getCardKey(role));
	};

	/**
	 * Handle continue button click
	 */
	const handleContinue = () => {
		// Resolve the selected card from the current roles by its stable key —
		// avoids holding a stale Role object across re-renders.
		const selectedRole = roles.find(
			(role) => getCardKey(role) === selectedCardKey
		);
		if (!selectedRole) return;

		// Update selected role state
		setSelectedRole(selectedRole.applicant_type);

		// Submit role selection via pipeline executor
		submitRoleSelection(selectedRole);
	};

	// MARK: JSX
	return (
		<Flex
			direction="column"
			align="center"
			w="100%"
			h="100%"
			minH="100vh"
			py={8}
			px={{ base: 4, md: 8 }}
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
							key={getCardKey(role)}
							role={role}
							isSelected={selectedCardKey === getCardKey(role)}
							isDisabled={Boolean(state.ui?.apiInProgress)}
							onClick={() => handleRoleSelect(role)}
						/>
					))}
				</VStack>

				{/* Continue Button */}
				<Button
					variant="primary"
					w="100%"
					size="lg"
					isDisabled={
						selectedCardKey === null || state.ui?.apiInProgress
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
