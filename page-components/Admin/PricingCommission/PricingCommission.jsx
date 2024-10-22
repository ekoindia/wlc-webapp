import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { Button, Headings, Icon } from "components";
import { Endpoints, TransactionTypes, product_categories } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { saveDataToFile } from "utils";
import { PricingGrid } from "./PricingGrid";

/**
 * Admin > Pricing & Commission: Main Page.
 * Show a list of products to set pricing/commissions for.
 */
const PricingCommission = () => {
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
								<PricingGrid product_list={products} />
							</Flex>
						);
					}
				)}
			</Flex>
		</>
	);
};

export { PricingCommission };

const DownloadPricing = () => {
	const { accessToken } = useSession();
	const handleClick = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-is-file-download": "1",
			},
			body: {
				interaction_type_id: TransactionTypes.DOWNLOAD_EXISTING_PRICING,
			},
			token: accessToken,
		})
			.then((data) => {
				const _blob = data?.file?.blob;
				const _filename = data?.file?.name || "file";
				const _type = data?.file["content-type"];
				const _b64 = true;
				saveDataToFile(_blob, _filename, _type, _b64);
			})
			.catch((err) => {
				console.error("Error: ", err);
			});
	};
	return (
		<Button
			size={{ base: "sm", md: "md" }}
			icon="file-download"
			iconStyle={{ size: { base: "xs", md: "sm" } }}
			iconSpacing="2"
			onClick={handleClick}
		>
			Existing Pricing
		</Button>
	);
};
