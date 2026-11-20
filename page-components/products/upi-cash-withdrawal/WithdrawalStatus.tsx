import { Flex, Spinner, Text } from "@chakra-ui/react";
import { Button } from "components";
import { useUpiCashStatusPoll } from "./hooks";
import type { UpiCashPollSchedule } from "./types";

interface WithdrawalStatusProps {
	/** Transaction id from Initiate. */
	tid: string;
	/** Backend-returned poll schedule. */
	schedule: UpiCashPollSchedule;
	/** Amount being collected, for the paid message. */
	amount: number;
	/** Start a fresh withdrawal (offered on failed/unknown outcomes). */
	onReset: () => void;
}

/**
 * Status polling + outcome + the hard cash-gate (Status 1109, T-4).
 *
 * Polls on the backend schedule and renders the outcome. The "hand over cash" CTA is
 * enabled ONLY when the poll resolves to paid (`response_status_id == 0`, e-value
 * credited); pending / failed / timeout / unknown all keep it disabled and tell the
 * agent NOT to hand over cash.
 * @param {WithdrawalStatusProps} props - tid, schedule, amount, onReset.
 * @returns {JSX.Element} The status + cash-gate panel.
 */
export const WithdrawalStatus = ({
	tid,
	schedule,
	amount,
	onReset,
}: WithdrawalStatusProps): JSX.Element => {
	const { status, bankRefNum, isPaid } = useUpiCashStatusPoll({
		tid,
		schedule,
		enabled: true,
	});

	return (
		<Flex
			direction="column"
			gap={3}
			align="center"
			data-testid="upi-cash-status"
		>
			{status === "pending" ? (
				<Flex
					align="center"
					gap={2}
					data-testid="upi-cash-status-pending"
				>
					<Spinner size="sm" />
					<Text color="orange.600">
						Payment pending — do not hand over cash yet.
					</Text>
				</Flex>
			) : null}

			{status === "paid" ? (
				<Flex
					direction="column"
					align="center"
					gap={1}
					data-testid="upi-cash-status-paid"
				>
					<Text color="green.600" fontWeight="bold">
						Payment received — hand over ₹{amount} in cash.
					</Text>
					{bankRefNum ? (
						<Text fontSize="sm" color="gray.600">
							Bank ref: {bankRefNum}
						</Text>
					) : null}
				</Flex>
			) : null}

			{status === "failed" ? (
				<Text color="red.600" data-testid="upi-cash-status-failed">
					Payment failed — do not hand over cash.
				</Text>
			) : null}

			{status === "unknown" ? (
				<Text color="red.600" data-testid="upi-cash-status-unknown">
					We couldn’t confirm the payment — do not hand over cash.
				</Text>
			) : null}

			{/* Hard cash-gate: enabled ONLY when paid. */}
			<Button
				colorScheme="green"
				disabled={!isPaid}
				data-testid="upi-cash-handover"
			>
				Cash handed over
			</Button>

			{status === "failed" || status === "unknown" ? (
				<Button
					variant="outline"
					onClick={onReset}
					data-testid="upi-cash-new-after-fail"
				>
					Start new withdrawal
				</Button>
			) : null}
		</Flex>
	);
};
