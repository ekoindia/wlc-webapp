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
		label: "CIN Verification",
		desc: "Verify Corporate Identification Number details including business and director information",
		icon: "domain",
		url: "kyc/cin",
	},
	{
		label: "Driving License Verification",
		desc: "Verify driving license details including validity, vehicle classes, and more",
		icon: "directions-car",
		url: "kyc/driving-license",
	},
	{
		label: "Employee Verification",
		desc: "Verify employee employment details including UAN, company information and service history",
		icon: "badge",
		url: "kyc/employment",
	},
	{
		label: "GSTIN Verification",
		desc: "Verify a GSTIN and view business details",
		icon: "business-center",
		url: "kyc/gstin",
	},
	{
		label: "PAN Verification",
		desc: "Verify PAN details with multiple verification options",
		icon: "credit-card",
		url: "kyc/pan",
	},
	{
		label: "Passport Verification",
		desc: "Verify Indian passport details using file number and date of birth",
		icon: "book",
		url: "kyc/passport",
	},
	{
		label: "Vehicle RC Verification",
		desc: "Verify vehicle details and registration information",
		icon: "directions-car",
		url: "kyc/vehicle-rc",
	},
	{
		label: "Voter ID Verification",
		desc: "Verify voter ID details including constituency information",
		icon: "fingerprint",
		url: "kyc/voter-id",
	},
];

export const KycVerificationTools = (): JSX.Element => {
	return <InfoTileGrid list={KycTools} />;
};
