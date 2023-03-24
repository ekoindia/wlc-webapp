import React from "react";
import Head from "next/head";
import { Transaction } from "page-components/NonAdmin";
import { Layout, Headings, BreadcrumbsWrapper } from "components";

const home = () => {
	return (
		<>
			<Transaction />
		</>
	);
};

export default home;
