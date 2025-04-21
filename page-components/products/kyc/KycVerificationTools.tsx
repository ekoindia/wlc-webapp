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
		label: "Driving License Verification",
		desc: "Verify driving license details including validity, vehicle classes, and more",
		icon: "directions-car",
		url: "kyc/driving-license",
	},
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
	{
		label: "PAN Verification",
		desc: "Verify PAN details with multiple verification options",
		icon: "credit-card",
		url: "kyc/pan",
	},
];

export const KycVerificationTools = (): JSX.Element => {
	return <InfoTileGrid list={KycTools} />;
};
