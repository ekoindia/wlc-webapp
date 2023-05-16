import { PaddingBox } from "components";
import Head from "next/head";
import { Dashboard } from "page-components/Admin";

const Dashboards = () => {
	return (
		<>
			<Head>
				<title>Dashboard</title>
			</Head>
			<PaddingBox>
				<Dashboard />
			</PaddingBox>
		</>
	);
};

export default Dashboards;
