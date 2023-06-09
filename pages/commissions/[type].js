import { PaddingBox } from "components";
// import Head from "next/head";
import { Commissions } from "page-components";

const CommissionsPage = () => {
	return (
		<PaddingBox>
			<Commissions />
		</PaddingBox>
	);
};

// if subPage property is set, then this page will hide the top app header in mobile view.
// Pages can show their own header bar with back button.
CommissionsPage.pageMeta = {
	title: "Transaction Commissions",
	isSubPage: true,
};

export default CommissionsPage;
