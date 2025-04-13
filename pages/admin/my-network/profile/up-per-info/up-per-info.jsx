import { BreadcrumbWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { UpdatePersonalInfo } from "page-components/Admin";

/**
 *
 */
function UpdatePersonalInfoPage() {
	return (
		<PaddingBox>
			<BreadcrumbWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<UpdatePersonalInfo />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
}

UpdatePersonalInfoPage.pageMeta = {
	title: "My Network > Update Personal Info | Admin",
	isSubPage: true,
	isFixedBottomAppBar: true,
};

export default UpdatePersonalInfoPage;
