import { Flex, useToast } from "@chakra-ui/react";
import { Button } from "components";
import { Endpoints, ParamType } from "constants";
import { useSession } from "contexts/";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

const OPERATION = {
	SUBMIT: 3,
	FETCH: 0,
};

const refund_method_list = [
	{ value: "0", label: "Customer’s OTP" },
	{ value: "1", label: "Agent’s Secret PIN" },
];

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

/**
 * A RefundMethod page component
 * @example	`<RefundMethod></RefundMethod>` TODO: Fix example
 */
const RefundMethod = () => {
	const {
		handleSubmit,
		register,
		control,
		formState: {
			errors,
			isValid,
			isDirty,
			isSubmitting,
			isSubmitSuccessful,
		},
		reset,
		trigger,
	} = useForm({
		mode: "onChange",
	});

	const watcher = useWatch({
		control,
	});

	const toast = useToast();
	const router = useRouter();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const [refundMethod, setRefundMethod] = useState(null);

	const refund_method_parameter_list = [
		{
			name: "otp_verification_token",
			label: `Refund Using`,
			parameter_type_id: ParamType.LIST,
			list_elements: refund_method_list,
		},
		{
			name: "note",
			label: "Note:",
			parameter_type_id: ParamType.LABEL,
			value:
				watcher.otp_verification_token == 0
					? "Transactions will be Refunded using an OTP received by the Customer (Recommended)"
					: watcher.otp_verification_token == 1
						? "Transactions will be Refunded using the Agent’s own Secret PIN. If you choose this option, it would be possible for Agents within your network to Refund failed transactions using their Secret PIN without the customer’s knowledge. By choosing this setting, your organization agrees to accept the responsibility of any potential misuse."
						: null,
		},
	];

	const handleFormSubmit = (data) => {
		const _finalData = { ...data };

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: 737,
				operation: OPERATION.SUBMIT,
				..._finalData,
			},
			token: accessToken,
			generateNewToken,
		})
			.then((res) => {
				const _otp_verification_token =
					res?.data?.otp_verification_token;
				setRefundMethod(_otp_verification_token);
				toast({
					title: res.message,
					status: getStatus(res.status),
					duration: 6000,
					isClosable: true,
				});
				// handleReset();
			})
			.catch((error) => {
				console.error("📡Error:", error);
			});
	};

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: 737,
				operation: OPERATION.FETCH,
				operation_type: 3,
			},
			token: accessToken,
		})
			.then((res) => {
				const _otp_verification_token =
					res?.data?.otp_verification_token;
				reset({ otp_verification_token: _otp_verification_token });
				setRefundMethod(_otp_verification_token);
			})
			.catch((err) => {
				console.error("error", err);
			});
	}, []);

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset(watcher);
		}
		if (isDirty && !isValid) {
			trigger();
		}
	}, [isSubmitSuccessful, isValid]);

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex direction="column" gap="8">
				<Form
					{...{
						parameter_list: refund_method_parameter_list,
						formValues: watcher,
						control,
						register,
						errors,
					}}
				/>
				<Flex
					direction={{ base: "row-reverse", md: "row" }}
					w={{ base: "100%", md: "500px" }}
					position={{ base: "fixed", md: "initial" }}
					gap={{ base: "0", md: "16" }}
					align="center"
					bottom="0"
					left="0"
					bg="white"
				>
					<Button
						type="submit"
						size="lg"
						h="64px"
						w={{ base: "100%", md: "200px" }}
						fontWeight="bold"
						borderRadius={{ base: "none", md: "10" }}
						loading={isSubmitting}
						disabled={
							!isValid ||
							!isDirty ||
							(refundMethod &&
								refundMethod == watcher.otp_verification_token)
						}
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

export default RefundMethod;
