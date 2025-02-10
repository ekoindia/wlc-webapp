import { BreadcrumbsWrapper, PaddingBox } from "components";
import { QueryCenter } from "page-components/Admin";

const QueryPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/admin/query": "Query Center",
				}}
			>
				<QueryCenter />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

QueryPage.pageMeta = {
	title: "Query Center | Admin",
};

export default QueryPage;
