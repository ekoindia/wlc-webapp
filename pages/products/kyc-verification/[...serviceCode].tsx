/**
 * KYC Verification - Service form route (catch-all).
 * Handles both single service (/27355) and multi-service (/27355/30985) routes.
 */

import { PaddingBox } from "components/PaddingBox";
import { ServiceFormPage } from "features/kyc-verification";
import { useRouter } from "next/router";

const ServiceFormRoute = (): JSX.Element => {
	const router = useRouter();

	// Extract service codes from catch-all route
	const { serviceCode } = router.query;
	console.log("[ServiceFormRoute] serviceCode", serviceCode);

	// Ensure we have an array of service codes
	const serviceCodes: string[] = Array.isArray(serviceCode)
		? serviceCode
		: serviceCode
			? [serviceCode]
			: [];

	return (
		<PaddingBox>
			<ServiceFormPage serviceCodes={serviceCodes} />
		</PaddingBox>
	);
};

ServiceFormRoute.pageMeta = {
	title: "KYC & Verification | Service Form",
	isBeta: true,
	isSubPage: true,
};

export default ServiceFormRoute;
