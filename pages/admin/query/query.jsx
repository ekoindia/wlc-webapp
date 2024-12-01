import { BreadcrumbsWrapper, PaddingBox } from "components";
import Head from "next/head";
import { QueryCenter } from "page-components/Admin";

const QueryPage = () => {
	return (
		<>
			<Head>
				<title>Query</title>
			</Head>
			<PaddingBox>
				<BreadcrumbsWrapper
					breadcrumbsData={{
						"/admin/query": "Query Center",
					}}
				>
					<QueryCenter />
				</BreadcrumbsWrapper>
			</PaddingBox>
		</>
	);
};

QueryPage.pageMeta = {
	title: "Query Center | Admin",
};

export default QueryPage;
