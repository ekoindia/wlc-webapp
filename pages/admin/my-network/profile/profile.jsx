import { Layout } from "components";
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
				<ProfilePanel setComp={setComp} />
			</Layout>
		</>
	);
};

export default Profile;
