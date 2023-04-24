import { Grid } from "@chakra-ui/react";
import QueryWidget from "../Widgets/QueryWidget/QueryWidget";
/**
 * A Home component
 * main component where other widget card are align in a grid
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Home></Home>`
 */
const Home = () => {
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
			{/* <TransactionWidget/> */}
			{/* <EkycWidget/> */}
		</Grid>
	);
};

export default Home;
