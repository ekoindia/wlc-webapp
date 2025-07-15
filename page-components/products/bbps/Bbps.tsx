import { Flex } from "@chakra-ui/react";
import { InfoTileGrid, PageTitle } from "components";
import { BbpsProducts } from "./BbpsProducts";

/**
 * Bbps component renders the Bharat Bill Payment System page with a grid of products.
 * It includes a title and a grid of information tiles for each product.
 * @returns {JSX.Element} The rendered Bbps component.
 */
export const Bbps = (): JSX.Element => {
	return (
		<>
			<PageTitle title="Bharat Bill Payment System" />
			<Flex direction="column" gap={4} mx={{ base: "4", md: "0" }}>
				<InfoTileGrid list={BbpsProducts} />
			</Flex>
		</>
	);
};
