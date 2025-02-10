import { BreadcrumbsWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";

import { ProfilePanel } from "page-components/Admin";

const Profile = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<ProfilePanel />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

Profile.pageMeta = {
	title: "My Network > Agent Details | Admin",
	isSubPage: true,
};

export default Profile;
