import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";

import { ProfilePanel } from "page-components/Admin";
import { useState } from "react";

const Profile = () => {
	const [/* comp, */ setComp] = useState(); // TODO: remove if not needed
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
				<ProfilePanel setComp={setComp} />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

Profile.pageMeta = {
	title: "My Network > Seller Details | Admin",
	isSubPage: true,
};

export default Profile;
