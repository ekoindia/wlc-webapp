import { Box, Flex, FormControl, FormLabel, Text } from "@chakra-ui/react";
import { Button, IcoButton, Input, Radio, Select } from "components";
import { Endpoints, ParamType } from "constants";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { OnboardingResponse } from "..";

const generateKeys = (fieldList) => {
	let keys = {};

	fieldList.forEach((ele) => {
		keys[ele.name] = "";
	});

	return keys;
};

const getLabels = (fieldList) => {
	let labels = {};

	fieldList.forEach((ele) => {
		labels[ele.name] = ele.label;
	});

	return labels;
};

const AGENT_TYPE = {
	RETAILER: "0",
	DISTRIBUTOR: "2",
};

const MOBILE_NUMBER_REGEX = /^[6-9]{1}[0-9]{9}$/;

/**
 * A SingleOnboarding page-component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<SingleOnboarding></SingleOnboarding>` TODO: Fix example
 */

const SingleOnboarding = () => {
	const [agentType, setAgentType] = useState(AGENT_TYPE.RETAILER);
	const [response, setResponse] = useState(null);
	const [isActive, setIsActive] = useState(0);
	const { accessToken } = useSession();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		control,
	} = useForm();

	const formName = "agents";

	const { fields, append, remove } = useFieldArray({
		name: formName,
		control,
	});

	const onboardAgentTypeList = [
		{ value: AGENT_TYPE.RETAILER, label: "Onboard Retailers" },
		{ value: AGENT_TYPE.DISTRIBUTOR, label: "Onboard Distributors" },
	];

	const onboard_retailer_request_structure = [
		{
			name: "agent_name",
			label: "Name",
			required: true,
			parameter_type_id: ParamType.TEXT,
			validation: {
				required: true,
			},
		},
		{
			name: "agent_mobile",
			label: "Mobile Number",
			required: true,
			parameter_type_id: ParamType.MOBILE,
			validation: {
				required: true,
				pattern: MOBILE_NUMBER_REGEX,
				maxLength: 10,
				minLength: 10,
			},
		},

		{
			name: "dist_mobile",
			label: "Distributor's Mobile Number",
			required: false,
			parameter_type_id: ParamType.MOBILE,
			validation: {
				required: false,
				pattern: MOBILE_NUMBER_REGEX,
				maxLength: 10,
				minLength: 10,
			},
		},
	];

	const onboard_distributor_request_structure = [
		{
			name: "agent_name",
			label: "Name",
			required: true,
			parameter_type_id: ParamType.TEXT,
			validation: {
				required: true,
			},
		},
		{
			name: "agent_mobile",
			label: "Mobile Number",
			required: true,
			parameter_type_id: ParamType.MOBILE,
			validation: {
				required: true,
				pattern: MOBILE_NUMBER_REGEX,
				maxLength: 10,
				minLength: 10,
			},
		},
	];

	useEffect(() => {
		reset({
			[formName]: [
				generateKeys(
					agentType === AGENT_TYPE.RETAILER
						? onboard_retailer_request_structure
						: onboard_distributor_request_structure
				),
			],
		});
	}, [agentType]);

	const labels = useMemo(
		() =>
			getLabels(
				agentType === AGENT_TYPE.RETAILER
					? onboard_retailer_request_structure
					: onboard_distributor_request_structure
			),
		[agentType]
	);

	const onSubmit = (data) => {
		//const _data = { agentType, ...data };

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
					// interaction_type_id: 734,
					applicant_type: agentType,
					CspList: data.agents,
				},
				token: accessToken,
			}
		)
			.then((res) => {
				setResponse(res);
			})
			.catch((err) => {
				console.error("error", err);
			});
	};

	return (
		<div>
			{response === null ? (
				<form onSubmit={handleSubmit(onSubmit)}>
					<Flex direction="column" gap="8">
						<Radio
							value={agentType}
							options={onboardAgentTypeList}
							onChange={(value) => setAgentType(value)}
						/>
						{fields.map((item, index) => {
							let _fieldsLength = fields.length;
							if (isActive != index) {
								return (
									<Flex
										direction={{
											base: "column",
											md: "row",
										}}
										key={index}
										fontSize="sm"
										gap="4"
										align="center"
									>
										{Object.entries(item).map(
											([key, value]) => {
												return (
													key !== "id" && (
														<Flex
															gap="1"
															color="light"
															key={`${index}-${key}`}
														>
															{labels[key]}:
															<Text
																fontWeight="medium"
																color="dark"
															>
																{value}
															</Text>
														</Flex>
													)
												);
											}
										)}

										<Flex gap="4">
											<IcoButton
												type="button"
												iconName="mode-edit"
												size="sm"
												theme="accent"
												onClick={() => {
													setIsActive(index);
												}}
											/>

											<IcoButton
												type="button"
												iconName="delete"
												size="sm"
												theme="accent"
												onClick={() => {
													remove(index);
													setIsActive(
														(prev) =>
															index ===
																_fieldsLength -
																	1 &&
															prev - 1
													);
												}}
											/>
										</Flex>
									</Flex>
								);
							} else {
								return (
									<Flex
										direction="column"
										gap="8"
										key={index}
									>
										<Form
											{...{
												parameter_list:
													agentType ===
													AGENT_TYPE.RETAILER
														? onboard_retailer_request_structure
														: onboard_distributor_request_structure,
												register,
												item,
												index,
												formName,
												control,
												errors,
											}}
										/>
										<Button
											type="button"
											w={{ base: "100%", md: "160px" }}
											h="48px"
											onClick={() => {
												remove(index);
												setIsActive(
													(prev) =>
														index ===
															_fieldsLength - 1 &&
														prev - 1
												);
											}}
										>
											Remove
										</Button>
										{/* <Box
											w="100%"
											h="1px"
											bg="divider"
										></Box> */}
									</Flex>
								);
							}
						})}

						<Button
							type="button"
							variant="outline"
							color="primary.DEFAULT"
							w={{ base: "100%", md: "160px" }}
							h="48px"
							onClick={() => {
								const _keyList = generateKeys(
									agentType === AGENT_TYPE.RETAILER
										? onboard_retailer_request_structure
										: onboard_distributor_request_structure
								);
								append(_keyList);
								setIsActive((prev) => prev + 1);
							}}
						>
							Add New
						</Button>

						<Button
							type="submit"
							loading={isSubmitting}
							w={{ base: "100%", md: "215px" }}
							h="64px"
							size="lg"
							disabled={fields?.length < 1}
						>
							Submit
						</Button>
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
						<OnboardingResponse
							responseList={response?.data?.csp_list}
							agentType={agentType}
						/>
					)}
				</Flex>
			)}
		</div>
	);
};

export default SingleOnboarding;

const Form = ({
	parameter_list,
	register,
	control,
	item,
	index,
	// errors,
	formName,
}) => {
	return (
		<Flex direction="column" gap="8" key={`${formName}.${item.id}`}>
			{parameter_list?.map(
				({
					name,
					label,
					required,
					value,
					disabled,
					list_elements,
					parameter_type_id,
					// validation,
				}) => {
					// const _name = errors[formName] || [];
					switch (parameter_type_id) {
						case ParamType.LIST:
							return (
								<FormControl
									key={`${formName}.${index}.${name}`}
									w={{ base: "100%", md: "500px" }}
									// isInvalid={Boolean(errors._name)}
								>
									<FormLabel>{label}</FormLabel>
									<Controller
										name={`${formName}.${index}.${name}`}
										control={control}
										render={({
											field: { onChange, value },
										}) => {
											return (
												<Select
													value={value}
													options={list_elements}
													onChange={onChange}
												/>
											);
										}}
										// rules={{ ...validation }}
									/>
									{/* {_name[0]?.name?.type === "required" && (
										<FormErrorMessage color="error">
											Required
										</FormErrorMessage>
									)} */}
								</FormControl>
							);
						case ParamType.MOBILE:
							return (
								<FormControl
									key={`${formName}.${index}.${name}`}
									w={{
										base: "100%",
										md: "500px",
									}}
									// isInvalid={Boolean(errors._name)}
								>
									<Input
										id={`${formName}.${index}.${name}`}
										label={label}
										required={required}
										value={value}
										type="number"
										maxLength={10}
										fontSize="sm"
										disabled={disabled}
										{...register(
											`${formName}.${index}.${name}`
											// { ...validation }
										)}
									/>
									{/* {_name[0]?.name?.type === "required" && (
										<FormErrorMessage color="error">
											Required
										</FormErrorMessage>
									)}
									{_name[0]?.name?.type === "pattern" && (
										<FormErrorMessage color="error">
											Please enter correct value
										</FormErrorMessage>
									)}
									{_name[0]?.name?.type === "maxLength" && (
										<FormErrorMessage color="error">
											Length exceeds
										</FormErrorMessage>
									)}
									{_name[0]?.name?.type === "minLength" && (
										<FormErrorMessage color="error">
											Insufficient Characters
										</FormErrorMessage>
									)} */}
								</FormControl>
							);
						case ParamType.NUMERIC:
						case ParamType.TEXT:
							return (
								<FormControl
									key={`${formName}.${index}.${name}`}
									w={{
										base: "100%",
										md: "500px",
									}}
									// isInvalid={Boolean(errors._name)}
								>
									<Input
										id={`${formName}.${index}.${name}`}
										label={label}
										required={required}
										value={value}
										type={
											parameter_type_id ===
											ParamType.NUMERIC
												? "number"
												: "text"
										}
										fontSize="sm"
										disabled={disabled}
										{...register(
											`${formName}.${index}.${name}`
											// { ...validation }
										)}
									/>
									{/* {_name[0]?.name?.type === "required" && (
										<FormErrorMessage color="error">
											Required
										</FormErrorMessage>
									)} */}
								</FormControl>
							);
					}
				}
			)}
		</Flex>
	);
};
