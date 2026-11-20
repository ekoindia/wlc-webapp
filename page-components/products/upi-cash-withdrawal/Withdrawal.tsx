import { Flex, Image, Text } from "@chakra-ui/react";
import { Button, Input, PageTitle } from "components";
import { UPI_CASH_AMOUNT } from "./constants";
import { useUpiCashWithdrawal } from "./hooks";

/**
 * Build a usable <img> src from the contract's base64 PNG, tolerating a value that
 * already carries a data: URI prefix.
 * @param {string} qrString - The base64 PNG (with or without data: prefix).
 * @returns {string} A data URI.
 */
const toQrSrc = (qrString: string): string =>
	qrString.startsWith("data:")
		? qrString
		: `data:image/png;base64,${qrString}`;

/**
 * Withdrawal step — amount + location + QR (Initiate 1108, T-3). The agent enters an
 * amount, we read the device's real location, and Generate issues a single-use,
 * amount-specific QR with a ~60s countdown. The customer scans it from their OWN
 * phone and pays with their OWN UPI PIN. Status polling + the hard cash-gate are
 * layered on in T-4.
 * @returns {JSX.Element} The withdrawal UI.
 */
export const Withdrawal = (): JSX.Element => {
	const {
		amountInput,
		setAmount,
		amountValidation,
		qr,
		secondsLeft,
		isExpired,
		message,
		isLocating,
		locationReady,
		inMaintenanceWindow,
		isInitiating,
		canGenerate,
		generate,
		reset,
	} = useUpiCashWithdrawal();

	return (
		<Flex direction="column" gap={4} data-testid="upi-cash-withdrawal">
			<PageTitle title="UPI Cash Withdrawal" />

			<Input
				label="Withdrawal amount"
				type="text"
				isNumInput
				inputMode="numeric"
				leftAddon="₹"
				value={amountInput}
				min={UPI_CASH_AMOUNT.MIN}
				max={UPI_CASH_AMOUNT.MAX}
				placeholder={`${UPI_CASH_AMOUNT.MIN}–${UPI_CASH_AMOUNT.MAX}, in multiples of ${UPI_CASH_AMOUNT.STEP}`}
				invalid={Boolean(amountValidation.error)}
				errorMsg={amountValidation.error}
				disabled={Boolean(qr)}
				onChange={(e: { target: { value: string } }) =>
					setAmount(e.target.value)
				}
			/>

			{inMaintenanceWindow ? (
				<Text data-testid="upi-cash-message" color="orange.600">
					New withdrawals are paused between 11:30 PM and 12:05 AM for
					daily settlement. Please try again shortly.
				</Text>
			) : null}

			{!qr ? (
				<>
					<Text fontSize="sm" color="gray.600">
						{isLocating
							? "Reading your location…"
							: locationReady
								? "Location captured."
								: "Allow location access to continue."}
					</Text>
					<Button
						width="fit-content"
						onClick={generate}
						disabled={!canGenerate}
						isLoading={isInitiating}
						data-testid="upi-cash-generate"
					>
						Generate QR
					</Button>
				</>
			) : (
				<Flex
					direction="column"
					gap={3}
					align="center"
					data-testid="upi-cash-qr-panel"
				>
					<Text fontWeight="bold">
						Collecting ₹{qr.amount} from the customer
					</Text>
					<Image
						src={toQrSrc(qr.qrString)}
						alt="UPI payment QR"
						boxSize="240px"
						opacity={isExpired ? 0.4 : 1}
						data-testid="upi-cash-qr"
					/>
					{isExpired ? (
						<Text data-testid="upi-cash-expired" color="red.600">
							This QR has expired. Generate a new one.
						</Text>
					) : (
						<Text data-testid="upi-cash-countdown">
							Expires in {secondsLeft}s
						</Text>
					)}
					<Text fontSize="sm" color="gray.600" textAlign="center">
						Ask the customer to scan this QR from their own phone
						and pay with their own UPI PIN. Do not scan it yourself.
					</Text>
					<Button variant="outline" onClick={reset}>
						New withdrawal
					</Button>
				</Flex>
			)}

			{message ? (
				<Text data-testid="upi-cash-message" color="red.600">
					{message}
				</Text>
			) : null}
		</Flex>
	);
};
