import { Endpoints } from "constants/EndPoints";
import useApiFetch from "hooks/useApiFetch";
import useGeolocation from "hooks/useGeolocation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	RESPONSE_STATUS,
	UPI_CASH_INTERACTION,
	UPI_CASH_QR,
} from "../constants";
import type { UpiCashInitiateData, UpiCashQr } from "../types";
import {
	hasRealLocation,
	isWithdrawalMaintenanceWindow,
	validateWithdrawalAmount,
} from "../utils/withdrawalUtils";

/**
 * Owns the UPI Cash Withdrawal flow state for T-3 (amount → location → Initiate 1108
 * → QR + countdown). Exposes `tid` and the poll `schedule` so T-4 can add status
 * polling + the hard cash-gate on top without re-plumbing the initiate call.
 * @returns {object} Flow state and actions for the Withdrawal UI.
 */
export const useUpiCashWithdrawal = () => {
	const [amountInput, setAmountInput] = useState("");
	const [qr, setQr] = useState<UpiCashQr | null>(null);
	const [secondsLeft, setSecondsLeft] = useState(0);
	/** Informative, non-paid message (daily-cap / maintenance window / fail). */
	const [message, setMessage] = useState<string | null>(null);

	const {
		latitude,
		longitude,
		isLoading: isLocating,
		error: locationError,
		requestLocation,
	} = useGeolocation({ highAccuracy: true });

	const [initiateCall, isInitiating] = useApiFetch(Endpoints.TRANSACTION, {});

	// Ask for a fresh fix as soon as the flow opens (AC-3.2: real location).
	useEffect(() => {
		requestLocation();
	}, [requestLocation]);

	const amountValidation = useMemo(
		() => validateWithdrawalAmount(amountInput),
		[amountInput]
	);

	const locationReady = hasRealLocation(latitude, longitude);
	const inMaintenanceWindow = isWithdrawalMaintenanceWindow();

	/**
	 * Update the amount. A new amount invalidates any existing QR — each QR is
	 * single-use and amount-specific (AC-3.4).
	 * @param {string} value - The raw input value.
	 */
	const setAmount = useCallback((value: string) => {
		setAmountInput(value);
		setQr((prev) => {
			if (prev && `${prev.amount}` !== value.trim()) {
				setSecondsLeft(0);
				setMessage(null);
				return null;
			}
			return prev;
		});
	}, []);

	// Countdown ticker for the active QR. Does not itself clear the QR — an expired
	// QR stays visible (greyed, with a "generate a new one" prompt) rather than
	// vanishing mid-handover.
	useEffect(() => {
		if (!qr || secondsLeft <= 0) return;
		const id = setInterval(() => {
			setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
		}, 1000);
		return () => clearInterval(id);
	}, [qr, secondsLeft]);

	const canGenerate =
		amountValidation.valid &&
		locationReady &&
		!inMaintenanceWindow &&
		!isInitiating;

	/**
	 * Initiate a withdrawal (1108): send the amount + the device's real location,
	 * then render the returned QR. Branches on `response_status_id` only.
	 */
	const generate = useCallback(async () => {
		setMessage(null);

		if (inMaintenanceWindow) {
			setMessage(
				"New withdrawals are paused between 11:30 PM and 12:05 AM for daily settlement. Please try again shortly."
			);
			return;
		}
		if (!amountValidation.valid || amountValidation.amount == null) {
			setMessage(amountValidation.error || "Enter a valid amount.");
			return;
		}
		if (!hasRealLocation(latitude, longitude)) {
			setMessage(
				locationError ||
					"Couldn’t read your location yet. Allow location access and try again."
			);
			requestLocation();
			return;
		}

		const amount = amountValidation.amount;
		const res = await initiateCall({
			body: {
				interaction_type_id: UPI_CASH_INTERACTION.INITIATE,
				amount,
				latitude,
				longitude,
			},
		});

		const payload = res?.data as
			| {
					response_status_id?: number;
					data?: UpiCashInitiateData;
					message?: string;
			  }
			| undefined;

		// Decide ok/fail on response_status_id — never on message text.
		if (
			res?.error ||
			!payload ||
			payload.response_status_id !== RESPONSE_STATUS.OK ||
			!payload.data?.tid ||
			!payload.data?.qr_string
		) {
			// Daily-cap / window / provider decline all land here as an informative
			// message (normal business state) — the backend message, if any.
			setMessage(
				payload?.message ||
					"We couldn’t generate a QR right now. Please try again."
			);
			return;
		}

		const data = payload.data;
		const expiry = data.qr_expiry_in || UPI_CASH_QR.DEFAULT_EXPIRY_SECONDS;
		setQr({
			tid: data.tid,
			qrString: data.qr_string,
			amount,
			expirySeconds: expiry,
			schedule: {
				startIn: data.status_check_start_in,
				gap: data.status_check_gap,
				attempts: data.status_check_attempts,
			},
			commission: data.commission,
			tds: data.tds,
		});
		setSecondsLeft(expiry);
	}, [
		amountValidation,
		inMaintenanceWindow,
		latitude,
		longitude,
		locationError,
		requestLocation,
		initiateCall,
	]);

	/** Clear the active QR to start a new withdrawal. */
	const reset = useCallback(() => {
		setQr(null);
		setSecondsLeft(0);
		setMessage(null);
	}, []);

	return {
		amountInput,
		setAmount,
		amountValidation,
		qr,
		secondsLeft,
		isExpired: Boolean(qr) && secondsLeft <= 0,
		message,
		isLocating,
		locationReady,
		inMaintenanceWindow,
		isInitiating,
		canGenerate,
		generate,
		reset,
	};
};
