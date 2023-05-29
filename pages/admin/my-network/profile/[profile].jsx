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
	title: "My Network > Seller Details | Admin",
	isSubPage: true,
};

export default Profile;
