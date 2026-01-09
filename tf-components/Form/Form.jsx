import { FormControl, Grid, Text } from "@chakra-ui/react";
import {
	Calenders,
	Input,
	InputLabel,
	OtpInput,
	Radio,
	Select,
	Textarea,
} from "components";
import { ParamType } from "constants";
import { Controller } from "react-hook-form";
import { Pintwin } from "tf-components";
import { getFormErrorMessage } from "utils";

/**
 * A Form component
 * @param {object} prop Properties passed to the component
 * @param {Array} prop.parameter_list
 * @param prop.register
 * @param prop.formValues
 * @param prop.control
 * @param prop.errors
 * @param {string} [prop.size] Size of the form components: "sm" | "md" | "lg"
 * @param {boolean} [prop.hideOptionalMark] Hide the optional mark on the form fields.
 * @param {Function} [prop.onEnter] Function to be called when Enter key is pressed.
 * @param {...*} rest Rest of the props passed to this component.
 */
const Form = ({
	parameter_list,
	register,
	formValues,
	control,
	errors,
	size = "md",
	hideOptionalMark = false,
	onEnter,
	...rest
}) => {
	// console.log("[Form] State::  ", { formValues, errors, parameter_list });

	return (
		<Grid gap="8" w="100%" {...rest}>
			{parameter_list?.map(
				(
					{
						name,
						label,
						labelStyle,
						required = true,
						value: paramMetaValue,
						disabled,
						list_elements,
						defaultValue,
						parameter_type_id,
						paramType,
						is_multi,
						meta = {},
						multiSelectRenderer,
						validations,
						helperText,
						is_inactive = false,
						lines_min = 0,
						visible_on_param_name,
						visible_on_param_value,
						minDate,
						maxDate,
						...rest
					},
					index
				) => {
					const _validations = required
						? { ...validations, required: true }
						: { ...validations, required: false };

					const value =
						formValues?.[name] ??
						paramMetaValue ??
						defaultValue ??
						"";

					const { force_dropdown } = meta || {};

					if (is_inactive) return;

					if (visible_on_param_name && visible_on_param_value) {
						const _shouldBeVisible = visible_on_param_value.test(
							formValues?.[visible_on_param_name]
						);

						if (!_shouldBeVisible) return;
					}

					switch (parameter_type_id || paramType) {
						case ParamType.FIXED:
							// A fixed value that is not editable: use a hidden input
							return (
								<input
									key={`${name}-${label}-${index}`}
									type="hidden"
									value={paramMetaValue ?? value}
									{...register(name)}
								/>
							);

						case ParamType.PINTWIN:
							return (
								<FormControl
									key={`${name}-${label}-${index}`}
									id={name}
									maxW="500px"
								>
									<Controller
										name={name}
										control={control}
										defaultValue={defaultValue}
										rules={{
											..._validations,
											validate: (value) => {
												if (value.length >= 4) {
													return true;
												}
												return false;
											},
										}}
										render={({ field: { onChange } }) => (
											<Pintwin
												{...{
													label,
													disabled,
													onPinChange: (
														pin,
														encodedPin
													) => {
														onChange(
															encodedPin || pin
														);
													},
													...rest,
												}}
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
											? `⚠ (Required) ${helperText || ""}`
											: helperText || ""}
									</Text>
								</FormControl>
							);

						case ParamType.LABEL:
							return (
								<div key={`${name}-${label}-${index}`}>
									{label ? (
										<InputLabel
											required={required}
											hideOptionalMark={hideOptionalMark}
											{...labelStyle}
										>
											{label}
										</InputLabel>
									) : null}
									<Text fontSize={{ base: "xs", md: "sm" }}>
										{paramMetaValue ?? value}
									</Text>
								</div>
							);

						case ParamType.NUMERIC:
							return (
								<FormControl
									key={`${name}-${label}-${index}`}
									id={name}
									maxW="500px"
								>
									<Controller
										name={name}
										control={control}
										defaultValue={defaultValue}
										rules={{ ..._validations }}
										render={({
											field: { onChange, value, ref },
										}) => (
											<Input
												ref={ref}
												id={name}
												name={name}
												label={label}
												required={required}
												// isNumInput={true}
												hideOptionalMark={
													hideOptionalMark
												}
												value={value}
												step="0.01"
												type="number"
												disabled={disabled}
												labelStyle={labelStyle}
												size={size}
												invalid={!!errors[name]}
												onChange={onChange}
												{...rest}
												// {...register(name, {
												// 	..._validations,
												// })}
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

						case ParamType.MOBILE:
							return (
								<FormControl
									key={`${name}-${label}-${index}`}
									id={name}
									maxW="500px"
								>
									<Controller
										name={name}
										control={control}
										defaultValue={defaultValue}
										rules={{ ..._validations }}
										render={({
											field: { onChange, value, ref },
										}) => (
											<Input
												ref={ref}
												id={name}
												name={name}
												label={label}
												placeholder="XXX XXX XXXX"
												required={required}
												hideOptionalMark={
													hideOptionalMark
												}
												leftAddon="+91" // TODO: Make dynamic based on country code
												value={value}
												// maxW="100%"
												// onChange={onChangeHandler}
												maxLength={12}
												isNumInput={true}
												inputmode="tel"
												disabled={disabled}
												labelStyle={labelStyle}
												size={size}
												invalid={!!errors[name]}
												onChange={onChange}
												// labelStyle={{
												// 	color: "light",
												// }}
												{...rest}
												// {...register(name, {
												// 	..._validations,
												// })}
											/>
										)}
									/>
									{/* <TfInput
										id={name}
										label={label}
										paramType={
											paramType || parameter_type_id
										}
										required={required}
										hideOptionalMark={hideOptionalMark}
										value={value}
										step="1"
										type="number"
										disabled={disabled}
										labelStyle={labelStyle}
										size={size}
										hideErrorMessage
										// invalid={!!errors[name]}
										// errorMessage={getFormErrorMessage(
										// 	name,
										// 	errors
										// )}
										{...rest}
										{...register(name, {
											..._validations,
										})}
									/> */}
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

						case ParamType.OTP:
							return (
								<FormControl
									key={`${name}-${label}-${index}`}
									id={name}
									maxW="500px"
								>
									{label ? (
										<InputLabel
											required={required}
											hideOptionalMark={hideOptionalMark}
											{...labelStyle}
										>
											{label}
										</InputLabel>
									) : null}
									<Controller
										name={name}
										control={control}
										defaultValue={defaultValue}
										rules={{ ..._validations }}
										render={({
											field: { onChange, value, ref },
										}) => (
											<OtpInput
												// inputStyle={{
												// 	w: { base: 12, sm: 14 },
												// 	h: { base: 12 },
												// 	fontSize: "sm",
												// }}
												ref={ref}
												id={name}
												name={name}
												// label={label}
												value={value}
												length={4}
												onChange={onChange}
												size={size}
												disabled={disabled}
												invalid={!!errors[name]}
												onEnter={onEnter}
												onComplete={onEnter}
												// onComplete={(otp) => {
												// 	verifyOtpHandler(otp);
												// }}
												// onKeyDown={onkeyHandler}
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

						case ParamType.FROM_DATE:
							return (
								<FormControl
									key={`${name}-${label}-${index}`}
									id={name}
									maxW="500px"
								>
									<Controller
										name={name}
										control={control}
										defaultValue={defaultValue}
										rules={{ ..._validations }}
										render={({
											field: { onChange, value },
										}) => (
											<Calenders
												{...{
													id: name,
													label,
													value,
													minDate,
													maxDate,
													onChange,
													required,
													disabled,
													labelStyle,
													size,
													hideOptionalMark,
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

						case ParamType.TO_DATE:
							return (
								<FormControl
									key={`${name}-${label}-${index}`}
									id={name}
									maxW="500px"
								>
									<Controller
										name={name}
										control={control}
										defaultValue={defaultValue}
										rules={{ ..._validations }}
										render={({
											field: { onChange, value },
										}) => (
											<Calenders
												{...{
													id: name,
													label,
													value,
													minDate,
													maxDate,
													onChange,
													required,
													disabled,
													labelStyle,
													size,
													hideOptionalMark,
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

						case ParamType.LIST:
							if (list_elements) {
								if (is_multi) {
									return (
										<FormControl
											key={`${name}-${label}-${index}`}
											id={name}
											maxW="500px"
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
															labelStyle,
															size,
															hideOptionalMark,
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
															required,
															options:
																list_elements,
															labelStyle,
															size,
															hideOptionalMark,
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
											maxW="500px"
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
																labelStyle,
																hideOptionalMark,
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
										maxW="500px"
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
															labelStyle,
															size,
															hideOptionalMark,
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
										maxW="500px"
									>
										<Input
											id={name}
											name={name}
											label={label}
											required={required}
											value={value}
											type="text"
											size={size}
											disabled={disabled}
											labelStyle={labelStyle}
											hideOptionalMark={hideOptionalMark}
											invalid={!!errors[name]}
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
