import { Box, Grid } from "@chakra-ui/react";
import { StatusCard } from "components";
import CommonTransaction from "./CommonTransaction/CommonTransaction";
import QueryWidget from "./QueryWidget/QueryWidget";
/**
 * A <Widgets> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Widgets></Widgets>`
 */
const Widgets = ({ className = "", ...props }) => {
	return (
		<div className={`${className}`} {...props}>
			<Grid
				width={"100%"}
				templateColumns={{
					base: "repeat(1, 1fr)",
					sm: "repeat(2, 1fr)",
					md: "repeat(2, 1fr)",
					lg: "repeat(2, 1fr)",
					xl: "repeat(2,1fr)",
				}}
				justifyContent="center"
				p={{ base: "0px 0px 0px 0px", md: "20px 20px 20px 20px" }}
				gap={{ base: (2, 4), md: (4, 2), lg: (4, 4) }}
			>
				{/* <EkycWidget /> */}
				<Box display={{ base: "block", lg: "none" }}>
					<StatusCard bgColor={"white"} />
				</Box>
				<QueryWidget />
				<CommonTransaction />
			</Grid>
		</div>
	);
};

export default Widgets;
