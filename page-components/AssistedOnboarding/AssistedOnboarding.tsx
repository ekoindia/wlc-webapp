import { useToast } from "@chakra-ui/react";
import { OaasWidget } from "components";
import {
	retailerStepsData,
	selectionStepData,
} from "constants/OnboardingSteps";
import { useOrgDetailContext } from "contexts";
import { useUser } from "contexts/UserContext";
import { useEffect, useState } from "react";

// Declare the props interface
interface AssistedOnboardingProps {
	[key: string]: any;
}

/**
 * An AssistedOnboarding component for assisted onboarding of retailers
 * Uses the OaasWidget with assisted onboarding specific configuration
 * @param {AssistedOnboardingProps} props - Properties passed to the component
 * @returns {JSX.Element} The rendered AssistedOnboarding component
 * @example
 * ```tsx
 * <AssistedOnboarding />
 * ```
 */
const AssistedOnboarding = ({ ...rest }: AssistedOnboardingProps) => {
	const { userData } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const toast = useToast();

	// Assisted onboarding specific state
	const [stepperData, setStepperData] = useState(retailerStepsData);
	const [selectedRole] = useState(1); // Assisted onboarding for retailers (merchant_type: 1)
	const [lastStepResponse, setLastStepResponse] = useState<any>();
	const [isSpinner] = useState(false);
	const [apiInProgress] = useState(false);

	// Assisted onboarding specific step data manipulation
	useEffect(() => {
		// Customize steps for assisted onboarding
		const assistedOnboardingSteps = retailerStepsData.map((step) => ({
			...step,
			// Assisted onboarding might have simplified flows
			isVisible: step.name !== "BusinessDetails" ? step.isVisible : false,
		}));
		setStepperData(assistedOnboardingSteps);
	}, []);

	// Handle step submission for assisted onboarding flow
	const handleStepDataSubmit = (data: any) => {
		console.log("Assisted Onboarding Step Data:", data);

		// Assisted onboarding specific logic would go here
		// For now, just show a toast
		toast({
			title: "Assisted Onboarding Step",
			description: `Step ${data.id} submitted for assisted onboarding`,
			status: "info",
			duration: 2000,
		});

		setLastStepResponse({
			status: 0,
			message: "Success",
			data: data,
		});
	};

	// Handle step callbacks for assisted onboarding specific actions
	const handleStepCallBack = (callType: any) => {
		console.log("Assisted Onboarding Step Callback:", callType);

		// Assisted onboarding specific callback logic would go here
		toast({
			title: "Assisted Onboarding Action",
			description: `Callback type ${callType.type} for assisted onboarding`,
			status: "info",
			duration: 1500,
		});
	};

	// MARK: JSX
	return (
		<OaasWidget
			{...rest}
			stepperData={stepperData}
			userData={userData}
			orgDetail={orgDetail}
			selectionStepData={selectionStepData}
			selectedRole={selectedRole}
			defaultStep="12400" // Start with location capture for retailers
			isBranding={false}
			stepResponse={lastStepResponse}
			esignStatus={1} // Ready state for e-sign
			isSpinner={isSpinner}
			apiInProgress={apiInProgress}
			handleSubmit={handleStepDataSubmit}
			handleStepCallBack={handleStepCallBack}
		/>
	);
};

export default AssistedOnboarding;
