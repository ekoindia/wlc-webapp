// filepath: /Users/abhi/DEV/eko_github/wlc-webapp/page-components/products/kyc/KycVerificationTools.tsx
import { InfoTileGrid } from "components";

/**
 * List of KYC verification tools
 */
const KycTools: {
	label: string;
	desc: string;
	icon?: string;
	url: string;
}[] = [
	{
		label: "Vehicle RC Verification",
		desc: "Verify vehicle details and registration information",
		icon: "directions-car",
		url: "kyc/vehicle-rc",
	},
	{
		label: "GSTIN Verification",
		desc: "Verify a GSTIN and view business details",
		icon: "search",
		url: "kyc/gstin",
	},
];

export const KycVerificationTools = (): JSX.Element => {
	return <InfoTileGrid list={KycTools} />;
};
