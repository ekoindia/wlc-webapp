import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { IconButtons } from "components";
import { useUser } from "contexts/UserContext";

/**
 * A <ShopCard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<ShopCard></ShopCard>` TODO: Fix example
 */
const ShopCard = () => {
	const { userData } = useUser();
	const data = userData.shopDetails;
	console.log("data", data);
	const shopObj = {
		shop_name: "Shop Name",
		shop_type: "Shop Type",
		shop_address: "Shop Address",
		city: "City",
		state: "State",
		pincode: "Pincode",
	};
	const onEditClick = () => {
		console.log("clicked");
	};
	return (
		<Flex
			w="100%"
			h={{ base: "240px", sm: "350px", md: "387px", lg: "400px" }}
			bg="white"
			direction="column"
			borderRadius="10px"
			border="1px solid #D2D2D2"
			boxShadow="0px 5px 15px #0000000D"
			p="5"
		>
			<Flex justify="space-between">
				<Text fontWeight="semibold" fontSize={{ base: "18px" }}>
					My Shop
				</Text>
				<IconButtons
					onClick={onEditClick}
					iconName="mode-edit"
					iconStyle={{ height: "12px", width: "12px" }}
				/>
			</Flex>
			<Grid templateColumns="repeat(2, 1fr)" mt="20px" rowGap="20px">
				{Object.entries(shopObj).map(([key, value], index) =>
					data[key] != "" ? (
						<GridItem key={index} colSpan={1} rowSpan={1}>
							<Flex direction="column">
								<Text>{value}</Text>
								<Text fontWeight="semibold">{data[key]}</Text>
							</Flex>
						</GridItem>
					) : null
				)}
			</Grid>
		</Flex>
	);
};

export default ShopCard;
