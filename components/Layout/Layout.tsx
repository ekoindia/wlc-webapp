import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import NavSide from "./NavSide";

// const {Content} = Layout;

const Layout = (props) => {
	return (
		<NavSide>
			<Grid
				templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
				gridTemplateRows={"50px 1fr 30px"}
				gridTemplateColumns={"150px 1fr"}
				h="200px"
				gap="1"
				color="blackAlpha.700"
				fontWeight="bold"
			>
				<GridItem pl="2" bg="green.300" area={"main"}>
					Main
				</GridItem>
			</Grid>
		</NavSide>
	);
};

export default Layout;
