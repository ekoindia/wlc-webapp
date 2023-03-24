import React from "react";
import Head from "next/head";
import { Transaction } from "page-components/NonAdmin";
import { Layout } from "components";

const home = () => {
	return (
		<>
			<Layout>
				<Transaction />
			</Layout>
		</>
	);
};

export default home;
