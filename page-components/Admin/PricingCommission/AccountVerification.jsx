import { Flex, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { Button, Radio } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const OPERATION = {
	SUBMIT: 1,
	FETCH: 0,
};

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

const accountVerificationOptions = [
	{
		label: "Yes",
		otp_verification_token: "0",
	},
	{
		label: "No",
		otp_verification_token: "1",
	},
];

const accountVerificationRenderer = {
	label: "label",
	value: "otp_verification_token",
};

/**
 * A AccountVerification tab page-component
 * @example	<AccountVerification/>
 */
const AccountVerification = () => {
	const {
		handleSubmit,
		// register,
		watch,
		formState: { /*  errors , */ isSubmitting },
		control,
		reset,
	} = useForm();

	const toast = useToast();
	const { accessToken } = useSession();
	const router = useRouter();
	const [accountVerificationStatus, setAccountVerificationStatus] =
		useState(null);

	const watchAccountVerificationStatus = watch("account_verification");

	// const pricingTypeList = [{ value: "1", label: "Fixed (₹)" }];

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: 737,
				operation: OPERATION.FETCH,
			},
			token: accessToken,
		})
			.then((res) => {
				const _accountVerification = res?.data?.otp_verification_token;
				setAccountVerificationStatus(_accountVerification);
			})
			.catch((err) => {
				console.error("error", err);
			});
	}, []);

	useEffect(() => {
		if (accountVerificationStatus !== null) {
			let defaultValues = {};
			defaultValues.account_verification = accountVerificationStatus;
			reset({ ...defaultValues });
		}
	}, [accountVerificationStatus]);

	const handleFormSubmit = (data) => {
		const { account_verification } = data ?? {};
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: 737,
				operation: OPERATION.SUBMIT,
				otp_verification_token: account_verification,
			},
			token: accessToken,
		})
			.then((res) => {
				const _accountVerification = res?.data?.otp_verification_token;
				setAccountVerificationStatus(_accountVerification);
				toast({
					title: res.message,
					status: getStatus(res.status),
					duration: 5000,
					isClosable: true,
				});
			})
			.catch((err) => {
				console.error("error", err);
			});
	};

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
								options={accountVerificationOptions}
								onChange={onChange}
								value={value}
								renderer={accountVerificationRenderer}
							/>
						)}
					/>
				</FormControl>

				{/* {watchAccountVerification === "0" && (
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
				)} */}

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
						disabled={
							accountVerificationStatus ===
							watchAccountVerificationStatus
						}
						loading={isSubmitting}
					>
						Save
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
