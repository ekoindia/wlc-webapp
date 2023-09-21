import { Flex, FormControl, FormLabel } from "@chakra-ui/react";
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
const Form = ({ parameter_list, register, control, ...rest }) => {
	return (
		<Flex direction="column" gap="8" {...rest}>
			{parameter_list?.map(
				({
					name,
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
								<FormControl
									id={name}
									w={{ base: "auto", md: "500px" }}
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
										{...register(name, {
											...validations,
										})}
									/>
								</FormControl>
							);
						case ParamType.LIST:
							if (list_elements) {
								if (is_multi_select) {
									return (
										<FormControl
											id={name}
											w={{
												base: "auto",
												md: "500px",
											}}
										>
											<FormLabel>{label}</FormLabel>
											<Controller
												name={name}
												control={control}
												defaultValue={defaultValue}
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
										<FormControl id={name}>
											<FormLabel>{label}</FormLabel>
											<Controller
												name={name}
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
											id={name}
											w={{
												base: "auto",
												md: "500px",
											}}
										>
											<FormLabel>{label}</FormLabel>
											<Controller
												name={name}
												control={control}
												defaultValue={defaultValue}
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
		</Flex>
	);
};

export default Form;
