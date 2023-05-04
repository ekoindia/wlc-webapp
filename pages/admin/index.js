import { Layout, PaddingBox } from "components";
import Head from "next/head";
import { Dashboard } from "page-components/Admin";

const Dashboards = () => {
	return (
		<>
			<Head>
				<title>Dashboard</title>
			</Head>
			<Layout>
				<PaddingBox>
					<Dashboard />
				</PaddingBox>
			</Layout>
		</>
	);
};

export default Dashboards;
