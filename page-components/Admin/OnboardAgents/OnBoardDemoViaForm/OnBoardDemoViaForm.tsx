import { Flex, useToast } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";
import { Endpoints, ParamType } from "../../../../constants";

export interface DemoOnboardFormValues {
	applicant_type: string;
	agent_name: string;
	agent_mobile: string;
	is_demo_account: boolean;
	demo_account_validity?: number;
	demo_credit_limit: string;
}

interface OnboardDemoProps {
	permissions: any; // Ideally use your Permission interface
	agentTypeList: { label: string; value: string }[];
	agentTypeValueToApi: Record<string, string>;
}

const OnboardDemoViaForm: React.FC<OnboardDemoProps> = ({
	permissions,
	agentTypeList,
	agentTypeValueToApi,
}) => {
	const [applicantType, setApplicantType] = useState<string>("");

	const canOnboardMultipleTypes = permissions?.allowedAgentTypes?.length > 1;

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting, isValid, isDirty },
		reset,
	} = useForm<DemoOnboardFormValues>({
		mode: "onChange",
		defaultValues: {
			applicant_type: "",
			agent_name: "",
			agent_mobile: "",
			is_demo_account: true, // Always true for this component
			demo_account_validity: undefined, // Optional, can be left blank
			demo_credit_limit: "",
		},
	});

	const watcher = useWatch({ control });
	const { accessToken } = useSession();
	const router = useRouter();
	const toast = useToast();

	useEffect(() => {
		if (applicantType === "" && agentTypeList.length > 0) {
			const defaultType = agentTypeList[0].value;
			setApplicantType(defaultType);
			reset({ ...watcher, applicant_type: defaultType });
		}
	}, [agentTypeList, applicantType, reset]);

	const parameter_list = [
		...(canOnboardMultipleTypes
			? [
					{
						name: "applicant_type",
						label: "Select Agent Type",
						parameter_type_id: ParamType.LIST,
						list_elements: agentTypeList,
					},
				]
			: []),
		// Agent name field - always included

		{
			name: "agent_name",
			label: "Agent Name",
			parameter_type_id: ParamType.TEXT,
			validations: {
				pattern: {
					value: /^[A-Za-z\s]+$/,
					message: "Name can only contain letters and spaces",
				},
			},
		},
		{
			name: "agent_mobile",
			label: "Mobile Number",
			parameter_type_id: ParamType.TEXT, // Using type 15 from your list
			validations: {
				pattern: {
					value: /^[6-9]{1}[0-9]{9}$/,
					message: "Please enter a valid mobile number",
				},
				minLength: {
					value: 10,
					message: "Mobile number must be 10 digits",
				},
				maxLength: {
					value: 10,
					message: "Mobile number must be 10 digits",
				},
			},
			meta: {
				maxLength: 10,
			},
		},
		{
			name: "demo_credit_limit",
			label: "Demo Credit Limit(₹)",
			parameter_type_id: ParamType.MONEY,
			validations: { required: "Credit limit is required" },
		},
		{
			name: "demo_account_validity",
			label: "Validity (Days)",
			parameter_type_id: ParamType.NUMERIC,
			required: false,
			defaultValue: 7,
		},
	];

	const handleFormSubmit = (data: DemoOnboardFormValues) => {
		const payload = {
			applicant_type: agentTypeValueToApi[data.applicant_type],
			CspList: [
				{
					agent_name: data.agent_name,
					agent_mobile: data.agent_mobile,
					is_demo_account: true,
					demo_account_validity: data.demo_account_validity
						? Number(data.demo_account_validity)
						: 7, // Default to 7 days if not provided
					demo_credit_limit: data.demo_credit_limit,
				},
			],
			source: "WLC",
			version: "v1",
		};

		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION_JSON,
			{
				headers: {
					"Content-Type": "application/json",
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": "/network/agent/multiple_onboarding",
					"tf-req-method": "POST",
				},
				body: payload,
				token: accessToken,
			}
		)
			.then((res) => {
				// 1. Extract the specific agent result
				const agentResult = res?.data?.csp_list?.[0];

				if (agentResult?.status === "Fail") {
					// 2. Show Error Toast with Reason from API
					toast({
						title: "Onboarding Failed",
						description:
							agentResult?.reason || "Reason not provided",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
				} else if (res.status === 0) {
					// 3. Success Case
					toast({
						title: "Success",
						description: "Demo user created successfully",
						status: "success",
						duration: 3000,
						isClosable: true,
					});
					reset(); // Clear form only on success
				}
			})
			.catch((err) => {
				console.error("Demo Onboard Error", err);
				toast({
					title: "Error",
					description: "Connection error. Please try again.",
					status: "error",
				});
			});
	};

	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Create Demo User",
			loading: isSubmitting,
			disabled: !isValid || !isDirty,
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: () => router.back(),
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

	return (
		<div>
			{/* // Agent onboarding form - shown before submission */}
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<Flex direction="column" gap="8">
					{/* Dynamic form generated based on parameter_list */}
					<Form
						{...{
							parameter_list,
							formValues: watcher,
							control: control as any,
							register: register as any,
							errors: errors as any,
						}}
					/>

					{/* Action buttons for form submission */}
					<ActionButtonGroup {...{ buttonConfigList }} />
				</Flex>
			</form>
		</div>
	);
};

export default OnboardDemoViaForm;
