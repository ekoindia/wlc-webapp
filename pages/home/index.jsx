import React from "react";
import Head from "next/head";
import { Home } from "page-components/NonAdmin";
import { Layout } from "components";

const home = () => {
	return (
		<>
			<Layout>
				<Home />
			</Layout>
		</>
	);
};

export default home;
