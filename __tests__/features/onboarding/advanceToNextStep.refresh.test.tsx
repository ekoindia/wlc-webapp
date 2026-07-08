import { ChakraProvider } from "@chakra-ui/react";
import { act, renderHook } from "@testing-library/react";
import {
	ONBOARDING_STEP_IDS,
	ONBOARDING_STEP_STATUS,
	type OnboardingStep,
} from "features/onboarding/constants";
import {
	OnboardingProvider,
	useOnboardingContext,
} from "features/onboarding/context/OnboardingContext";

/**
 * Guards the last-step safety net in advanceToNextStep: the terminal step must
 * refresh the profile regardless of its postSubmit.refreshProfile flag, while a
 * non-terminal step with refreshProfile:false must NOT refresh.
 *
 * LOCATION_CAPTURE is the one step configured refreshProfile:false, so it doubles
 * as the "false flag" fixture. PAN_VERIFICATION (refreshProfile:true) is the trailing
 * step used to make LOCATION non-terminal.
 */

const seedStep = (
	id: number,
	stepStatus: number,
	applicableRoles: number[]
): OnboardingStep =>
	({
		id,
		name: `STEP_${id}`,
		label: `Step ${id}`,
		isRequired: true,
		isVisible: true,
		stepStatus,
		applicableRoles,
		primaryCTAText: "Next",
		description: "",
		form_data: {},
	}) as OnboardingStep;

const renderAdvance = (stepperData: OnboardingStep[]) => {
	const refreshAgentProfile = jest.fn().mockResolvedValue(undefined);
	const externalState = {
		state: { stepperData },
		dispatch: jest.fn(),
		actions: { setStepperData: jest.fn(), setIsLoading: jest.fn() },
	};
	const services = {
		accessToken: "token",
		generateNewToken: jest.fn(),
		isAndroid: false,
		pubsub: {},
	} as never;

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<ChakraProvider>
			<OnboardingProvider
				services={services}
				userName=""
				mobile=""
				agreementId=""
				refreshAgentProfile={refreshAgentProfile}
				externalState={externalState}
			>
				{children}
			</OnboardingProvider>
		</ChakraProvider>
	);

	const { result } = renderHook(() => useOnboardingContext(), { wrapper });
	return { advance: result.current.advanceToNextStep, refreshAgentProfile };
};

describe("advanceToNextStep — last-step profile refresh safety net", () => {
	it("refreshes on the last step even when refreshProfile is false", async () => {
		const { advance, refreshAgentProfile } = renderAdvance([
			seedStep(
				ONBOARDING_STEP_IDS.LOCATION_CAPTURE,
				ONBOARDING_STEP_STATUS.IN_PROGRESS,
				[12400]
			),
		]);

		await act(async () => {
			await advance(ONBOARDING_STEP_IDS.LOCATION_CAPTURE);
		});

		expect(refreshAgentProfile).toHaveBeenCalledTimes(1);
	});

	it("does NOT refresh a non-terminal refreshProfile:false step", async () => {
		const { advance, refreshAgentProfile } = renderAdvance([
			seedStep(
				ONBOARDING_STEP_IDS.LOCATION_CAPTURE,
				ONBOARDING_STEP_STATUS.IN_PROGRESS,
				[12400]
			),
			seedStep(
				ONBOARDING_STEP_IDS.PAN_VERIFICATION,
				ONBOARDING_STEP_STATUS.NOT_STARTED,
				[12300]
			),
		]);

		await act(async () => {
			await advance(ONBOARDING_STEP_IDS.LOCATION_CAPTURE);
		});

		expect(refreshAgentProfile).not.toHaveBeenCalled();
	});
});
