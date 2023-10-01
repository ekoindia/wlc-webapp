import {
	Flex,
	FormControl,
	FormErrorMessage,
	FormHelperText,
} from "@chakra-ui/react";
import { Input, Radio, Select } from "components";
import { ParamType } from "constants";
import { Controller } from "react-hook-form";
import { getFormErrorMessage } from "utils";

/**
 * A Form component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Form></Form>` TODO: Fix example
 */
const Form = ({
	parameter_list,
	register,
	formValues,
	control,
	errors,
	...rest
}) => {
	return (
		<Flex direction="column" gap="8" {...rest}>
			{parameter_list?.map(
				(
					{
						name,
						label,
						required = true,
						value,
						disabled,
						list_elements,
						defaultValue,
						parameter_type_id,
						is_multi,
						meta = {},
						multiSelectRenderer,
						validations,
						helperText,
						visible_on_param_name,
						visible_on_param_value,
						...rest
					},
					index
				) => {
					const { force_dropdown } = meta;

					if (visible_on_param_name && visible_on_param_value) {
						const _shouldBeVisible = visible_on_param_value.test(
							formValues?.[visible_on_param_name]
						);

						if (!_shouldBeVisible) return;
					}

					switch (parameter_type_id) {
						case ParamType.NUMERIC:
						case ParamType.TEXT:
							return (
								<FormControl
									key={`${name}-${label}-${index}`}
									id={name}
									w={{ base: "auto", md: "500px" }}
									isRequired={required}
									isInvalid={errors[name]}
								>
									<Input
										id={name}
										label={label}
										required={required}
										value={value}
										step="0.1"
										type={
											parameter_type_id ===
											ParamType.NUMERIC
												? "number"
												: "text"
										}
										fontSize="sm"
										disabled={disabled}
										{...rest}
										{...register(name, {
											...validations,
										})}
									/>
									{errors[name] ? (
										<FormErrorMessage>
											{getFormErrorMessage(name, errors)}
										</FormErrorMessage>
									) : helperText !== undefined ? (
										<FormHelperText>
											{helperText}
										</FormHelperText>
									) : null}
								</FormControl>
							);
						case ParamType.LIST:
							if (list_elements) {
								if (is_multi) {
									return (
										<FormControl
											key={`${name}-${label}-${index}`}
											id={name}
											w={{
												base: "auto",
												md: "500px",
											}}
											isRequired={required}
										>
											<Controller
												name={name}
												control={control}
												defaultValue={defaultValue}
												render={({
													field: { onChange },
												}) => (
													<Select
														{...{
															value,
															id: name,
															label,
															onChange,
															options:
																list_elements,
															renderer:
																multiSelectRenderer,
															required,
															isMulti: true,
														}}
														{...rest}
													/>
												)}
												rules={{ ...validations }}
											/>
											{errors[name] ? (
												<FormErrorMessage>
													{getFormErrorMessage(
														name,
														errors
													)}
												</FormErrorMessage>
											) : helperText !== undefined ? (
												<FormHelperText>
													{helperText}
												</FormHelperText>
											) : null}
										</FormControl>
									);
								} else if (
									list_elements.length < 4 &&
									!force_dropdown
								) {
									return (
										<FormControl
											key={`${name}-${label}-${index}`}
											id={name}
											isRequired={required}
										>
											<Controller
												name={name}
												control={control}
												defaultValue={defaultValue}
												render={({
													field: { onChange, value },
												}) => (
													<Radio
														{...{
															id: name,
															label,
															value,
															onChange,
															options:
																list_elements,
														}}
														{...rest}
													/>
												)}
												rules={{ ...validations }}
											/>
											{errors[name] ? (
												<FormErrorMessage>
													{getFormErrorMessage(
														name,
														errors
													)}
												</FormErrorMessage>
											) : helperText !== undefined ? (
												<FormHelperText>
													{helperText}
												</FormHelperText>
											) : null}
										</FormControl>
									);
								} else {
									return (
										<FormControl
											key={`${name}-${label}-${index}`}
											id={name}
											w={{
												base: "auto",
												md: "500px",
											}}
											isRequired={required}
										>
											<Controller
												name={name}
												control={control}
												defaultValue={defaultValue}
												render={({
													field: { onChange, value },
												}) => {
													return (
														<Select
															{...{
																id: name,
																label,
																value,
																onChange,
																required,
																options:
																	list_elements,
															}}
															{...rest}
														/>
													);
												}}
												rules={{ ...validations }}
											/>
											{errors[name] ? (
												<FormErrorMessage>
													{getFormErrorMessage(
														name,
														errors
													)}
												</FormErrorMessage>
											) : helperText !== undefined ? (
												<FormHelperText>
													{helperText}
												</FormHelperText>
											) : null}
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
