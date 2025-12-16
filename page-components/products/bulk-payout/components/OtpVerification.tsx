import { Flex, Text } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { ParamType } from "constants/trxnFramework";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components/Form";
import { useBulkPayout } from "../context/BulkPayoutContext";
import { useBulkPayoutApi } from "../hooks/useBulkPayoutApi";

interface OtpVerificationFormData {
	pintwin: string;
}

/**
 * OtpVerification component for verifying customer pintwin/OTP
 * Step 2 in the Bulk Payout flow
 */
const OtpVerification = () => {
	const { customer, isLoading, error, setStep } = useBulkPayout();
	const { verifyPintwin } = useBulkPayoutApi();

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isValid, isDirty, isSubmitting },
	} = useForm<OtpVerificationFormData>({
		mode: "onChange",
	});

	const watcher = useWatch({ control });

	const pintwParameterList = [
		{
			name: "pintwin",
			label: "Enter Pintwin",
			parameter_type_id: ParamType.PINTWIN,
			placeholder: "Enter 4-digit pintwin",
		},
	];

	const handleFormSubmit = async (data: OtpVerificationFormData) => {
		await verifyPintwin(data.pintwin);
	};

	const handleBack = () => {
		setStep("customer-search");
	};

	const buttonConfigList = [
		{
			type: "submit" as const,
			size: "lg",
			label: "Verify",
			loading: isSubmitting || isLoading,
			disabled: !isValid || !isDirty,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			size: "lg",
			label: "Back",
			onClick: handleBack,
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

	return (
		<Flex
			direction="column"
			bg="white"
			p={{ base: 6, md: 10 }}
			borderRadius="15px"
			boxShadow="0px 5px 20px rgba(0, 0, 0, 0.08)"
			border="1px solid"
			borderColor="divider"
			maxW="600px"
			w="100%"
		>
			<Text
				fontSize={{ base: "xl", md: "2xl" }}
				fontWeight="semibold"
				mb="2"
				color="dark"
			>
				Verify Pintwin
			</Text>
			<Text fontSize="sm" color="light" mb="8">
				Enter pintwin to verify customer{" "}
				<Text as="span" fontWeight="semibold" color="primary.DEFAULT">
					{customer?.customerName || customer?.customerNumber}
				</Text>
			</Text>

			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<Flex direction="column" gap="6">
					<Form
						parameter_list={pintwParameterList}
						formValues={watcher}
						control={control}
						register={register}
						errors={errors}
					/>

					{error && (
						<Flex
							bg="red.50"
							color="red.600"
							p="3"
							borderRadius="8px"
							fontSize="sm"
						>
							{error}
						</Flex>
					)}

					<ActionButtonGroup buttonConfigList={buttonConfigList} />
				</Flex>
			</form>
		</Flex>
	);
};

export default OtpVerification;
