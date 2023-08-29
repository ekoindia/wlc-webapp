import { Flex, FormControl, FormLabel } from "@chakra-ui/react";
import { Button, Input, Radio, Select } from "components";
import { ParamType } from "constants";
import { Controller, useForm } from "react-hook-form";

const AGENT_TYPE = {
	RETAILERS: "0",
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
			onboardAgentType: AGENT_TYPE.RETAILERS,
		},
	});

	const onboardAgentTypeList = [
		{ value: AGENT_TYPE.RETAILERS, label: "Onboard Retailers" },
		{ value: AGENT_TYPE.DISTRIBUTOR, label: "Onboard Distributor" },
	];

	const onboardAgentType = watch("onboardAgentType");

	// const watchAll = watch();
	// console.log("watchAll", watchAll);

	const onboard_seller_request_structure = [
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

	const onSubmit = (data) => {
		console.log("data", data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Flex direction="column" gap="8">
				<Controller
					name="onboardAgentType"
					control={control}
					render={({ field: { onChange, value } }) => (
						<Radio
							value={value}
							options={onboardAgentTypeList}
							onChange={onChange}
						/>
					)}
				/>

				<Form
					{...{
						parameter_list:
							onboardAgentType === AGENT_TYPE.RETAILERS
								? onboard_seller_request_structure
								: onboard_distributor_request_structure,
						register,
					}}
				/>

				<Button
					loading={isSubmitting}
					w={{ base: "100%", md: "215px" }}
					h="64px"
					type="submit"
					size="lg"
				>
					Submit
				</Button>
			</Flex>
		</form>
	);
};

export default SingleOnboarding;

const Form = ({ parameter_list, register, control }) => {
	return (
		<Flex direction="column" gap="8">
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
									id={name}
									w={{ base: "100%", md: "500px" }}
									// isInvalid={errors.priority}
								>
									<FormLabel>{label}</FormLabel>
									<Controller
										name={name}
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
									key={name}
									w={{
										base: "100%",
										md: "500px",
									}}
								>
									<Input
										id={name}
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
										{...register(name)}
									/>
								</FormControl>
							);
					}
				}
			)}
		</Flex>
	);
};
