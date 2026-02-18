import BulkVerification from "features/kyc-verification/components/BulkVerification";

/**
 * Entry point for the Bulk Verification page.
 * @returns {JSX.Element} Bulk Verification page
 */
export default function BulkVerificationPage() {
	return <BulkVerification />;
}

BulkVerificationPage.pageMeta = {
	title: "Bulk Verification",
	isFixedBottomAppBar: true,
};
