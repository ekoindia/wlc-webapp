import { Grid } from "@chakra-ui/react";
import { BillPaymentCard, CommonTrxnWidget, QueryWidget } from ".";

/**
 * A <Home> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Home></Home>` TODO: Fix example
 */
const Home = () => {
	return (
		<>
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
				gap={{ base: (2, 4), sm: (2, 4), md: (4, 2), lg: (4, 4) }}
			>
				<QueryWidget />
				{/* <RecentTrxnCard /> */}
				{/*<KycWidget />*/}
				<CommonTrxnWidget />
				<BillPaymentCard />
			</Grid>
		</>
	);
};

export default Home;
