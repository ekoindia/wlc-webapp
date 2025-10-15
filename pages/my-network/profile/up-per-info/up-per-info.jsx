import { BreadcrumbWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { UpdatePersonalInfo } from "page-components/Admin";

/**
 * Update Personal Info page for My Network
 * @returns {JSX.Element} The page component
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
	title: "My Network > Update Personal Info",
	isFixedBottomAppBar: true,
};

export default UpdatePersonalInfoPage;
