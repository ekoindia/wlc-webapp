import { BreadcrumbsWrapper, Layout } from "components";
import { NetworkObject } from "constants";

import Head from "next/head";
import { ProfilePanel } from "page-components/Admin";
import React, { useState } from "react";

const Profile = () => {
	const [comp, setComp] = useState();
	return (
		<>
			<Head>
				<title>Profile | Eko API Marketplace</title>
			</Head>
			<Layout propComp={comp}>
				<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
					<ProfilePanel setComp={setComp} />
				</BreadcrumbsWrapper>
			</Layout>
		</>
	);
};

export default Profile;
