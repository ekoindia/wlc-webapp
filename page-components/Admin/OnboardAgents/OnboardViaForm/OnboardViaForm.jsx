import { Box, Flex } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { Endpoints, ParamType, UserType } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";
import { OnboardAgentResponse } from "..";

/**
 * A OnboardViaForm page-component
 * @param {object} props - Component props
 * @param {object} props.permissions - User permissions for onboarding
 * @param {Array} props.agentTypeList - List of available agent types
 * @param {object} props.agentTypeValueToApi - Mapping of agent type values to API values
 * @returns {JSX.Element} OnboardViaForm component
 * @example	`<OnboardViaForm permissions={permissions}></OnboardViaForm>`
 */
const OnboardViaForm = ({
	permissions,
	agentTypeList,
	agentTypeValueToApi,
}) => {
	const [applicantType, setApplicantType] = useState("");
	const [response, setResponse] = useState(null);

	// Check if user can onboard multiple agent types
	const canOnboardMultipleTypes = permissions?.allowedAgentTypes?.length > 1;

	// Check if distributor field should be hidden
	const hideDistributorField = permissions?.autoMapDistributor === true;

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting, isValid, isDirty },
		reset,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			applicant_type: "",
			agent_name: "",
			agent_mobile: "",
			dist_mobile: "",
		},
	});

	const watcher = useWatch({
		control,
	});

	const { accessToken } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (applicantType === "" && agentTypeList.length > 0) {
			setApplicantType(agentTypeList[0].value);
			reset({
				...watcher,
				applicant_type: agentTypeList[0].value,
			});
		}
	}, [agentTypeList, applicantType, reset, watcher]);

	// Update applicantType when form value changes
	useEffect(() => {
		if (
			watcher.applicant_type &&
			watcher.applicant_type !== applicantType
		) {
			setApplicantType(watcher.applicant_type);
		}
	}, [watcher.applicant_type, applicantType]);

	// Build parameter list dynamically based on permissions and state
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
		{
			name: "agent_name",
			label: "Name",
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
			parameter_type_id: ParamType.TEXT,
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
		...(applicantType == UserType.MERCHANT && !hideDistributorField
			? [
					{
						name: "dist_mobile",
						label: "Distributor's Mobile Number",
						parameter_type_id: ParamType.TEXT,
						required: false,
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
				]
			: []),
	];

	const handleFormSubmit = (data) => {
		const agentData = {
			agent_name: data.agent_name,
			agent_mobile: data.agent_mobile,
		};

		// Add distributor mobile if applicable
		if (
			applicantType == UserType.MERCHANT &&
			!hideDistributorField &&
			data.dist_mobile
		) {
			agentData.dist_mobile = data.dist_mobile;
		}

		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION_JSON,
			{
				headers: {
					"Content-Type": "application/json",
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": "/network/agent/multiple_onboarding",
					"tf-req-method": "POST",
				},
				body: {
					applicant_type: agentTypeValueToApi[applicantType],
					CspList: [agentData],
				},
				token: accessToken,
			}
		)
			.then((res) => {
				if (res.status === 0) {
					setResponse(res);
				}
			})
			.catch((err) => {
				console.error("error", err);
			});
	};

	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Save",
			loading: isSubmitting,
			disabled: !isValid || !isDirty,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
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
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<Flex direction="column" gap="8">
						<Form
							{...{
								parameter_list,
								formValues: watcher,
								control,
								register,
								errors,
							}}
						/>

						<ActionButtonGroup {...{ buttonConfigList }} />
					</Flex>
				</form>
			) : (
				<Flex direction="column" gap="2">
					<Flex fontSize="sm" direction="column" gap="1">
						<span>
							{response?.message || "Something went wrong"}!!
						</span>
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

export default OnboardViaForm;
