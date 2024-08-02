import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";
import { UpdatePersonalInfo } from "page-components/Admin";

/**
 *
 */
function UpdatePersonalInfoPage() {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
				<UpdatePersonalInfo />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
}

UpdatePersonalInfoPage.pageMeta = {
	title: "My Network > Update Personal Info | Admin",
	isSubPage: true,
	reduceBottomAppBarAnimation: true,
};

export default UpdatePersonalInfoPage;
