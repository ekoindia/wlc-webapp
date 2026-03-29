import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import { Modal } from "components/Modal";
import { OtpInput } from "components/OtpInput";
import { useState } from "react";

interface OtpModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (_otp: string) => Promise<unknown> | unknown;
	onResend: () => Promise<unknown> | unknown;
	isLoading?: boolean;
	title?: string;
	/** Partial mobile shown as hint, e.g. "XXXXXX1234" */
	mobileHint?: string;
	otpLength?: number;
}

/**
 * Reusable OTP entry modal for the DigiKhata flow.
 * Used for sender verification, Aadhaar OTP, Add Recipient OTP,
 * and Fund Transfer OTP.
 * @param root0
 * @param root0.isOpen
 * @param root0.onClose
 * @param root0.onSubmit
 * @param root0.onResend
 * @param root0.isLoading
 * @param root0.title
 * @param root0.mobileHint
 * @param root0.otpLength
 */
export const OtpModal = ({
	isOpen,
	onClose,
	onSubmit,
	onResend,
	isLoading = false,
	title = "Enter OTP",
	mobileHint,
	otpLength = 6,
}: OtpModalProps): JSX.Element => {
	const [otp, setOtp] = useState("");

	const isSuccessfulResponse = (result: unknown): boolean => {
		if (typeof result === "boolean") return result;
		const status = (result as { data?: { status?: number } })?.data?.status;
		return status === 0;
	};

	const handleClose = () => {
		setOtp("");
		onClose();
	};

	const handleSubmit = async () => {
		if (otp.length !== otpLength) return;
		const result = await onSubmit(otp);
		if (isSuccessfulResponse(result)) {
			setOtp("");
		}
	};

	const handleResend = async () => {
		const result = await onResend();
		if (isSuccessfulResponse(result)) {
			setOtp("");
		}
	};

	return (
		<Modal
			title={title}
			isOpen={isOpen}
			onClose={handleClose}
			size="sm"
			isCentered
			motionPreset="slideInBottom"
		>
			<VStack spacing={6} pb={4}>
				<Text fontSize="sm" color="light" textAlign="center">
					{mobileHint ? (
						<>
							OTP sent to{" "}
							<Text as="span" fontWeight="semibold" color="dark">
								{mobileHint}
							</Text>
						</>
					) : (
						"Enter the OTP sent to your registered mobile number."
					)}
				</Text>

				<OtpInput
					length={otpLength}
					value={otp}
					onChange={setOtp}
					onComplete={handleSubmit}
					isDisabled={isLoading}
					inputStyle={{ w: 14, h: 14, fontSize: "xl" }}
					containerStyle={{ gap: 3, justifyContent: "center" }}
				/>

				<Button
					w="full"
					bg="primary.DEFAULT"
					color="white"
					size="lg"
					borderRadius="10"
					isLoading={isLoading}
					isDisabled={otp.length !== otpLength}
					onClick={handleSubmit}
					_hover={{ bg: "primary.dark" }}
				>
					Verify OTP
				</Button>

				<Flex gap={1} align="center">
					<Text fontSize="sm" color="light">
						Didn&apos;t receive?
					</Text>
					<Button
						variant="link"
						color="primary.light"
						fontSize="sm"
						onClick={handleResend}
						isDisabled={isLoading}
					>
						Resend OTP
					</Button>
				</Flex>
			</VStack>
		</Modal>
	);
};
