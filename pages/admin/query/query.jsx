import { BreadcrumbsWrapper, PaddingBox } from "components";
import { QueryObject } from "constants";
import Head from "next/head";
import { QueryCenter } from "page-components/Admin";

const QueryPage = () => {
	return (
		<>
			<Head>
				<title>Query</title>
			</Head>
			<PaddingBox>
				<BreadcrumbsWrapper BreadcrumbsObject={QueryObject}>
					<QueryCenter />
				</BreadcrumbsWrapper>
			</PaddingBox>
		</>
	);
};

QueryPage.pageMeta = {
	title: "Query Center | Admin",
	showBottomAppBar: true,
};

export default QueryPage;
