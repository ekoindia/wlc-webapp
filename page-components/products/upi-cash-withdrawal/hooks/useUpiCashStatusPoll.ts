import { Endpoints } from "constants/EndPoints";
import useApiFetch from "hooks/useApiFetch";
import { useEffect, useRef, useState } from "react";
import { RESPONSE_STATUS, UPI_CASH_INTERACTION } from "../constants";
import type {
	UpiCashPollSchedule,
	UpiCashPollStatus,
	UpiCashStatusData,
} from "../types";

interface UseUpiCashStatusPollArgs {
	/** Transaction id from Initiate; polling is inert until this is set. */
	tid: string | null | undefined;
	/** Backend-returned poll schedule (start/gap/attempts). */
	schedule: UpiCashPollSchedule | null | undefined;
	/** Gate polling on/off (e.g. only while a QR is active). */
	enabled: boolean;
}

export interface UpiCashStatusPollResult {
	/** Current outcome; only `"paid"` may enable the cash CTA. */
	status: UpiCashPollStatus;
	/** Bank reference number — set only when paid. */
	bankRefNum: string | null;
	/** Provider's status description (display only). */
	statusDesc: string | null;
	/** How many polls have run. */
	attemptsUsed: number;
	/** The hard gate: true ONLY when paid + e-value credited. */
	isPaid: boolean;
}

/**
 * Poll Status (1109) on the backend-returned schedule and resolve the withdrawal
 * outcome. Outcome branches on `response_status_id` ONLY (0 paid / 1 failed /
 * 2 pending) — never on `tx_status` or message text.
 *
 * Safety is biased hard toward "not paid": a connection error, an unrecognised
 * status, or still-pending after the last attempt all resolve to `"unknown"` (DO NOT
 * hand over cash). `"paid"` is reached only on an explicit `response_status_id == 0`,
 * so a customer bank debit without a wallet credit (which reverses) never shows paid.
 * @param {UseUpiCashStatusPollArgs} args - tid, schedule, and the enabled gate.
 * @returns {UpiCashStatusPollResult} The resolved status.
 */
export const useUpiCashStatusPoll = ({
	tid,
	schedule,
	enabled,
}: UseUpiCashStatusPollArgs): UpiCashStatusPollResult => {
	const [status, setStatus] = useState<UpiCashPollStatus>("idle");
	const [bankRefNum, setBankRefNum] = useState<string | null>(null);
	const [statusDesc, setStatusDesc] = useState<string | null>(null);
	const [attemptsUsed, setAttemptsUsed] = useState(0);

	const [statusCall] = useApiFetch(Endpoints.TRANSACTION, {});
	// Keep the latest fetch fn in a ref so re-renders don't restart the poll loop
	// (useApiFetch returns a fresh function each render).
	const statusCallRef = useRef(statusCall);
	statusCallRef.current = statusCall;

	const startIn = schedule?.startIn;
	const gap = schedule?.gap;
	const attempts = schedule?.attempts;

	useEffect(() => {
		if (!enabled || !tid || startIn == null || gap == null || !attempts) {
			setStatus("idle");
			setBankRefNum(null);
			setStatusDesc(null);
			setAttemptsUsed(0);
			return;
		}

		let cancelled = false;
		let timer: ReturnType<typeof setTimeout>;
		let attempt = 0;
		setStatus("pending");
		setBankRefNum(null);
		setStatusDesc(null);
		setAttemptsUsed(0);

		const poll = async () => {
			attempt += 1;
			setAttemptsUsed(attempt);

			let terminal = false;
			try {
				const res = await statusCallRef.current({
					body: {
						interaction_type_id: UPI_CASH_INTERACTION.STATUS,
						tid,
					},
				});
				const payload = res?.data as
					| {
							response_status_id?: number;
							data?: UpiCashStatusData;
					  }
					| undefined;

				if (res?.error || payload == null) {
					// Connection error → not paid; keep polling.
				} else if (
					payload.response_status_id === RESPONSE_STATUS.PAID
				) {
					if (!cancelled) {
						setBankRefNum(payload.data?.bank_ref_num ?? null);
						setStatusDesc(payload.data?.txstatus_desc ?? null);
						setStatus("paid");
					}
					terminal = true;
				} else if (
					payload.response_status_id === RESPONSE_STATUS.FAILED
				) {
					if (!cancelled) {
						setStatusDesc(payload.data?.txstatus_desc ?? null);
						setStatus("failed");
					}
					terminal = true;
				} else {
					// Pending (2) or any unrecognised id → not paid; keep polling.
					if (!cancelled && payload.data?.txstatus_desc) {
						setStatusDesc(payload.data.txstatus_desc);
					}
				}
			} catch {
				// Swallow → treat as a non-paid attempt and keep polling.
			}

			if (cancelled || terminal) return;

			if (attempt >= attempts) {
				// Pending after the last poll / timeout → never shown as paid.
				setStatus("unknown");
				return;
			}
			timer = setTimeout(poll, gap * 1000);
		};

		// First poll after the backend-provided delay.
		timer = setTimeout(poll, startIn * 1000);

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [enabled, tid, startIn, gap, attempts]);

	return {
		status,
		bankRefNum,
		statusDesc,
		attemptsUsed,
		isPaid: status === "paid",
	};
};
