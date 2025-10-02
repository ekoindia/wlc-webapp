import { useToast } from "@chakra-ui/react";
import { OnboardingWidget } from "components";
import {
	retailerStepsData,
	roleSelectionStepData,
} from "constants/OnboardingSteps";
import { useOrgDetailContext } from "contexts";
import { useUser } from "contexts/UserContext";
import { useEffect, useState } from "react";

const SignupPage = () => {
	const { userData } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const toast = useToast();

	// Assisted onboarding specific state
	const [stepperData, setStepperData] = useState(retailerStepsData);
	const [selectedRole] = useState(1); // Assisted onboarding for retailers (merchant_type: 1)
	const [lastStepResponse, setLastStepResponse] = useState({});
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
	const handleStepDataSubmit = (data) => {
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
	const handleStepCallBack = (callType) => {
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
		<OnboardingWidget
			stepperData={stepperData}
			userData={userData}
			orgDetail={orgDetail}
			selectionStepData={roleSelectionStepData}
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

SignupPage.pageMeta = {
	title: "Signup",
	hideMenu: true,
};

export default SignupPage;
