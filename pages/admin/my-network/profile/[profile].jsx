import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";

import { ProfilePanel } from "page-components/Admin";

const Profile = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
				<ProfilePanel />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

Profile.pageMeta = {
	title: "My Network > Agent Details | Admin",
	isSubPage: true,
	showBottomAppBar: true,
};

export default Profile;
