import { Box, Flex } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";
import { OnboardAgentResponse } from "..";
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
	const [response, setResponse] = useState<any>(null);

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

	useEffect(() => {
		if (applicantType === "" && agentTypeList.length > 0) {
			const defaultType = agentTypeList[0].value;
			setApplicantType(defaultType);
			reset({ ...watcher, applicant_type: defaultType });
		}
	}, [agentTypeList, applicantType, reset, watcher]);

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
			label: "Demo Credit Limit",
			parameter_type_id: ParamType.MONEY,
			validations: { required: "Credit limit is required" },
		},
		{
			name: "demo_account_validity",
			label: "Validity (Days)",
			parameter_type_id: ParamType.NUMERIC,
			required: false,
			helperText:
				"Note: If left blank, the account will automatically expire in 7 days.",
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
						: undefined,
					demo_credit_limit: data.demo_credit_limit,
				},
			],
			// Note: client_ref_id, user_code, etc., are usually handled by the backend
			// or your fetcher/middleware, but added here if needed.
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
				if (res.status === 0) setResponse(res);
			})
			.catch((err) => console.error("Demo Onboard Error", err));
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
			{response === null ? (
				// Agent onboarding form - shown before submission
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
			) : (
				// Results display - shown after successful submission
				<Flex direction="column" gap="2">
					{/* Response message and statistics summary */}
					<Flex fontSize="sm" direction="column" gap="1">
						{/* API response message or fallback */}
						<span>
							{response?.message || "Something went wrong"}!
						</span>

						{/* Show accepted records count if any */}
						{response?.data?.processed_records > 0 && (
							<Flex gap="1">
								<Box as="span" fontWeight="semibold">
									Accepted:
								</Box>
								<span>{response?.data?.processed_records}</span>
								<span>
									{response?.data?.processed_records === 1
										? "record"
										: "records"}
								</span>
							</Flex>
						)}

						{/* Show rejected records count if any */}
						{response?.data?.failed_count > 0 && (
							<Flex gap="1">
								<Box as="span" fontWeight="semibold">
									Rejected:
								</Box>
								<span>{response?.data?.failed_count}</span>
								<span>
									{response?.data?.failed_count === 1
										? "record"
										: "records"}
								</span>
							</Flex>
						)}
					</Flex>

					{/* Display detailed results table if there are records to show */}
					{response?.data?.csp_list?.length > 0 && (
						<OnboardAgentResponse
							responseList={response?.data?.csp_list}
							applicantType={applicantType}
						/>
					)}
				</Flex>
			)}
		</div>
	);
};

export default OnboardDemoViaForm;
