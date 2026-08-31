import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Checkbox,
	HStack,
	Input,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Select } from "components";
import useBankList from "hooks/useBankList";
import { useState } from "react";
import UidaiFingerprintScanner from "tf-components/UidaiFingerprint/UidaiFingerprintScanner";
import { OTP_REQUIRED_AMOUNT_THRESHOLD } from "../constants";
import { useAepsContext } from "../context/AepsContext";

// Matches the legacy Connect widget's generic MONEY param-type validation.
const AMOUNT_REGEX = /^[0-9]{1,13}(?:\.[0-9]{1,2})?$/;
const AADHAAR_REGEX = /^\d{12}$/;

/**
 * Step — Interaction 344 (AePS Cashout, card id 483). Confirmed request
 * contract: amount, the customer's Aadhaar number (typed, separate from the
 * biometric capture), bank, a fresh fingerprint capture taken at this step,
 * and an optional SMS-receipt opt-in (+₹0.50 per the DB's param description).
 */
export const CashoutForm = () => {
	const { state, actions, submitCashout } = useAepsContext();
	const { banks, isLoading: banksLoading } = useBankList();
	const [isScanValid, setIsScanValid] = useState(false);

	const isValid =
		AMOUNT_REGEX.test(state.amount) &&
		Number(state.amount) > 0 &&
		Boolean(state.bankCode) &&
		AADHAAR_REGEX.test(state.customerAadhaar) &&
		Boolean(state.pidBlock) &&
		isScanValid;
	const isLoading = state.status === "loading";
	const mayRequireOtp = Number(state.amount) >= OTP_REQUIRED_AMOUNT_THRESHOLD;

	return (
		<VStack align="stretch" spacing={5}>
			<HStack justify="space-between">
				<Text fontSize="sm" color="gray.600">
					Customer
				</Text>
				<Text fontWeight="semibold">{state.customerId}</Text>
			</HStack>

			<Box>
				<Text fontSize="sm" fontWeight="medium" mb={2}>
					Customer Aadhaar Number
				</Text>
				<Input
					type="password"
					inputMode="numeric"
					maxLength={12}
					value={state.customerAadhaar}
					onChange={(e) =>
						actions.setCustomerAadhaar(
							e.target.value.replace(/\D/g, "").slice(0, 12)
						)
					}
					placeholder="12-digit Aadhaar number"
					borderRadius="10"
					size="lg"
				/>
			</Box>

			<Box>
				<Text fontSize="sm" fontWeight="medium" mb={2}>
					Bank
				</Text>
				<Select
					size="lg"
					placeholder={
						banksLoading ? "Loading banks…" : "Select bank"
					}
					disabled={banksLoading}
					options={banks}
					value={
						banks.find((b) => b.value === state.bankCode) ?? null
					}
					onChange={(option) =>
						actions.setBankCode(String(option?.value ?? ""))
					}
				/>
			</Box>

			<Box>
				<Text fontSize="sm" fontWeight="medium" mb={2}>
					Cashout Amount
				</Text>
				<Input
					type="number"
					value={state.amount}
					onChange={(e) => actions.setAmount(e.target.value)}
					borderRadius="10"
					size="lg"
				/>
				{state.amount && !AMOUNT_REGEX.test(state.amount) && (
					<Text fontSize="xs" color="error" mt={1}>
						Enter a valid amount (up to 2 decimal places).
					</Text>
				)}
			</Box>

			<Box>
				<Text fontSize="sm" fontWeight="medium" mb={2}>
					Customer Biometric Capture
				</Text>
				<UidaiFingerprintScanner
					label="Scan Customer's Fingerprint"
					required
					hideBranding
					onChange={(value) => actions.setPidBlock(value)}
					onValidation={setIsScanValid}
				/>
			</Box>

			<Checkbox
				isChecked={state.smsReceiptOptIn}
				onChange={(e) => actions.setSmsReceiptOptIn(e.target.checked)}
			>
				<Text fontSize="sm">Send SMS receipt to customer (+₹0.50)</Text>
			</Checkbox>

			{mayRequireOtp && (
				<Alert status="info" borderRadius="lg" fontSize="sm">
					<AlertIcon />
					Amounts of ₹{OTP_REQUIRED_AMOUNT_THRESHOLD.toLocaleString()}{" "}
					or more may require bank-side OTP confirmation.
				</Alert>
			)}

			{state.error && (
				<Alert status="error" borderRadius="lg" fontSize="sm">
					<AlertIcon />
					{state.error}
				</Alert>
			)}

			<Button
				variant="primary"
				size="lg"
				isDisabled={!isValid}
				isLoading={isLoading}
				loadingText="Processing…"
				onClick={submitCashout}
			>
				Confirm Cashout
			</Button>
		</VStack>
	);
};

export default CashoutForm;
