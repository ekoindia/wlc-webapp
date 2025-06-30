import { Flex } from "@chakra-ui/react";
import { InfoTileGrid, PageTitle } from "components";
import { BbpsProducts } from "./BbpsProducts";

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
