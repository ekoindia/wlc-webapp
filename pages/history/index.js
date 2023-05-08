import { PaddingBox } from "components";
import Head from "next/head";
import { History } from "page-components";

const HistoryPage = () => {
	return (
		<>
			<Head>
				<title>Transaction History</title>
			</Head>
			<PaddingBox>
				<History />
			</PaddingBox>
		</>
	);
};

export default HistoryPage;
