import { useOrgDetailContext } from "contexts";
import { useEffect } from "react";

// Time in milliseconds to persist the OTP screen, if the user comes back to the app within this time.
const PERSIST_OTP_SCREEN_TIMEOUT_MS = 240000; // 4 mins

/**
 * Custom hook to restore last login or OTP route from localStorage.
 * @param {object} params
 * @param {object} params.number - Current number state
 * @param {(_val: any) => void} params.setNumber - Setter for number state
 * @param {(_val: boolean) => void} [params.setShowWelcomeCard] - Optional setter for welcome card visibility
 * @param {(_val: string) => void} params.setLastUserName - Setter for last user name
 * @param {(_val: string) => void} params.setLastMobileFormatted - Setter for last formatted mobile number
 * @param {(_val: string) => void} params.setLoginType - Setter for login type (e.g., "Mobile")
 * @param {(_val: string) => void} params.setStep - Setter for current step (e.g., "LOGIN", "VERIFY_OTP")
 * @param params.number.original
 * @param params.number.formatted
 * @returns {void}
 */
export const useRestoreLastLoginOrRoute = ({
	number,
	setNumber,
	setShowWelcomeCard,
	setLastUserName,
	setLastMobileFormatted,
	setLoginType,
	setStep,
}: {
	number: { original: string; formatted: string };
	setNumber: (_val: { original: string; formatted: string }) => void;
	setShowWelcomeCard?: (_val: boolean) => void;
	setLastUserName: (_val: string) => void;
	setLastMobileFormatted: (_val: string) => void;
	setLoginType: (_val: string) => void;
	setStep: (_val: string) => void;
}) => {
	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail ?? {};
	const { login_meta } = metadata ?? {};
	const isMobileMappedUserId = login_meta?.mobile_mapped_user_id === 1;

	useEffect(() => {
		if (number?.formatted?.length > 0) return;

		// TODO: Fill user-id instead of mobile number
		if (isMobileMappedUserId) return;

		const lastLogin = JSON.parse(
			localStorage.getItem("inf-last-login") ?? "null"
		);
		const lastRoute = JSON.parse(
			localStorage.getItem("inf-last-route") ?? "null"
		);

		if (!lastLogin) return;

		if (
			lastRoute?.path === "/" &&
			lastRoute?.meta?.step === "VERIFY_OTP" &&
			lastRoute?.meta?.type === "Mobile" &&
			lastRoute?.meta?.mobile?.formatted &&
			lastRoute?.at > Date.now() - PERSIST_OTP_SCREEN_TIMEOUT_MS &&
			lastLogin?.meta
		) {
			// Was the user on enter-OTP screen in the last 4 mins?
			// Take them back there without resending OTP...
			setNumber(lastRoute.meta.mobile);

			// When called from LoginPanel component:
			setShowWelcomeCard?.(false);

			// When called from LoginWidget component:
			setLastMobileFormatted?.(lastRoute.meta.mobile.formatted);
			setLoginType?.("Mobile");
			setStep?.("VERIFY_OTP");
		} else if (lastLogin?.type !== "Google" && lastLogin?.mobile > 1) {
			const formatted_mobile = formatMobileNumber(lastLogin.mobile);
			setNumber({
				original: lastLogin.mobile,
				formatted: formatted_mobile,
			});
			// When called from LoginWidget component:
			setLastMobileFormatted?.(formatted_mobile);
		}

		// Check if lastLogin.name exists and is not a mobile number
		if (lastLogin?.name && lastLogin.name.match(/^[a-zA-Z]/)) {
			setLastUserName?.(lastLogin.name.split(" ")[0]);
		}
	}, []);
};

/**
 * Format mobile number in the following format: 123 456 7890
 * @param {number} mobile - Mobile number to format
 * @returns {string} Formatted mobile number
 */
function formatMobileNumber(mobile: number | string): string {
	return mobile.toString().replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
}
