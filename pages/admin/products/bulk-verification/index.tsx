import { BulkVerification } from "features/bulk-verification";

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
