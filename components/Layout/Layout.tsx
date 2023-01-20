import { Show } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "..";
import NavSide from "./NavSide";

// const {Content} = Layout;

const Layout = (props) => {
	return (
		<NavSide>
			<Show breakpoint="(min-width: 450px)">
				<Breadcrumbs />
			</Show>
			{props.children}
		</NavSide>
	);
};

export default Layout;
