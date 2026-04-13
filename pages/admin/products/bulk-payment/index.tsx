import { Box } from "@chakra-ui/react";
import {
	BreadcrumbWrapper,
	generateBreadcrumbs,
} from "components/BreadcrumbWrapper";
import { useRouter } from "next/router";
import { BulkPayout } from "page-components/products/bulk-payout";

/**
 * Entry point for the Bulk Payout page.
 * @returns {JSX.Element} Bulk Payout page
 */
export default function BulkPayoutPage() {
	const router = useRouter();

	const omitPaths = ["/admin", "/admin/products"];

	const crumbs = generateBreadcrumbs(router.asPath, {}, omitPaths);

	return (
		<>
			<Box
				p={{
					base: "0px",
					md: "30px",
				}}
				pb={{ base: "20px", md: "5px" }}
			>
				<BreadcrumbWrapper crumbs={crumbs} />
			</Box>
			<BulkPayout />
		</>
	);
}

BulkPayoutPage.pageMeta = {
	title: "Bulk Payments",
	isFixedBottomAppBar: true,
};
