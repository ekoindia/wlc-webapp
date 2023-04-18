import { Grid } from "@chakra-ui/react";
import EkycWidget from "./EkycWidget/EkycWidget";
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
					lg: "repeat(3, 1fr)",
				}}
				justifyContent="center"
				py={{ base: "20px", md: "0px" }}
				gap={{ base: (2, 4), md: (4, 2), lg: (4, 6) }}
			>
				<EkycWidget />
				<QueryWidget />
				{/* <CommonTransaction /> */}
			</Grid>
		</div>
	);
};

export default Widgets;
