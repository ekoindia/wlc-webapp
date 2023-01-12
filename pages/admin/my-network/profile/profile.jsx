import { Layout, ProfilePanel } from "components";
import Head from "next/head";
import React from "react";

const Profile = () => {
	return (
		<>
			<Head>
				<title>Profile | Eko API Marketplace</title>
			</Head>
			<Layout>
				<ProfilePanel />
			</Layout>
		</>
	);
};

export default Profile;
