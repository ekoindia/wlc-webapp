import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkTransactionHistoryBreadcrumbs } from "constants/BreadcrumbsData";
import { NetworkTransactionHistory } from "page-components/Admin";

const NetworkTransactionHistoryPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={NetworkTransactionHistoryBreadcrumbs}
			>
				<NetworkTransactionHistory />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

// If the "subPage" property is set, then this page will hide the top app header in mobile view.
// Pages can show their own header bar with back button.
NetworkTransactionHistoryPage.pageMeta = {
	title: "Network Transaction History",
	isSubPage: false,
};

// Use a diferent layout, if needed...
// First, import the alternate layout: import { LayoutLogin } from "layout-components";
// NetworkTransactionHistoryPage.getLayout = LayoutLogin;

export default NetworkTransactionHistoryPage;
