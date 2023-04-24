import { PaddingBox } from "components";
import Head from "next/head";
import { Home } from "page-components/NonAdmin";

const home = () => {
	return (
		<PaddingBox>
			<Head>
				<title>Home</title>
			</Head>
			<Home />
		</PaddingBox>
	);
};

export default home;
