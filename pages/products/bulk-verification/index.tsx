import { Box } from "@chakra-ui/react";
import { Breadcrumb } from "components/Breadcrumb";
import BulkVerification from "features/kyc-verification/components/BulkVerification";

/**
 * Entry point for the Bulk Verification page.
 * @returns {JSX.Element} Bulk Verification page
 */

/**
 *
 */
export default function BulkVerificationPage() {
	const crumbs = [
		{
			label: "Kyc & Verification",
			href: "/products/kyc-verification",
			isCurrent: false,
		},
		{
			label: "Bulk Verification",
			href: "/products/bulk-verification",
			isCurrent: true,
		},
	];

	return (
		<>
			<Box
				p={{
					base: "0px",
					md: "30px",
				}}
				pb={{ base: "20px", md: "5px" }}
			>
				<Breadcrumb crumbs={crumbs} />
			</Box>
			<BulkVerification />
		</>
	);
}

BulkVerificationPage.pageMeta = {
	title: "Bulk Verification",
	isFixedBottomAppBar: true,
};
