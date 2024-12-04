import { BreadcrumbsWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { UpdatePersonalInfo } from "page-components/Admin";

/**
 *
 */
function UpdatePersonalInfoPage() {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<UpdatePersonalInfo />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
}

UpdatePersonalInfoPage.pageMeta = {
	title: "My Network > Update Personal Info | Admin",
	isSubPage: true,
	isFixedBottomAppBar: true,
};

export default UpdatePersonalInfoPage;
