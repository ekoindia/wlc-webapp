import { BreadcrumbsWrapper, Layout, PaddingBox } from "components";
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
			<Layout /* propComp={comp} */>
				<PaddingBox>
					<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
						<ProfilePanel setComp={setComp} />
					</BreadcrumbsWrapper>
				</PaddingBox>
			</Layout>
		</>
	);
};

export default Profile;
