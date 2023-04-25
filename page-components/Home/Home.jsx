import { Grid } from "@chakra-ui/react";
import { QueryWidget } from ".";

/**
 * A <Home> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Home></Home>` TODO: Fix example
 */
const Home = ({ ...rest }) => {
	return (
		<Grid
			width={"100%"}
			templateColumns={{
				base: "repeat(1, 1fr)",
				sm: "repeat(1, 1fr)",
				md: "repeat(2, 1fr)",
				lg: "repeat(2, 1fr)",
				xl: "repeat(2,1fr)",
			}}
			justifyContent="center"
			p={{ base: "0px 0px 0px 0px", md: "20px 20px 20px 20px" }}
			gap={{ base: (2, 4), sm: (2, 4), md: (4, 2), lg: (4, 4) }}
		>
			<QueryWidget />
			{/* <RecentTrxnCard />
			<KycWidget />
			<CommonTrxnWidget /> */}
		</Grid>
	);
};

export default Home;
