import { Flex, useToast } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { Endpoints, ParamType, products } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

const OPERATION = {
	VERIFICATION_SUBMIT: 2,
	SUBMIT: 1,
	FETCH: 0,
};

const account_verification_operation = [
	{
		label: "Mandatory",
		value: "0",
	},
	{
		label: "Optional",
		value: "1",
	},
];

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

const OptionalVerification = () => {
	const { DEFAULT } = products.ACCOUNT_VERIFICATION;
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
		defaultValues: {
			operation_type: DEFAULT.operation_type,
			pricing_type: DEFAULT.pricing_type,
		},
	});

	const toast = useToast();
	const { accessToken } = useSession();
	const router = useRouter();
	const { generateNewToken } = useRefreshToken();
	const [accountVerificationStatus, setAccountVerificationStatus] =
		useState(null);

	const watcher = useWatch({
		control,
	});

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset(watcher);
		}
		if (isDirty && !isValid) {
			trigger();
		}
	}, [isSubmitSuccessful, isValid]);

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: 737,
				operation: OPERATION.FETCH,
			},
			token: accessToken,
			generateNewToken,
		})
			.then((res) => {
				const _otp_verification_token =
					res?.data?.otp_verification_token;
				reset({ otp_verification_token: _otp_verification_token });
				setAccountVerificationStatus(_otp_verification_token);
			})
			.catch((err) => {
				console.error("error", err);
			});
	}, []);

	const optional_verification_parameter_list = [
		{
			name: "otp_verification_token",
			label: `Account Verification`,
			parameter_type_id: ParamType.LIST,
			list_elements: account_verification_operation,
			defaultValue: DEFAULT.operation_type,
		},
		{
			name: "note",
			label: "Info:",
			parameter_type_id: ParamType.LABEL,
			value: "Choose whether Account Verification for Money Transfer Recipients is mandatory or optional for agents in your network.",
		},
	];

	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Save",
			loading: isSubmitting,
			disabled:
				accountVerificationStatus &&
				accountVerificationStatus == watcher.otp_verification_token,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: () => router.back(),
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

	const handleFormSubmit = (data) => {
		const _finalData = { ...data };

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: 737,
				operation: OPERATION.VERIFICATION_SUBMIT,
				..._finalData,
			},
			token: accessToken,
		})
			.then((res) => {
				const _otp_verification_token =
					res?.data?.otp_verification_token;
				setAccountVerificationStatus(_otp_verification_token);
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
				<Form
					{...{
						parameter_list: optional_verification_parameter_list,
						register,
						control,
						formValues: watcher,
						errors,
					}}
				/>

				<ActionButtonGroup {...{ buttonConfigList }} />
			</Flex>
		</form>
	);
};

export { OptionalVerification };
