import { BreadcrumbWrapper, PaddingBox } from "components";
import { QueryCenter } from "page-components/Admin";

const QueryPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/admin/query": "Query Center",
				}}
			>
				<QueryCenter />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

QueryPage.pageMeta = {
	title: "Query Center | Admin",
};

export default QueryPage;
