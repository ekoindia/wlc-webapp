import { FormControl, FormLabel, Grid } from "@chakra-ui/react";
import { Input, MultiSelect, Radio, Select } from "components";
import { ParamType } from "constants";
import { Controller } from "react-hook-form";

/**
 * A Form component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Form></Form>` TODO: Fix example
 */
const Form = ({ list_parameters, register, control, ...rest }) => {
	return (
		<Grid
			templateColumns={{
				base: "repeat(1,1fr)",
				md: "repeat(auto-fit,minmax(400px,1fr))",
			}}
			gap="8"
			maxW={{ base: "100%", md: "1000px" }}
			{...rest}
		>
			{list_parameters?.map(
				({
					id,
					label,
					required,
					value,
					disabled,
					list_elements,
					defaultValue,
					parameter_type_id,
					is_multi_select,
					is_radio,
					multiSelectRenderer,
					validations,
					// dependent,
				}) => {
					//handle dependent

					switch (parameter_type_id) {
						case ParamType.NUMERIC:
						case ParamType.TEXT:
							return (
								<FormControl key={id}>
									<Input
										id={id}
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
										{...register(id, { ...validations })}
									/>
								</FormControl>
							);
						case ParamType.LIST:
							if (list_elements) {
								if (is_multi_select) {
									return (
										<FormControl id={id}>
											<FormLabel>{label}</FormLabel>
											<Controller
												name={id}
												control={control}
												render={({
													field: { onChange },
												}) => (
													<MultiSelect
														options={list_elements}
														renderer={
															multiSelectRenderer
														}
														onChange={onChange}
													/>
												)}
												rules={{ ...validations }}
											/>
										</FormControl>
									);
								} else if (is_radio) {
									return (
										<FormControl id={id}>
											<FormLabel>{label}</FormLabel>
											<Controller
												name={id}
												control={control}
												defaultValue={defaultValue}
												render={({
													field: { onChange, value },
												}) => (
													<Radio
														options={list_elements}
														onChange={onChange}
														value={value}
													/>
												)}
												rules={{ ...validations }}
											/>
										</FormControl>
									);
								} else {
									return (
										<FormControl
											id={id}
											// isInvalid={errors.priority}
										>
											<FormLabel>{label}</FormLabel>
											<Controller
												name={id}
												control={control}
												render={({
													field: { onChange, value },
												}) => {
													return (
														<Select
															value={value}
															options={
																list_elements
															}
															onChange={onChange}
														/>
													);
												}}
												rules={{ ...validations }}
											/>
										</FormControl>
									);
								}
							}
					}
				}
			)}
		</Grid>
	);
};

export default Form;
