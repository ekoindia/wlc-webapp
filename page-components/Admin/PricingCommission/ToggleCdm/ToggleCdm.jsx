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

/**
 * A <ToggleCdm> component
 * Toggle Cash Deposit
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<ToggleCdm></ToggleCdm>` TODO: Fix example
 */

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

const OPERATION = {
	SUBMIT: 4,
	FETCH: 5,
};

const cdm_status_list = [
	{
		label: "On",
		value: "1",
	},
	{
		label: "Off",
		value: "0",
	},
];

const ToggleCdm = () => {
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
	const [cashDeposit, setCashDeposit] = useState(null);
	const cdm_parameter_list = [
		{
			name: "cdm_charges",
			label: `Deduct Cash Deposit charges from Agents`,
			parameter_type_id: ParamType.LIST,
			list_elements: cdm_status_list,
		},
		{
			name: "note",
			label: "Info:",
			parameter_type_id: ParamType.LABEL,
			value: "Choose whether to deduct cash-deposit charges from the agents (Retailers, Distributors, etc) in your network. Note that if not deducting from agents, the charges will still be deducted from your account.",
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
				const _cdm_charges = res?.data?.cdm_charges;
				setCashDeposit(_cdm_charges);
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
				service_code: 320,
			},
			token: accessToken,
		})
			.then((res) => {
				const _cdm_charges = res?.data?.cdm_charges;
				reset({ cdm_charges: _cdm_charges });
				setCashDeposit(_cdm_charges);
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
						parameter_list: cdm_parameter_list,
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
							(cashDeposit && cashDeposit == watcher.cdm_charges)
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

export default ToggleCdm;
