import { PaddingBox } from "components";
import { History } from "page-components";

const NetworkStatementPage = () => {
	return (
		<PaddingBox>
			<History forNetwork />
		</PaddingBox>
	);
};

// If the "subPage" property is set, then this page will hide the top app header in mobile view.
// Pages can show their own header bar with back button.
NetworkStatementPage.pageMeta = {
	title: "Network's Transaction History | Admin",
	isSubPage: false,
};

export default NetworkStatementPage;
