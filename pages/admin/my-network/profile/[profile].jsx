import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";

import Head from "next/head";
import { ProfilePanel } from "page-components/Admin";
import { useState } from "react";

const Profile = () => {
	const [/* comp, */ setComp] = useState(); // TODO: remove if not needed
	return (
		<>
			<Head>
				<title>Seller Details</title>
			</Head>
			<PaddingBox>
				<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
					<ProfilePanel setComp={setComp} />
				</BreadcrumbsWrapper>
			</PaddingBox>
		</>
	);
};

export default Profile;
