import { Flex, FormControl, FormLabel } from "@chakra-ui/react";
import { Button, Icon, Input, Radio } from "components";
import { productPricingType, products } from "constants";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";

const radioOptions = [
	{
		label: "Yes",
		value: "0",
	},
	{
		label: "No",
		value: "1",
	},
];

/**
 * A AccountVerification tab
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Dmt></Dmt>` TODO: Fix example
 */
const AccountVerification = () => {
	const {
		handleSubmit,
		register,
		watch,
		formState: { errors /* isSubmitting */ },
		control,
		// setValue,
	} = useForm({
		defaultValues: {
			account_verification: "0",
		},
	});

	const watchAccountVerification = watch("account_verification");

	const router = useRouter();

	const handleFormSubmit = (data) => {
		console.log("Submit Data", data);
	};

	const pricingTypeList = [{ value: "1", label: "Fixed (₹)" }];

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex direction="column" gap="8">
				<FormControl
					id="account_verification"
					w={{ base: "100%", md: "500px" }}
				>
					<FormLabel>
						Do you want to enable account verification?
					</FormLabel>
					<Controller
						name="account_verification"
						control={control}
						render={({ field: { onChange, value } }) => (
							<Radio
								options={radioOptions}
								onChange={onChange}
								value={value}
							/>
						)}
					/>
				</FormControl>

				{watchAccountVerification === "0" && (
					<>
						<FormControl
							id="payment_mode"
							w={{ base: "100%", md: "500px" }}
						>
							<FormLabel>Select Pricing Type</FormLabel>
							<Controller
								name="payment_mode"
								control={control}
								defaultValue={
									products.ACCOUNT_VERIFICATION.DEFAULT
										.pricing_type
								}
								render={({ field: { onChange, value } }) => (
									<Radio
										options={pricingTypeList}
										onChange={onChange}
										value={value}
									/>
								)}
							/>
						</FormControl>

						<FormControl
							w={{ base: "100%", md: "500px" }}
							isInvalid={errors?.pricing}
						>
							<Input
								id="actual_pricing"
								required
								label={`Define ${productPricingType.ACCOUNT_VERIFICATION}`}
								inputRightElement={
									<Icon
										name="rupee_bg"
										size="23px"
										color="primary.DEFAULT"
									/>
								}
								type="number"
								step=".01"
								min={
									products.ACCOUNT_VERIFICATION.DEFAULT
										.min_pricing_value
								}
								fontSize="sm"
								placeholder="2.5"
								// invalid={errors.pricing}
								// errorMsg={errors?.title?.message}
								{...register("actual_pricing")}
							/>
						</FormControl>
					</>
				)}

				<Flex
					direction={{ base: "row-reverse", md: "row" }}
					w={{ base: "100%", md: "500px" }}
					position={{ base: "fixed", md: "initial" }}
					gap={{ base: "0", md: "16" }}
					align="center"
					bottom="0"
					left="0"
				>
					<Button
						type="submit"
						size="lg"
						h="64px"
						w={{ base: "100%", md: "250px" }}
						fontWeight="bold"
						borderRadius={{ base: "none", md: "10" }}
					>
						Save Commissions
					</Button>

					<Button
						h={{ base: "64px", md: "auto" }}
						w={{ base: "100%", md: "initial" }}
						bg={{ base: "white", md: "none" }}
						variant="link"
						fontWeight="bold"
						color="primary.DEFAULT"
						_hover={{ textDecoration: "none" }}
						borderRadius={{ base: "none", md: "10" }}
						onClick={() => router.back()}
					>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</form>
	);
};

export default AccountVerification;
