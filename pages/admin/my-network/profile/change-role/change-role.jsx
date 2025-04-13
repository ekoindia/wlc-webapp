import { BreadcrumbWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { ChangeRole } from "page-components/Admin";

const ChangeRolePage = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<ChangeRole />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

ChangeRolePage.pageMeta = {
	title: "My Network > Change Role | Admin",
	isSubPage: true,
	isFixedBottomAppBar: true,
};

export default ChangeRolePage;
