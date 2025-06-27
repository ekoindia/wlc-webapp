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
 * Component for onboarding individual agents via a form interface.
 * Dynamically generates form fields based on agent type and permissions,
 * submits data to API, and displays results.
 * @param {object} props - Component props
 * @param {object} props.permissions - User permissions for onboarding
 * @param {Array<{label: string, value: string}>} props.agentTypeList - List of available agent types
 * @param {object} props.agentTypeValueToApi - Mapping of agent type values to API values
 * @returns {JSX.Element} Form interface or results display based on submission state
 * @example
 * ```jsx
 * <OnboardViaForm permissions={permissions} agentTypeList={[{label: 'Retailer', value: '1'}]} agentTypeValueToApi={{1: '2'}} />
 * ```
 */
const OnboardViaForm = ({
	permissions,
	agentTypeList,
	agentTypeValueToApi,
}) => {
	const [applicantType, setApplicantType] = useState(""); // Selected agent type
	const [response, setResponse] = useState(null); // API response after form submission

	// Determine if the agent type selector should be shown (true if multiple agent types are allowed)
	const canOnboardMultipleTypes = permissions?.allowedAgentTypes?.length > 1;

	// Determine if the distributor field should be hidden (true if auto-mapping is enabled)
	// When auto-mapping is enabled, system will automatically assign distributor, so field isn't needed
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

	// Initialize form with default agent type when component loads
	useEffect(() => {
		if (applicantType === "" && agentTypeList.length > 0) {
			// Set the first available agent type as default
			setApplicantType(agentTypeList[0].value);
			// Reset form with default agent type value
			reset({
				...watcher,
				applicant_type: agentTypeList[0].value,
			});
		}
	}, [agentTypeList, applicantType, reset, watcher]);

	// Synchronize applicantType state with form values when dropdown selection changes
	useEffect(() => {
		if (
			watcher.applicant_type &&
			watcher.applicant_type !== applicantType
		) {
			setApplicantType(watcher.applicant_type);
		}
	}, [watcher.applicant_type, applicantType]);

	/**
	 * Dynamic parameter list for form generation
	 * The list is built conditionally based on:
	 * 1. Whether multiple agent types are allowed (canOnboardMultipleTypes)
	 * 2. Current agent type selection (applicantType)
	 * 3. Auto-mapping settings (hideDistributorField)
	 */
	const parameter_list = [
		// Conditionally include agent type selector
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
			label: "Name",
			parameter_type_id: ParamType.TEXT,
			validations: {
				pattern: {
					value: /^[A-Za-z\s]+$/,
					message: "Name can only contain letters and spaces",
				},
			},
		},
		// Agent mobile number field - always included
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
		// Distributor mobile field - conditionally included for retailers when auto-mapping is disabled
		...(applicantType == UserType.MERCHANT && !hideDistributorField
			? [
					{
						name: "dist_mobile",
						label: "Distributor's Mobile Number",
						parameter_type_id: ParamType.TEXT,
						required: false, // Optional field
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

	/**
	 * Handles the form submission process for agent onboarding.
	 * 1. Constructs agent data object from form values
	 * 2. Conditionally includes distributor information if applicable
	 * 3. Makes API request to onboard the agent
	 * 4. Updates UI state based on API response
	 * @param {object} data - Form data from react-hook-form
	 */
	const handleFormSubmit = (data) => {
		// Initialize agent data with required fields
		const agentData = {
			agent_name: data.agent_name,
			agent_mobile: data.agent_mobile,
		};

		// Add distributor mobile if agent is a retailer, auto-mapping is disabled, and value is provided
		if (
			applicantType == UserType.MERCHANT &&
			!hideDistributorField &&
			data.dist_mobile
		) {
			agentData.dist_mobile = data.dist_mobile;
		}

		// Submit agent data to onboarding API endpoint
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
					applicant_type: agentTypeValueToApi[applicantType], // Convert frontend value to API format
					CspList: [agentData], // Send as array for consistency with bulk API
				},
				token: accessToken,
			}
		)
			.then((res) => {
				// Update UI with successful response
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
				// Agent onboarding form - shown before submission
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<Flex direction="column" gap="8">
						{/* Dynamic form generated based on parameter_list */}
						<Form
							{...{
								parameter_list,
								formValues: watcher,
								control,
								register,
								errors,
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
							{response?.message || "Something went wrong"}!!
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

export default OnboardViaForm;
