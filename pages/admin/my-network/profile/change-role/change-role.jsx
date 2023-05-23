import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";
import { ChangeRole } from "page-components/Admin";

const ChangeRolePage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
				<ChangeRole />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

ChangeRolePage.pageMeta = {
	title: "My Network > Change Role | Admin",
	isSubPage: true,
};

export default ChangeRolePage;
