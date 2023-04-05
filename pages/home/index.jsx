import Head from "next/head";
import { Home } from "page-components/NonAdmin";

const home = () => {
	return (
		<>
			<Head>
				<title>HOME | WLC</title>
			</Head>
			<Home />
		</>
	);
};

export default home;
