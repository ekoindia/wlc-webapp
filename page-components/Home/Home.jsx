import { Grid, GridItem } from "@chakra-ui/react";
import {
	BillPaymentWidget,
	CommonTrxnWidget,
	QueryWidget,
	RecentTrxnWidget,
} from ".";

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
				templateColumns={{
					base: "repeat(auto-fit,minmax(280px,1fr))",
					sm: "repeat(auto-fit,minmax(380px,1fr))",
					md: "repeat(auto-fit,minmax(360px,1fr))",
					// lg: "repeat(auto-fit,minmax(360px,1fr))",
					xl: "repeat(auto-fit,minmax(440px,1fr))",
				}}
				justifyContent="center"
				py={{ base: "20px", md: "0px" }}
				gap={{ base: (2, 2), md: (4, 2), lg: (4, 6) }}
				width={"100%"}
			>
				<GridItem>
					<CommonTrxnWidget />
				</GridItem>

				{/*<KycWidget />*/}

				<GridItem>
					<BillPaymentWidget />
				</GridItem>

				<GridItem>
					<RecentTrxnWidget />
				</GridItem>

				<GridItem>
					<QueryWidget />
				</GridItem>
			</Grid>
		</>
	);
};

export default Home;
