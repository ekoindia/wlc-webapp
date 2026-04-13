import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Text,
	useToast,
} from "@chakra-ui/react";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useState } from "react";
import { StepHeader } from "../../components/StepHeader";
import { ANIMATION } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface CustomerOnboardingStepProps {
	mobile: string;
	onSuccess: () => void;
}

/**
 * Step for collecting customer name during onboarding.
 * Shown when responseType === 308 (sender onboarding required).
 * On success, calls onSuccess to trigger fetchBalance again.
 * @param {object} root0 - Component props
 * @param {string} root0.mobile - User's mobile number for API calls
 * @param {() => void} root0.onSuccess - Callback invoked after successful account creation
 * @returns {JSX.Element} Customer name input form with validation
 */
export const CustomerOnboardingStep = ({
	mobile,
	onSuccess,
}: CustomerOnboardingStepProps): JSX.Element => {
	const { dispatch } = useDigiKhata();
	const { createCustomerAccount, isCreatingCustomerAccount } =
		useDigiKhataApi(mobile);

	const toast = useToast();
	const [customerName, setCustomerName] = useState("");
	const [nameError, setNameError] = useState("");

	const validateName = (name: string): boolean => {
		const trimmed = name.trim();
		if (!trimmed) {
			setNameError("Customer name is required");
			return false;
		}
		if (trimmed.length < 3) {
			setNameError("Name must be at least 3 characters");
			return false;
		}
		setNameError("");
		return true;
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setCustomerName(value);
		if (nameError) {
			validateName(value);
		}
	};

	const handleSubmit = async () => {
		if (!validateName(customerName)) {
			return;
		}

		dispatch({ type: "SET_LOADING", payload: true });
		dispatch({ type: "RESET_ERROR" });

		try {
			const res = await createCustomerAccount({
				name: customerName.trim(),
				mobile: mobile,
			});

			if (res?.data?.status === 0) {
				toast({
					title: "Customer details saved",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
				onSuccess();
			} else {
				const errorMsg =
					res?.data?.message || "Failed to save customer details";
				dispatch({ type: "SET_ERROR", payload: errorMsg });
				toast({
					title: errorMsg,
					description: res?.data?.data?.description ?? "",
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			}
		} catch (_error) {
			const errorMsg =
				"Failed to save customer details. Please try again.";
			dispatch({ type: "SET_ERROR", payload: errorMsg });
			toast({
				title: errorMsg,
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	};

	return (
		<Flex
			direction="column"
			gap={5}
			sx={{
				animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
				animationDelay: ANIMATION.STEP_IN_DELAY,
			}}
		>
			<StepHeader
				title="Customer Details"
				subtitle="Please provide the vendor's name to complete onboarding."
			/>

			<Box>
				<FormControl isInvalid={!!nameError}>
					<FormLabel>
						Vendor&apos;s Full Name (as per ID proof)
						<Text as="span" color="error" ml={1}>
							(Required)
						</Text>
					</FormLabel>
					<Input
						placeholder="Enter full name"
						value={customerName}
						onChange={handleNameChange}
						borderColor={nameError ? "error" : "hint"}
						_hover={{ borderColor: nameError ? "error" : "hint" }}
						_focus={{
							borderColor: nameError ? "error" : "primary.light",
							boxShadow: `0 0 0 1px ${nameError ? "error" : "primary.light"}`,
						}}
					/>
				</FormControl>
			</Box>

			<Button
				w="full"
				bg="primary.DEFAULT"
				color="white"
				borderRadius="10"
				size="lg"
				isDisabled={!customerName.trim() || isCreatingCustomerAccount}
				isLoading={isCreatingCustomerAccount}
				onClick={handleSubmit}
				sx={{
					animation: `${fadeSlideInBottom12} 0.18s ${ANIMATION.EASING} both`,
					animationDelay: ANIMATION.CTA_DELAY,
				}}
				_hover={{ bg: "primary.dark" }}
			>
				Proceed →
			</Button>
		</Flex>
	);
};
