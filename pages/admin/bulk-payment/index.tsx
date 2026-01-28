import { BulkPayout } from "page-components/products/bulk-payout";

/**
 * Entry point for the Bulk Payout page.
 * @returns {JSX.Element} Bulk Payout page
 */
export default function BulkPayoutPage() {
	return <BulkPayout />;
}

BulkPayoutPage.pageMeta = {
	title: "Bulk Payment",
	isFixedBottomAppBar: true,
};
