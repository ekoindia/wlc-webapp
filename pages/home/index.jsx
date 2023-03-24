import React from "react";
import Head from "next/head";
import { Home } from "page-components/NonAdmin";
import { Layout, Headings } from "components";

const home = () => {
	return (
		<>
			<Headings title="Home" hasIcon={false} isMTRequired={false} />
			<Home />
		</>
	);
};

export default home;
