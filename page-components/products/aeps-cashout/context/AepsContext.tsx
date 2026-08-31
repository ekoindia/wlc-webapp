import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	type ReactNode,
} from "react";
import {
	AEPS_CATALOG,
	AEPS_INTERACTION,
	CASHOUT_OUTCOME,
	COMPLETE_KYC_BIOMETRIC_OUTCOME,
	COMPLETE_KYC_OUTCOME,
	FINGPAY_STATUS_OUTCOME,
	OTP_REQUIRED_AMOUNT_THRESHOLD,
	OTP_THRESHOLD_COMMENT_PATTERN,
	SEARCH_CUSTOMER_OUTCOME,
	VERIFY_KYC_OTP_OUTCOME,
} from "../constants";
import type {
	AepsOutcomeAction,
	AepsPaymentModeId,
	AepsServices,
} from "../contracts";
import type { AepsState } from "../hooks/useAepsState";
import { useAepsState, type AepsStateHook } from "../hooks/useAepsState";
import {
	cashout,
	completeKyc as completeKycApi,
	completeKycBiometric as completeKycBiometricApi,
	getAadhaarPublicKey,
	getFingpayStatus,
	searchCustomer,
	submitDailyAuth as submitDailyAuthApi,
	verifyKycOtp as verifyKycOtpApi,
	verifyOtp,
} from "../services/aepsService";
import { rsaEncrypt } from "../utils/rsaEncrypt";

export interface AepsContextValue extends AepsStateHook {
	services: AepsServices;
	submitFingpayStatus: () => Promise<void>;
	submitCompleteKyc: () => Promise<void>;
	submitVerifyKycOtp: () => Promise<void>;
	submitCompleteKycBiometric: () => Promise<void>;
	submitDailyAuth: () => Promise<void>;
	selectPaymentMode: (_mode: AepsPaymentModeId) => void;
	submitSearchCustomer: () => Promise<void>;
	submitCashout: () => Promise<void>;
	submitOtp: (_otp: string) => Promise<void>;
}

/**
 * Maps an `{next: "result", result: ...}` outcome to the reducer's status.
 * @param result
 */
const resultToStatus = (
	result: Extract<AepsOutcomeAction, { next: "result" }>["result"]
): AepsState["status"] => {
	switch (result) {
		case "success":
			return "success";
		case "pending":
			return "pending";
		case "retry":
			return "retry";
		default:
			return "error";
	}
};

const AepsContext = createContext<AepsContextValue | null>(null);

interface AepsProviderProps {
	children: ReactNode;
	services: AepsServices;
}

/**
 * "Fat Context" orchestrator for the AePS/Fingpay chain:
 * provider -> fingpayStatus -> [dailyAuth] -> paymentMode -> search ->
 * [otp] -> cashout -> result. Mirrors `OnboardingProvider`
 * (features/onboarding/context/OnboardingContext.tsx).
 *
 * The outcome-code -> next-step mapping lives in `constants.ts`, not here,
 * since it will need updating as more open items get confirmed.
 * @param root0
 * @param root0.children
 * @param root0.services
 */
export const AepsProvider = ({ children, services }: AepsProviderProps) => {
	const { state, dispatch, actions } = useAepsState();

	const submitFingpayStatus = useCallback(async () => {
		actions.setStatus("loading");
		actions.setError(null);

		try {
			const response = await getFingpayStatus(
				services,
				state.clientRefId,
				state.latLong ?? ""
			);

			// Defensive check against `getFingpayStatus` ever colliding with
			// hooks/useBankList.ts's bank-list response shape — fails with a
			// clear message instead of a confusing raw mismatch if it does.
			if (
				Array.isArray(
					(
						response as {
							param_attributes?: { list_elements?: unknown };
						}
					)?.param_attributes?.list_elements
				)
			) {
				actions.setStatus("error");
				actions.setError(
					"Fingpay status check got back a bank-list response instead of Fingpay status - this shouldn't happen with interaction_type_id 391; please report this."
				);
				actions.setStep("result");
				return;
			}

			const outcome =
				FINGPAY_STATUS_OUTCOME[Number(response?.response_type_id)];

			if (!outcome || outcome.next === "unknown") {
				actions.setStatus("error");
				actions.setError(
					response?.message ??
						"Unrecognized response while checking Fingpay status."
				);
				actions.setStep("result");
				return;
			}

			if (outcome.next === "result") {
				actions.setStatus(resultToStatus(outcome.result));
				actions.setError(
					outcome.result === "success"
						? null
						: (response?.message ??
								"This Fingpay status isn't supported by this flow yet.")
				);
				actions.setStep("result");
				return;
			}

			actions.setStatus("idle");
			actions.setStep(outcome.next);
		} catch (err) {
			actions.setStatus("error");
			actions.setError(
				err instanceof Error
					? err.message
					: "Failed to check Fingpay status."
			);
			actions.setStep("result");
		}
	}, [services, state.clientRefId, state.latLong, actions]);

	const submitCompleteKyc = useCallback(async () => {
		if (!state.latLong) {
			actions.setError("Location is required first.");
			return;
		}

		actions.setStatus("loading");
		actions.setError(null);

		try {
			// Confirmed live: request_structure.enc_pub_key is populated for
			// the `aadhar` field on catalog 614 too (same key as 483/994) —
			// RSA-encrypt before sending, never transmit plaintext Aadhaar.
			const publicKey = await getAadhaarPublicKey(
				services,
				AEPS_CATALOG.COMPLETE_KYC
			);
			if (!publicKey) {
				throw new Error(
					"Unable to fetch Aadhaar encryption key. Please try again."
				);
			}
			const encryptedAadhaar = rsaEncrypt(state.agentAadhaar, publicKey);

			const response = await completeKycApi(
				services,
				state.clientRefId,
				state.latLong,
				{ aadhar: encryptedAadhaar }
			);

			const outcome =
				COMPLETE_KYC_OUTCOME[Number(response?.response_type_id)];

			if (outcome?.next === "verifyKycOtp") {
				// Carry the same ciphertext forward — 614's own chain definition
				// marks `aadhar` as auto-forwarded (source_id: 2), not
				// re-collected/re-encrypted at steps 2/3 (see VerifyKycOtpPayload's
				// comment in contracts.ts).
				actions.setKycEncryptedAadhaar(encryptedAadhaar);

				// Field names for otp_ref_id/reference_tid on the 1600 response
				// are unconfirmed (see COMPLETE_KYC's note) — checking a few
				// likely shapes defensively rather than guessing one.
				const data = response?.data as
					| Record<string, unknown>
					| undefined;
				const otpRefId =
					(data?.otp_ref_id as string | undefined) ??
					(data?.otpRefId as string | undefined) ??
					(data?.reference_id as string | undefined) ??
					null;
				const referenceTid =
					(data?.reference_tid as string | undefined) ??
					(data?.referenceTid as string | undefined) ??
					(data?.tid as string | undefined) ??
					null;
				actions.setKycOtpRefId(otpRefId);
				actions.setKycReferenceTid(referenceTid);

				actions.setStatus("idle");
				actions.setStep("verifyKycOtp");
				return;
			}

			// KNOWN OPEN ITEM (see CompleteKycPayload in contracts.ts): every
			// live submission to this interaction has hit a real backend
			// exception (461, "For input string: ..."). Surfacing the raw
			// reason verbatim on purpose, so this reads as the real backend
			// error it is rather than a generic client-side failure.
			const reason = (
				response?.data as Record<string, unknown> | undefined
			)?.reason as string | undefined;
			actions.setStatus("error");
			actions.setError(
				[response?.message, reason].filter(Boolean).join(" — ") ||
					"KYC submission failed."
			);
		} catch (err) {
			actions.setStatus("error");
			actions.setError(
				err instanceof Error ? err.message : "KYC submission failed."
			);
		}
	}, [
		services,
		state.latLong,
		state.clientRefId,
		state.agentAadhaar,
		actions,
	]);

	const submitVerifyKycOtp = useCallback(async () => {
		if (
			!state.latLong ||
			!state.kycEncryptedAadhaar ||
			!state.kycOtpRefId ||
			!state.kycReferenceTid
		) {
			actions.setError(
				"Missing context from the previous KYC step. Please restart KYC verification."
			);
			return;
		}

		actions.setStatus("loading");
		actions.setError(null);

		try {
			const response = await verifyKycOtpApi(
				services,
				state.clientRefId,
				state.latLong,
				{
					otp: state.kycOtp,
					otp_ref_id: state.kycOtpRefId,
					reference_tid: state.kycReferenceTid,
					aadhar: state.kycEncryptedAadhaar,
					geolocation: state.latLong,
				}
			);

			const outcome =
				VERIFY_KYC_OTP_OUTCOME[Number(response?.response_type_id)];

			if (outcome?.next === "completeKycBiometric") {
				// Refresh the forwarded refs in case 615 issues new ones for
				// step 3 - fall back to the existing values if this response
				// doesn't repeat them.
				const data = response?.data as
					| Record<string, unknown>
					| undefined;
				const otpRefId =
					(data?.otp_ref_id as string | undefined) ??
					(data?.otpRefId as string | undefined) ??
					state.kycOtpRefId;
				const referenceTid =
					(data?.reference_tid as string | undefined) ??
					(data?.referenceTid as string | undefined) ??
					state.kycReferenceTid;
				actions.setKycOtpRefId(otpRefId);
				actions.setKycReferenceTid(referenceTid);

				actions.setStatus("idle");
				actions.setStep("completeKycBiometric");
				return;
			}

			const reason = (
				response?.data as Record<string, unknown> | undefined
			)?.reason as string | undefined;
			actions.setStatus("error");
			actions.setError(
				[response?.message, reason].filter(Boolean).join(" — ") ||
					"OTP verification failed."
			);
		} catch (err) {
			actions.setStatus("error");
			actions.setError(
				err instanceof Error ? err.message : "OTP verification failed."
			);
		}
	}, [services, state, actions]);

	const submitCompleteKycBiometric = useCallback(async () => {
		if (
			!state.latLong ||
			!state.kycEncryptedAadhaar ||
			!state.kycOtpRefId ||
			!state.kycReferenceTid ||
			!state.kycBankCode ||
			!state.kycPidBlock
		) {
			actions.setError(
				"Bank selection and biometric capture are required first."
			);
			return;
		}

		actions.setStatus("loading");
		actions.setError(null);

		try {
			const response = await completeKycBiometricApi(
				services,
				state.clientRefId,
				state.latLong,
				{
					bank_code: state.kycBankCode,
					piddata: state.kycPidBlock,
					otp_ref_id: state.kycOtpRefId,
					reference_tid: state.kycReferenceTid,
					aadhar: state.kycEncryptedAadhaar,
				}
			);

			const outcome =
				COMPLETE_KYC_BIOMETRIC_OUTCOME[
					Number(response?.response_type_id)
				];

			if (outcome?.next === "result") {
				actions.setResultContext("kyc");
				actions.setStatus(resultToStatus(outcome.result));
				actions.setStep("result");
				return;
			}

			const reason = (
				response?.data as Record<string, unknown> | undefined
			)?.reason as string | undefined;
			actions.setStatus("error");
			actions.setError(
				[response?.message, reason].filter(Boolean).join(" — ") ||
					"KYC biometric submission failed."
			);
		} catch (err) {
			actions.setStatus("error");
			actions.setError(
				err instanceof Error
					? err.message
					: "KYC biometric submission failed."
			);
		}
	}, [services, state, actions]);

	const submitDailyAuth = useCallback(async () => {
		if (!state.latLong || !state.agentPidBlock) {
			actions.setError(
				"Location and biometric capture are required first."
			);
			return;
		}

		actions.setStatus("loading");
		actions.setError(null);

		try {
			// Confirmed live: request_structure.enc_pub_key is populated for
			// the `aadhar` field on catalog 994 — RSA-encrypt before sending,
			// never transmit the agent's Aadhaar number in plaintext.
			const publicKey = await getAadhaarPublicKey(
				services,
				AEPS_CATALOG.DAILY_AUTH
			);
			if (!publicKey) {
				throw new Error(
					"Unable to fetch Aadhaar encryption key. Please try again."
				);
			}
			const encryptedAadhaar = rsaEncrypt(state.agentAadhaar, publicKey);

			const response = await submitDailyAuthApi(
				services,
				state.clientRefId,
				state.latLong,
				{
					aadhar: encryptedAadhaar,
					bank_code: state.agentBankCode,
					piddata: state.agentPidBlock,
				}
			);

			// Only one confirmed outcome exists for 594 in the connect-api
			// catalog ("Daily Authentication Successful") — no failure code is
			// documented, so any non-zero status falls back to a generic error.
			if (response?.status === 0) {
				actions.setStatus("idle");
				actions.setStep("paymentMode");
				return;
			}

			actions.setStatus("error");
			actions.setError(
				response?.message ?? "Daily authentication failed."
			);
		} catch (err) {
			actions.setStatus("error");
			actions.setError(
				err instanceof Error
					? err.message
					: "Daily authentication failed."
			);
		}
	}, [services, state, actions]);

	const selectPaymentMode = useCallback(
		(mode: AepsPaymentModeId) => {
			actions.setPaymentMode(mode);
			// Only Cash Withdrawal is wired up today (see AEPS_PAYMENT_MODES) —
			// this is a client-side-only routing decision (catalog 9001 is Local).
			if (mode === 2) {
				actions.setStep("search");
			}
		},
		[actions]
	);

	const submitSearchCustomer = useCallback(async () => {
		if (!state.latLong) {
			actions.setError("Location is required first.");
			return;
		}

		actions.setStatus("loading");
		actions.setError(null);

		try {
			const response = await searchCustomer(
				services,
				state.clientRefId,
				state.customerId,
				state.latLong
			);

			actions.setSearchResponse(response);

			// 309 ("customer exists") isn't a flat outcome - its own schema
			// documents two automatic chains (483 Cashout / 614 Complete Your
			// KYC), disambiguated by `ekyc_enabled` on the response itself. See
			// SEARCH_CUSTOMER_OUTCOME's comment in constants.ts.
			if (Number(response?.response_type_id) === 309) {
				const ekycEnabled = (
					response?.data as Record<string, unknown> | undefined
				)?.ekyc_enabled;
				actions.setStatus("idle");
				actions.setStep(
					ekycEnabled === "1" || ekycEnabled === 1
						? "cashout"
						: "completeKyc"
				);
				return;
			}

			const outcome =
				SEARCH_CUSTOMER_OUTCOME[Number(response?.response_type_id)];

			if (!outcome || outcome.next === "unknown") {
				actions.setStatus("error");
				actions.setError(
					response?.message ??
						"Unrecognized response from search-customer. Please try again."
				);
				return;
			}

			if (outcome.next === "result") {
				actions.setStatus(
					outcome.result === "success" ? "success" : "error"
				);
				actions.setStep("result");
				return;
			}

			if (outcome.next === "cashout" || outcome.next === "otp") {
				if (outcome.next === "otp") {
					// Customer-not-verified path -> interaction 103 (catalog 485),
					// distinct from the bank-side cashout-OTP context below.
					actions.setOtpContext("customerVerify");
				}
				actions.setStatus("idle");
				actions.setStep(outcome.next);
				return;
			}

			// "dailyAuth"/"paymentMode" are not reachable from Search Customer's
			// outcome map — fail safe rather than silently mis-routing.
			actions.setStatus("error");
			actions.setError(
				"Unexpected step transition from search-customer."
			);
		} catch (err) {
			actions.setStatus("error");
			actions.setError(
				err instanceof Error ? err.message : "Search customer failed."
			);
		}
	}, [services, state, actions]);

	const submitCashout = useCallback(async () => {
		if (!state.latLong || !state.pidBlock) {
			actions.setError("Customer biometric capture is required first.");
			return;
		}

		actions.setStatus("loading");
		actions.setError(null);

		try {
			// Confirmed live: request_structure.enc_pub_key is populated for
			// the `aadhar` field on catalog 483 — RSA-encrypt before sending,
			// never transmit the customer's Aadhaar number in plaintext.
			const publicKey = await getAadhaarPublicKey(
				services,
				AEPS_CATALOG.CASHOUT
			);
			if (!publicKey) {
				throw new Error(
					"Unable to fetch Aadhaar encryption key. Please try again."
				);
			}
			const encryptedAadhaar = rsaEncrypt(
				state.customerAadhaar,
				publicKey
			);

			const response = await cashout(
				services,
				state.clientRefId,
				state.customerId,
				state.latLong,
				{
					amount: state.amount,
					aadhar: encryptedAadhaar,
					bank_code: state.bankCode,
					piddata: state.pidBlock,
					config_value: state.smsReceiptOptIn ? "1" : "0",
					// Required - see CashoutPayload.type's comment (contracts.ts).
					// "2" = Cash Withdrawal, the only mode this flow submits today.
					type: "2",
				}
			);

			actions.setCashoutResponse(response);
			actions.setTxnRefId(
				((response?.data as Record<string, unknown> | undefined)
					?.txn_ref_id as string | undefined) ?? null
			);

			// Bank-side OTP required on the amount itself: SimpliBank signals this
			// as a plain 1464 ("Transaction Fail") with the real reason only in
			// `data.comment` - see OTP_THRESHOLD_COMMENT_PATTERN's comment for why
			// this can't be a static CASHOUT_OUTCOME entry. Must be checked before
			// the outcome-map lookup below, since 1464 also covers other, genuine
			// failures that should still show as "failure".
			const cashoutComment = (
				response?.data as Record<string, unknown> | undefined
			)?.comment;
			if (
				Number(response?.response_type_id) === 1464 &&
				typeof cashoutComment === "string" &&
				OTP_THRESHOLD_COMMENT_PATTERN.test(cashoutComment)
			) {
				actions.setOtpContext("cashoutThreshold");
				actions.setStatus("idle");
				actions.setError(null);
				actions.setStep("otp");
				return;
			}

			const outcome = CASHOUT_OUTCOME[Number(response?.response_type_id)];

			// Fail safe to a generic error screen for any unmapped code — most
			// of the ~28 outcome codes 344 can return for OTHER callers are
			// deliberately excluded from CASHOUT_OUTCOME (see its comment).
			if (!outcome || outcome.next !== "result") {
				actions.setStatus("error");
				actions.setError(
					response?.message ??
						"Unrecognized response from cashout. Please try again."
				);
				actions.setStep("result");
				return;
			}

			actions.setStatus(resultToStatus(outcome.result));
			actions.setStep("result");
		} catch (err) {
			actions.setStatus("error");
			actions.setError(
				err instanceof Error ? err.message : "Cashout failed."
			);
			actions.setStep("result");
		}
	}, [services, state, actions]);

	const submitOtp = useCallback(
		async (otp: string) => {
			if (!state.latLong || !state.customerId) {
				actions.setError(
					"Missing customer/location context for OTP verification."
				);
				return;
			}

			actions.setStatus("loading");
			actions.setError(null);
			actions.incrementOtpAttempts();

			// Bank-side cashout-amount OTP: the resubmission mechanism
			// (txnOtpRequestId / AEPS_INTERACTION.CASHOUT_OTP_VERIFY) is not
			// confirmed yet - do NOT fall through to interaction 103 below,
			// that's for customer-identity verification, a different thing.
			if (state.otpContext === "cashoutThreshold") {
				if (!AEPS_INTERACTION.CASHOUT_OTP_VERIFY) {
					actions.setStatus("error");
					actions.setError(
						"Bank-side cashout OTP verification isn't wired up yet - the resubmission reference (txnOtpRequestId) hasn't been confirmed with backend."
					);
					return;
				}
				// TODO(OPEN ITEM): once CASHOUT_OTP_VERIFY/txnOtpRequestId are
				// confirmed, resubmit the cashout call here with the OTP + real
				// reference id, then route to "result" on success/failure -
				// mirrors submitCashout, not verifyOtp/interaction 103.
				return;
			}

			// Reachable only from Search Customer's 339 ("Customer not
			// verified.") outcome — this verifies the *customer* (interaction
			// 103), it does not itself complete a cashout, so no txnRefId is
			// required here.
			try {
				const response = await verifyOtp(
					services,
					state.clientRefId,
					state.customerId,
					state.latLong,
					{ otp }
				);

				// Catalog 485's schema documents `300` as its success code
				// (chaining to 483 Cashout). Checking both `response_type_id
				// === 300` and the legacy `status === 0` defensively, since
				// this path needs a real SMS OTP to confirm live which field
				// the backend actually returns as 0 here.
				if (
					Number(response?.response_type_id) === 300 ||
					response?.status === 0
				) {
					actions.setStatus("idle");
					actions.setStep("cashout");
					return;
				}

				actions.setStatus("error");
				actions.setError(
					response?.message ?? "Invalid or expired OTP."
				);
			} catch (err) {
				actions.setStatus("error");
				actions.setError(
					err instanceof Error
						? err.message
						: "OTP verification failed."
				);
			}
		},
		[services, state, actions]
	);

	const contextValue: AepsContextValue = useMemo(
		() => ({
			state,
			dispatch,
			actions,
			services,
			submitFingpayStatus,
			submitCompleteKyc,
			submitVerifyKycOtp,
			submitCompleteKycBiometric,
			submitDailyAuth,
			selectPaymentMode,
			submitSearchCustomer,
			submitCashout,
			submitOtp,
		}),
		[
			state,
			dispatch,
			actions,
			services,
			submitFingpayStatus,
			submitCompleteKyc,
			submitVerifyKycOtp,
			submitCompleteKycBiometric,
			submitDailyAuth,
			selectPaymentMode,
			submitSearchCustomer,
			submitCashout,
			submitOtp,
		]
	);

	return (
		<AepsContext.Provider value={contextValue}>
			{children}
		</AepsContext.Provider>
	);
};

export const useAepsContext = (): AepsContextValue => {
	const context = useContext(AepsContext);
	if (!context) {
		throw new Error("useAepsContext must be used within an <AepsProvider>");
	}
	return context;
};

/** Re-exported for components that need to render an OTP-required hint before submit. */
export { OTP_REQUIRED_AMOUNT_THRESHOLD };
