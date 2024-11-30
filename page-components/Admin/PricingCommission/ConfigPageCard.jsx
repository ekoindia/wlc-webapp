import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { Headings, Icon } from "components";
import { product_categories } from "constants";
import { ConfigGrid } from "./ConfigGrid";
import { DownloadPricing } from "./DownloadPricing";

/**
 * Admin > Pricing & Commission: Main Page.
 * Show a list of products to set pricing/commissions for.
 */
const ConfigPageCard = () => {
	return (
		<>
			<Headings
				title="Pricing & Commissions"
				hasIcon={false}
				propComp={<DownloadPricing />}
			/>
			<Flex
				direction="column"
				px={{ base: "16px", md: "initial" }}
				// mb={{ base: "16", md: "0" }}
				gap={{ base: "2", md: "8" }}
			>
				{Object.entries(product_categories)?.map(
					([category, { description, products }]) => {
						return (
							<Flex
								key={category}
								direction="column"
								gap={{ base: "0.25", md: "2" }}
								py="2"
							>
								<Flex align="center" gap="1">
									<Text
										fontSize={{ base: "md", md: "lg" }}
										fontWeight="semibold"
									>
										{category}
									</Text>
									<Tooltip
										hasArrow
										placement="right"
										label={description}
										aria-label={description}
										fontSize="xs"
										bg="primary.DEFAULT"
										color="white"
										borderRadius="8"
									>
										<span>
											<Icon
												name="info-outline"
												size="xs"
												cursor="pointer"
												color="light"
												display={{
													base: "none",
													md: "block",
												}}
											/>
										</span>
									</Tooltip>
								</Flex>
								<ConfigGrid product_list={products} />
							</Flex>
						);
					}
				)}
			</Flex>
		</>
	);
};

export { ConfigPageCard };
