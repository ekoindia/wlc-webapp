import { Box } from "@chakra-ui/react";
import { useOrgDetailContext, useSession, useUser } from "contexts";
import { useRefreshToken } from "hooks";
import { useMemo } from "react";
import { AepsProvider, useAepsContext } from "./context/AepsContext";
import { CashoutForm } from "./components/CashoutForm";
import { ChooseDevice } from "./components/ChooseDevice";
import { CompleteKyc } from "./components/CompleteKyc";
import { CompleteKycBiometric } from "./components/CompleteKycBiometric";
import { DailyAuth } from "./components/DailyAuth";
import { FingpayStatus } from "./components/FingpayStatus";
import { OtpVerification } from "./components/OtpVerification";
import { PaymentMode } from "./components/PaymentMode";
import { ProviderSelect } from "./components/ProviderSelect";
import { ResultScreen } from "./components/ResultScreen";
import { SearchCustomer } from "./components/SearchCustomer";
import { VerifyKycOtp } from "./components/VerifyKycOtp";
import type { AepsServices } from "./contracts";

/** Switches on `state.step` to render the active screen of the AePS chain. */
const AepsFlow = () => {
	const { state } = useAepsContext();

	switch (state.step) {
		case "provider":
			return <ProviderSelect />;
		case "fingpayStatus":
			return <FingpayStatus />;
		case "chooseDevice":
			return <ChooseDevice />;
		case "completeKyc":
			return <CompleteKyc />;
		case "verifyKycOtp":
			return <VerifyKycOtp />;
		case "completeKycBiometric":
			return <CompleteKycBiometric />;
		case "dailyAuth":
			return <DailyAuth />;
		case "paymentMode":
			return <PaymentMode />;
		case "search":
			return <SearchCustomer />;
		case "otp":
			return <OtpVerification />;
		case "cashout":
			return <CashoutForm />;
		case "result":
			return <ResultScreen />;
		default:
			return null;
	}
};

/**
 * Route entry for the AePS cashout flow. Gathers agent/org identity for the
 * request envelope (doc §2) and mounts `AepsProvider` around `AepsFlow`.
 */
export const AepsCashout = () => {
	const { accessToken, userId } = useSession();
	const { userData } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const { generateNewToken } = useRefreshToken();

	const services: AepsServices = useMemo(
		() => ({
			accessToken,
			generateNewToken,
			userCode: userData?.userDetails?.code ?? "",
			initiatorId: String(userId ?? ""),
			orgId: String(orgDetail?.org_id ?? ""),
			// TODO(OPEN ITEM, doc §7): confirm production realsourceip source —
			// mirrors the pattern used in PendingBankRequests.tsx.
			realSourceIp:
				orgDetail?.metadata?.realsourceip ||
				process.env.NEXT_PUBLIC_REAL_SOURCE_IP ||
				undefined,
		}),
		[accessToken, generateNewToken, userData, userId, orgDetail]
	);

	return (
		<Box maxW="480px" mx="auto">
			<AepsProvider services={services}>
				<AepsFlow />
			</AepsProvider>
		</Box>
	);
};

export default AepsCashout;
