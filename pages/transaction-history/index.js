import { PaddingBox } from "components";
import Head from "next/head";
import { History } from "page-components";

const home = () => {
	return (
		<PaddingBox>
			<Head>
				<title>Transaction History</title>
			</Head>
			<History />
		</PaddingBox>
	);
};

export default home;
