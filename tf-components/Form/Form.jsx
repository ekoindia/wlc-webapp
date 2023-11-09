import { FormControl, Grid, Text } from "@chakra-ui/react";
import { Input, Radio, Select, Textarea } from "components";
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
		<Grid gap="8" w="100%" {...rest}>
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
						parameter_type_id = ParamType.TEXT,
						is_multi,
						meta = {},
						multiSelectRenderer,
						validations,
						helperText,
						is_inactive = false,
						lines_min = 0,
						visible_on_param_name,
						visible_on_param_value,
						...rest
					},
					index
				) => {
					const _validations = required
						? { required: true, ...validations }
						: { ...validations };

					const { force_dropdown } = meta;

					if (is_inactive) return;

					if (visible_on_param_name && visible_on_param_value) {
						const _shouldBeVisible = visible_on_param_value.test(
							formValues?.[visible_on_param_name]
						);

						if (!_shouldBeVisible) return;
					}

					switch (parameter_type_id) {
						case ParamType.NUMERIC:
							return (
								<FormControl
									key={`${name}-${label}-${index}`}
									id={name}
									w={{ base: "auto", md: "500px" }}
								>
									<Input
										id={name}
										label={label}
										required={required}
										value={value}
										step="0.01"
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
											..._validations,
										})}
									/>
									<Text
										fontSize="xs"
										fontWeight="medium"
										color={
											errors[name]
												? "error"
												: "primary.dark"
										}
									>
										{errors[name]
											? `⚠ (${getFormErrorMessage(
													name,
													errors
											  )}) ${helperText || ""}`
											: helperText || ""}
									</Text>
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
										>
											<Controller
												name={name}
												control={control}
												defaultValue={defaultValue}
												rules={{ ..._validations }}
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
											/>
											<Text
												fontSize="xs"
												fontWeight="medium"
												color={
													errors[name]
														? "error"
														: "primary.dark"
												}
											>
												{errors[name]
													? `⚠ (${getFormErrorMessage(
															name,
															errors
													  )}) ${helperText || ""}`
													: helperText || ""}
											</Text>
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
										>
											<Controller
												name={name}
												control={control}
												defaultValue={defaultValue}
												rules={{ ..._validations }}
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
											/>
											<Text
												fontSize="xs"
												fontWeight="medium"
												color={
													errors[name]
														? "error"
														: "primary.dark"
												}
											>
												{errors[name]
													? `⚠ (${getFormErrorMessage(
															name,
															errors
													  )}) ${helperText || ""}`
													: helperText || ""}
											</Text>
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
										>
											<Controller
												name={name}
												control={control}
												defaultValue={defaultValue}
												rules={{ ..._validations }}
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
											/>
											<Text
												fontSize="xs"
												fontWeight="medium"
												color={
													errors[name]
														? "error"
														: "primary.dark"
												}
											>
												{errors[name]
													? `⚠ (${getFormErrorMessage(
															name,
															errors
													  )}) ${helperText || ""}`
													: helperText || ""}
											</Text>
										</FormControl>
									);
								}
							}
							break;
						default:
							if (lines_min > 1) {
								return (
									<FormControl
										key={`${name}-${label}-${index}`}
										id={name}
										w={{ base: "auto", md: "500px" }}
									>
										<Controller
											name={name}
											control={control}
											defaultValue={defaultValue}
											rules={{ ..._validations }}
											render={({
												field: { onChange, value },
											}) => {
												return (
													<Textarea
														{...{
															id: name,
															label,
															required,
															value,
															disabled,
															onChange,
														}}
														{...rest}
													/>
												);
											}}
										/>
										<Text
											fontSize="xs"
											fontWeight="medium"
											color={
												errors[name]
													? "error"
													: "primary.dark"
											}
										>
											{errors[name]
												? `⚠ (${getFormErrorMessage(
														name,
														errors
												  )}) ${helperText || ""}`
												: helperText || ""}
										</Text>
									</FormControl>
								);
							} else {
								return (
									<FormControl
										key={`${name}-${label}-${index}`}
										id={name}
										w={{ base: "auto", md: "500px" }}
									>
										<Input
											id={name}
											label={label}
											required={required}
											value={value}
											type="text"
											fontSize="sm"
											disabled={disabled}
											{...rest}
											{...register(name, {
												..._validations,
											})}
										/>
										<Text
											fontSize="xs"
											fontWeight="medium"
											color={
												errors[name]
													? "error"
													: "primary.dark"
											}
										>
											{errors[name]
												? `⚠ (${getFormErrorMessage(
														name,
														errors
												  )}) ${helperText || ""}`
												: helperText || ""}
										</Text>
									</FormControl>
								);
							}
					}
				}
			)}
		</Grid>
	);
};

export default Form;
