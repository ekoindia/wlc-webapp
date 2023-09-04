import { Box, Flex, FormControl, FormLabel } from "@chakra-ui/react";
import { Button, Input, Radio, Select } from "components";
import { ParamType } from "constants";
import { Controller, useFieldArray, useForm } from "react-hook-form";

const AGENT_TYPE = {
	RETAILER: "0",
	DISTRIBUTOR: "2",
};

/**
 * A SingleOnboarding page-component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<SingleOnboarding></SingleOnboarding>` TODO: Fix example
 */

const SingleOnboarding = () => {
	const {
		register,
		handleSubmit,
		formState: { /*  errors, */ isSubmitting },
		// reset,
		watch,
		control,
	} = useForm({
		defaultValues: {
			onboardAgentType: AGENT_TYPE.RETAILER,
			// [formName]: [generateKeys(AGENT_REQUEST_STRUCTURE.RETAILER)],
		},
	});

	const formName = "onboardAgents";

	const { fields, append, remove } = useFieldArray({
		name: formName,
		control,
	});

	const onboard_retailer_request_structure = [
		{
			name: "mobile_number",
			label: "Mobile Number",
			required: true,
			parameter_type_id: ParamType.NUMERIC,
		},
		{
			name: "name",
			label: "Name",
			required: true,
			parameter_type_id: ParamType.TEXT,
		},
		{
			name: "scsp_mobile_number",
			label: "Distributor's Mobile Number",
			required: false,
			parameter_type_id: ParamType.NUMERIC,
		},
	];

	const onboard_distributor_request_structure = [
		{
			name: "mobile_number",
			label: "Mobile Number",
			required: true,
			parameter_type_id: ParamType.NUMERIC,
		},
		{
			name: "name",
			label: "Name",
			required: true,
			parameter_type_id: ParamType.TEXT,
		},
	];

	const onboardAgentType = watch("onboardAgentType");

	const onboardAgentTypeList = [
		{ value: AGENT_TYPE.RETAILER, label: "Onboard Retailers" },
		{ value: AGENT_TYPE.DISTRIBUTOR, label: "Onboard Distributor" },
	];

	const onSubmit = (data) => {
		console.log("data", data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap="8">
					<Controller
						name="onboardAgentType"
						control={control}
						render={({ field: { onChange, value } }) => (
							<Radio
								{...{
									value,
									onChange,
									options: onboardAgentTypeList,
								}}
							/>
						)}
					/>
					{fields.map((item, index) => (
						<Flex direction="column" gap="8" key={index}>
							<Form
								{...{
									parameter_list:
										onboardAgentType === AGENT_TYPE.RETAILER
											? onboard_retailer_request_structure
											: onboard_distributor_request_structure,
									register,
									item,
									index,
									formName,
								}}
							/>
							<Button
								type="button"
								w={{ base: "100%", md: "160px" }}
								h="48px"
								onClick={() => remove(index)}
							>
								Remove
							</Button>
							<Box w="100%" h="2px" bg="divider"></Box>
						</Flex>
					))}

					<Button
						type="button"
						w={{ base: "100%", md: "160px" }}
						h="48px"
						onClick={() => {
							let _appendList = { mobile_number: "", name: "" };

							if (onboardAgentType === AGENT_TYPE.RETAILER) {
								_appendList = {
									..._appendList,
									scsp_mobile_number: "",
								};
							}
							append({
								..._appendList,
							});
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
					>
						Submit
					</Button>
				</Flex>
			</form>
		</div>
	);
};

export default SingleOnboarding;

const Form = ({ parameter_list, register, control, item, index, formName }) => {
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
				}) => {
					switch (parameter_type_id) {
						case ParamType.LIST:
							return (
								<FormControl
									key={`${formName}.${index}.${name}`}
									w={{ base: "100%", md: "500px" }}
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
									/>
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
										)}
									/>
								</FormControl>
							);
					}
				}
			)}
		</Flex>
	);
};
