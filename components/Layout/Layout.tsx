import { Box, Show } from "@chakra-ui/react";
import { Breadcrumbs } from "..";
import NavSide from "./NavSide";

// const {Content} = Layout;

const Layout = (props) => {
	return (
		<Box bg="bg">
			<NavSide>
				<Box p={4}>
					<Show breakpoint="(min-width: 450px)">
						<Breadcrumbs />
					</Show>
					{props.children}
				</Box>
			</NavSide>
		</Box>
	);
};

export default Layout;
