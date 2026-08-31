/**
 * AePS Service
 *
 * Request-builders for the AePS/Fingpay interaction chain:
 * 252 (menu) -> 993 (Fingpay, link-only) -> 991 (Fingpay Status) ->
 * [994 (Daily Auth) or 614->615->616 (Complete-KYC) if required] ->
 * 9001 (Payment Mode, local) -> 482 (Search Customer) ->
 * [485 (Verify OTP) if required] -> 483 (Cashout).
 * Two envelope builders exist: `callAepsInteraction` (full envelope, used by
 * search/cashout/otp) and `callFingpayInteraction` (a leaner envelope used by
 * Daily Auth — see its own comment).
 */
import { Endpoints } from "constants/EndPoints";
import { fetcher } from "helpers";
import {
	AEPS_ENVELOPE_DEFAULTS,
	AEPS_INTERACTION,
	FINGPAY_FIXED_FIELDS,
} from "../constants";
import type {
	AepsInteractionResponse,
	AepsServices,
	CashoutPayload,
	CompleteKycBiometricPayload,
	CompleteKycPayload,
	DailyAuthPayload,
	OtpPayload,
	SearchCustomerPayload,
	VerifyKycOtpPayload,
} from "../contracts";

interface CallInteractionArgs {
	services: AepsServices;
	interactionTypeId: string | number;
	clientRefId: string;
	customerId?: string;
	latLong?: string;
	extra?:
		| SearchCustomerPayload
		| CashoutPayload
		| DailyAuthPayload
		| OtpPayload
		| VerifyKycOtpPayload
		| CompleteKycBiometricPayload
		| Record<string, unknown>;
}

/**
 * Calls a single `interaction_type_id` against the generic `ekoicici/v2/request`
 * endpoint, via the shared `/transactions/do` gateway + `tf-req-uri-*` header
 * routing (same pattern used by PendingBankRequests for `ekoicici/v1`).
 * @param root0
 * @param root0.services
 * @param root0.interactionTypeId
 * @param root0.clientRefId
 * @param root0.customerId
 * @param root0.latLong
 * @param root0.extra
 */
export async function callAepsInteraction<T = Record<string, unknown>>({
	services,
	interactionTypeId,
	clientRefId,
	customerId,
	latLong,
	extra = {},
}: CallInteractionArgs): Promise<AepsInteractionResponse<T>> {
	const {
		accessToken,
		generateNewToken,
		userCode,
		initiatorId,
		orgId,
		realSourceIp,
	} = services;

	return fetcher(
		process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
		{
			token: accessToken,
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v2",
				"tf-req-uri": "/request",
				"tf-req-method": "POST",
			},
			body: {
				...AEPS_ENVELOPE_DEFAULTS,
				client_ref_id: clientRefId,
				interaction_type_id: String(interactionTypeId),
				user_code: userCode,
				initiator_id: initiatorId,
				org_id: orgId,
				customer_id: customerId,
				latlong: latLong,
				realsourceip: realSourceIp,
				...extra,
			},
		},
		generateNewToken
	) as Promise<AepsInteractionResponse<T>>;
}

/**
 * Leaner envelope used for Daily Auth (594) — Fingpay Status (391) uses its
 * own minimal request instead (see `getFingpayStatus` below), since this
 * builder's extra fields don't match what that call actually expects.
 * @param root0
 * @param root0.services
 * @param root0.interactionTypeId
 * @param root0.clientRefId
 * @param root0.latLong
 * @param root0.extra
 */
function callFingpayInteraction<T = Record<string, unknown>>({
	services,
	interactionTypeId,
	clientRefId,
	latLong,
	extra = {},
}: Omit<CallInteractionArgs, "customerId">): Promise<
	AepsInteractionResponse<T>
> {
	const { accessToken, generateNewToken, initiatorId } = services;

	return fetcher(
		process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
		{
			token: accessToken,
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v2",
				"tf-req-uri": "/request",
				"tf-req-method": "POST",
			},
			body: {
				client_ref_id: clientRefId,
				locale: "en",
				interaction_type_id: String(interactionTypeId),
				// The agent's own id — confirmed live to be both `customer_id`
				// and `user_id` for this call.
				customer_id: initiatorId,
				user_id: initiatorId,
				latlong: latLong,
				...extra,
			},
		},
		generateNewToken
	) as Promise<AepsInteractionResponse<T>>;
}

/**
 * Interaction 391 — Fingpay Status. Sends only
 * `{client_ref_id, locale, user_id, interaction_type_id, service_code, latlong}`
 * — no customer_id or biometric fields — matching the real Connect app's
 * request exactly. Built as its own minimal request rather than reusing
 * `callFingpayInteraction`, since that builder's extra fields aren't part of
 * this call's contract.
 * @param services
 * @param clientRefId
 * @param latLong
 */
export function getFingpayStatus(
	services: AepsServices,
	clientRefId: string,
	latLong: string
) {
	const { accessToken, generateNewToken, initiatorId } = services;

	return fetcher(
		process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
		{
			token: accessToken,
			body: {
				client_ref_id: clientRefId,
				locale: "en",
				user_id: initiatorId,
				interaction_type_id: String(AEPS_INTERACTION.FINGPAY_STATUS),
				service_code: "43",
				latlong: latLong,
			},
		},
		generateNewToken
	) as Promise<AepsInteractionResponse>;
}

/**
 * Interaction 594 — AePS Daily Authentication. The agent's own biometric
 * re-verification, only reachable when Fingpay Status (391) reports it's
 * pending for today. See DailyAuthPayload in contracts.ts.
 * @param services
 * @param clientRefId
 * @param latLong
 * @param payload
 */
export function submitDailyAuth(
	services: AepsServices,
	clientRefId: string,
	latLong: string,
	payload: DailyAuthPayload
) {
	return callFingpayInteraction({
		services,
		interactionTypeId: AEPS_INTERACTION.DAILY_AUTH,
		clientRefId,
		latLong,
		extra: { ...FINGPAY_FIXED_FIELDS, ...payload },
	});
}

/**
 * Fetches the `aadhar` field's RSA public key (`enc_pub_key`) for a catalog
 * interaction, from connect-api's `POST /transactions/:catalogId` schema
 * endpoint (`routes/transactions.js`'s `fetchInteractionDetails` — the same
 * endpoint the legacy widget/tf-components/Form use to render a
 * `parameter_list`; auth'd with the same bearer token as every other call
 * here). `request_structure.enc_pub_key` is populated for the `aadhar`
 * parameter on catalog interactions 483, 994, and 614 (the same key value
 * across all three) and NULL for `piddata` (which has its own, unrelated
 * UIDAI PID-block handling). Note the `:id` here is the CATALOG id (e.g.
 * 483), not the `interaction_type_id` (344).
 * @param services
 * @param catalogInteractionId
 */
export async function getAadhaarPublicKey(
	services: AepsServices,
	catalogInteractionId: number
): Promise<string | null> {
	const response = await fetcher(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/${catalogInteractionId}`,
		{
			token: services.accessToken,
			body: { locale: "en" },
		},
		services.generateNewToken
	);

	const parameterList = (
		response as {
			request?: { parameter_list?: Array<Record<string, unknown>> };
		}
	)?.request?.parameter_list;
	const aadharParam = parameterList?.find((p) => p?.name === "aadhar");

	return (aadharParam?.enc_pub_key as string) || null;
}

/**
 * Interaction 150 — AEPS Search Customer. Confirmed to need only the
 * customer's mobile number (already sent as `customerId` on the shared
 * envelope) — no amount/aadhar/bank_code/biometric at this step.
 * @param services
 * @param clientRefId
 * @param customerId
 * @param latLong
 * @param payload
 */
export function searchCustomer(
	services: AepsServices,
	clientRefId: string,
	customerId: string,
	latLong: string,
	payload: SearchCustomerPayload = {}
) {
	return callAepsInteraction({
		services,
		interactionTypeId: AEPS_INTERACTION.SEARCH_CUSTOMER,
		clientRefId,
		customerId,
		latLong,
		extra: payload,
	});
}

/**
 * Interaction 483 — AePS Cashout (confirmed request contract, doc §4.3).
 * @param services
 * @param clientRefId
 * @param customerId
 * @param latLong
 * @param payload
 */
export function cashout(
	services: AepsServices,
	clientRefId: string,
	customerId: string,
	latLong: string,
	payload: CashoutPayload
) {
	return callAepsInteraction({
		services,
		interactionTypeId: AEPS_INTERACTION.CASHOUT,
		clientRefId,
		customerId,
		latLong,
		extra: payload,
	});
}

/**
 * Interaction 103 — Verify Customer OTP (catalog 485).
 * @param services
 * @param clientRefId
 * @param customerId
 * @param latLong
 * @param payload
 */
export function verifyOtp(
	services: AepsServices,
	clientRefId: string,
	customerId: string,
	latLong: string,
	payload: OtpPayload
) {
	return callAepsInteraction({
		services,
		interactionTypeId: AEPS_INTERACTION.OTP_VERIFY,
		clientRefId,
		customerId,
		latLong,
		extra: payload,
	});
}

/**
 * Interaction 614 — Complete Your KYC (wire interaction_type_id 540). Only
 * needs the agent's own encrypted Aadhaar + location — no piddata/bank_code.
 * See CompleteKycPayload in contracts.ts for a known backend issue on this
 * call.
 * @param services
 * @param clientRefId
 * @param latLong
 * @param payload
 */
export function completeKyc(
	services: AepsServices,
	clientRefId: string,
	latLong: string,
	payload: CompleteKycPayload
) {
	const { accessToken, generateNewToken, initiatorId } = services;

	return fetcher(
		process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
		{
			token: accessToken,
			body: {
				client_ref_id: clientRefId,
				locale: "en",
				customer_id: initiatorId,
				user_id: initiatorId,
				latlong: latLong,
				service_code: "43",
				interaction_type_id: String(AEPS_INTERACTION.COMPLETE_KYC),
				...payload,
			},
		},
		generateNewToken
	) as Promise<AepsInteractionResponse>;
}

/**
 * Interaction 615 — Verify OTP (wire 542, `GET /aeps/otp/verify`), step 2 of
 * the Complete-KYC chain (see VerifyKycOtpPayload in contracts.ts). Mirrors
 * `completeKyc`'s envelope shape since both hit the same `/aeps/...`
 * endpoint family under catalog 614's flow.
 * @param services
 * @param clientRefId
 * @param latLong
 * @param payload
 */
export function verifyKycOtp(
	services: AepsServices,
	clientRefId: string,
	latLong: string,
	payload: VerifyKycOtpPayload
) {
	const { accessToken, generateNewToken, initiatorId } = services;

	return fetcher(
		process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
		{
			token: accessToken,
			body: {
				client_ref_id: clientRefId,
				locale: "en",
				customer_id: initiatorId,
				user_id: initiatorId,
				latlong: latLong,
				service_code: "43",
				interaction_type_id: String(AEPS_INTERACTION.VERIFY_KYC_OTP),
				...payload,
			},
		},
		generateNewToken
	) as Promise<AepsInteractionResponse>;
}

/**
 * Interaction 616 — Complete Biometric Process (wire 543, `GET /aeps/kyc`),
 * step 3/final of the Complete-KYC chain (see CompleteKycBiometricPayload in
 * contracts.ts). `communication: "0"` matches param id 2066's fixed value in
 * 616's own schema.
 * @param services
 * @param clientRefId
 * @param latLong
 * @param payload
 */
export function completeKycBiometric(
	services: AepsServices,
	clientRefId: string,
	latLong: string,
	payload: CompleteKycBiometricPayload
) {
	const { accessToken, generateNewToken, initiatorId } = services;

	return fetcher(
		process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
		{
			token: accessToken,
			body: {
				client_ref_id: clientRefId,
				locale: "en",
				customer_id: initiatorId,
				user_id: initiatorId,
				latlong: latLong,
				service_code: "43",
				communication: "0",
				interaction_type_id: String(
					AEPS_INTERACTION.COMPLETE_KYC_BIOMETRIC
				),
				...payload,
			},
		},
		generateNewToken
	) as Promise<AepsInteractionResponse>;
}
