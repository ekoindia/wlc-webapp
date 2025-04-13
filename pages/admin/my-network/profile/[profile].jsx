import { BreadcrumbWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";

import { ProfilePanel } from "page-components/Admin";

const Profile = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<ProfilePanel />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

Profile.pageMeta = {
	title: "My Network > Agent Details | Admin",
	isSubPage: true,
};

export default Profile;
