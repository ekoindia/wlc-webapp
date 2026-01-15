import { BulkPayout } from "page-components/products/bulk-payout";

/**
 * Entry point for the Bulk Payout page.
 * @returns {JSX.Element} Bulk Payout page
 */
export default function BulkPayoutPage() {
	// const router = useRouter();

	// const labelOverrides = {
	// 	products: "Products",
	// 	"bulk-payout": "Bulk Payout",
	// };

	// const omitPaths = ["/products"];

	// const crumbs = generateBreadcrumbs(
	// 	router.asPath,
	// 	labelOverrides,
	// 	omitPaths
	// );

	return (
		// <PaddingBox noSpacing={true}>
		/* <Breadcrumb crumbs={crumbs} hideHome /> */
		<>
			<BulkPayout />
		</>
		// </PaddingBox>
	);
}

BulkPayoutPage.pageMeta = {
	title: "Bulk Payout",
	isFixedBottomAppBar: true,
};
