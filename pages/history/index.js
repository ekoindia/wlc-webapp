import { PaddingBox } from "components";
// import Head from "next/head";
import { History } from "page-components";

const HistoryPage = () => {
	return (
		<PaddingBox>
			<History />
		</PaddingBox>
	);
};

// if subPage property is set, then this page will hide the top app header in mobile view.
// Pages can show their own header bar with back button.
HistoryPage.pageMeta = {
	title: "Transaction History",
	isSubPage: true,
	showBottomAppBar: true,
};

export default HistoryPage;
