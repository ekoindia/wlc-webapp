import { FormControl, Grid, Text } from "@chakra-ui/react";
import {
	Calendar,
	Dropzone,
	Input,
	InputLabel,
	OtpInput,
	Radio,
	Select,
	Textarea,
} from "components";
import { ParamType } from "constants";
import { Controller } from "react-hook-form";
import { getFormErrorMessage } from "utils";

/**
 * A dynamic Form component that renders form fields based on a parameter list configuration.
 *
 * This component supports multiple field types including text, numeric, date, select, radio,
 * OTP, mobile, and textarea inputs. It integrates with react-hook-form for form state management and validation.
 *
 * ## Supported Parameter Types (via `parameter_type_id`):
 * - `ParamType.TEXT` (12) - Standard text input (default)
 * - `ParamType.NUMERIC` (11) - Numeric input with step support
 * - `ParamType.MOBILE` - Mobile number input with +91 prefix
 * - `ParamType.OTP` - OTP input with configurable length (default: 4 digits)
 * - `ParamType.DATETIME` (14) - Date picker without addon
 * - `ParamType.FROM_DATE` (16) - Date picker with "From" addon
 * - `ParamType.TO_DATE` (17) - Date picker with "To" addon
 * - `ParamType.LIST` (3) - Radio buttons (< 4 options) or Select dropdown
 * - `ParamType.FIXED` (1) - Hidden fixed value input
 * - `ParamType.LABEL` (20) - Display-only text label
 * @param {object} props - Component properties
 * @param {Array<object>} props.parameter_list - Array of field configurations
 * @param {string} props.parameter_list[].name - Field name (used as form key)
 * @param {string} props.parameter_list[].label - Field label text
 * @param {boolean} [props.parameter_list[].required] - Whether field is required
 * @param {number} [props.parameter_list[].parameter_type_id] - Field type ID from ParamType constants
 * @param {*} [props.parameter_list[].value] - Field value (for fixed/display fields)
 * @param {*} [props.parameter_list[].defaultValue] - Default value for controlled fields
 * @param {boolean} [props.parameter_list[].disabled] - Whether field is disabled
 * @param {Array} [props.parameter_list[].list_elements] - Options for LIST type
 * @param {boolean} [props.parameter_list[].is_multi] - Enable multi-select for LIST type
 * @param {object} [props.parameter_list[].validations] - react-hook-form validation rules
 * @param {string} [props.parameter_list[].helperText] - Helper text shown below field
 * @param {string} [props.parameter_list[].minDate] - Min date for date fields (YYYY-MM-DD)
 * @param {string} [props.parameter_list[].maxDate] - Max date for date fields (YYYY-MM-DD)
 * @param {number} [props.parameter_list[].lines_min] - Min lines for textarea (> 1 enables textarea)
 * @param {boolean} [props.parameter_list[].is_inactive] - Skip rendering if true
 * @param {string} [props.parameter_list[].visible_on_param_name] - Conditional visibility based on another field
 * @param {RegExp} [props.parameter_list[].visible_on_param_value] - Regex pattern to test for conditional visibility
 * @param {object} [props.parameter_list[].meta] - Additional metadata (e.g., force_dropdown for LIST)
 * @param {object} [props.parameter_list[].labelStyle] - Custom styles for the label
 * @param {Function} props.register - react-hook-form register function
 * @param {object} props.formValues - Current form values from watch()
 * @param {object} props.control - react-hook-form control object
 * @param {object} props.errors - react-hook-form errors object
 * @param {("sm"|"md"|"lg")} [props.size] - Size of form components (default: "md")
 * @param {boolean} [props.hideOptionalMark] - Hide "(optional)" text on non-required fields (default: false)
 * @param {Function} [props.onEnter] - Callback function for Enter key press (used by OTP input on complete)
 * @returns {JSX.Element} A Grid containing rendered form fields
 * @example
 * ```jsx
 * import { useForm } from "react-hook-form";
 * import { Form } from "tf-components";
 * import { ParamType } from "constants";
 *
 * const MyForm = () => {
 *   const { register, control, handleSubmit, watch, formState: { errors } } = useForm();
 *
 *   const fields = [
 *     { name: "name", label: "Full Name", required: true },
 *     { name: "mobile", label: "Mobile", parameter_type_id: ParamType.MOBILE },
 *     { name: "otp", label: "Enter OTP", parameter_type_id: ParamType.OTP },
 *     { name: "dob", label: "Date of Birth", parameter_type_id: ParamType.DATETIME },
 *   ];
 *
 *   return (
 *     <Form
 *       parameter_list={fields}
 *       register={register}
 *       control={control}
 *       errors={errors}
 *       formValues={watch()}
 *       onEnter={(otp) => console.log("OTP entered:", otp)}
 *     />
 *   );
 * };
 * ```
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

						case ParamType.FILE:
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
											<Dropzone
												id={name}
												label={label}
												file={value}
												setFile={onChange}
												accept={meta?.accept || ""}
												cameraOnly={
													meta?.cameraOnly || false
												}
												watermark={
													meta?.watermark || false
												}
												options={meta?.options || {}}
												required={required}
												disabled={disabled}
												hideOptionalMark={
													hideOptionalMark
												}
												labelStyle={labelStyle}
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
												length={meta?.length ?? 4}
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
						case ParamType.DATETIME:
						case ParamType.FROM_DATE:
						case ParamType.TO_DATE: {
							// Determine leftAddon based on type
							const dateLeftAddon =
								parameter_type_id === ParamType.FROM_DATE
									? "From"
									: parameter_type_id === ParamType.TO_DATE
										? "To"
										: undefined;

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
											<Calendar
												{...{
													id: name,
													label,
													value,
													leftAddon: dateLeftAddon,
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
						}

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
