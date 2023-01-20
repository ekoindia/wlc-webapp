import { Box, Show } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "..";
import NavSide from "./NavSide";

// const {Content} = Layout;

const Layout = (props) => {
	return (
		<NavSide>
			<Box p={4}>
				<Show breakpoint="(min-width: 450px)">
					<Breadcrumbs />
				</Show>
				{props.children}
			</Box>
		</NavSide>
	);
};

export default Layout;
