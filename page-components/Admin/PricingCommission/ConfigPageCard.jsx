import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { Icon, PageTitle } from "components";
import { useEffect, useState } from "react";
import { ConfigGrid } from "./ConfigGrid";

/**
 * Show a configuration page with a list of configuratoin options.
 * For example, a list of products to set pricing/commissions for.
 * @param {object} props
 * @param {string} [props.heading] Heading of the page
 * @param {object} props.configCategories Object containing the configuration categories
 * @param {React.Component} [props.HeaderTool] Component to display in the header
 */
const ConfigPageCard = ({
	heading = "Configurations",
	configCategories,
	HeaderTool,
}) => {
	const [basePath, setBasePath] = useState("");

	// Get the base path for the current page
	useEffect(() => {
		const path = window.location.pathname;
		const pathParts = path.split("/");
		setBasePath(pathParts[pathParts.length - 1]);
	}, []);

	return (
		<>
			<PageTitle
				title={heading}
				hideBackIcon
				toolComponent={HeaderTool}
			/>

			<Flex
				direction="column"
				px={{ base: "16px", md: "initial" }}
				// mb={{ base: "16", md: "0" }}
				gap={{ base: "2", md: "8" }}
			>
				{configCategories?.map(
					({ category, description, products }) => {
						if (!products?.length) return null;

						return (
							<Flex
								key={category}
								direction="column"
								gap={{ base: "0.25", md: "2" }}
								py="2"
							>
								{/* Category heading with description-tooltip */}
								{category ? (
									<Flex align="center" gap="1">
										<Text
											fontSize={{
												base: "md",
												md: "lg",
											}}
											fontWeight="semibold"
										>
											{category}
										</Text>
										{description ? (
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
										) : null}
									</Flex>
								) : null}

								{/* List of configuration options in the category */}
								<ConfigGrid
									product_list={products}
									basePath={basePath}
								/>
							</Flex>
						);
					}
				)}
			</Flex>
		</>
	);
};

export { ConfigPageCard };
