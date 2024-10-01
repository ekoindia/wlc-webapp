import { useMemo } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { Headings } from "components";
import { products, product_slug_map } from "constants";
import dynamic from "next/dynamic";

/**
 * Map template to the component name
 */
const TemplateComponent = {
	fileupload: "FormFileUpload",
	standard: "FormPricing",
};

/**
 * A <PricingForm> component
 * @param {object} prop Properties passed to the component
 * @param {string} prop.slug URL slug to identify the product for which pricing has to be configured
 */
const PricingForm = ({ slug }) => {
	const { product_key, label, comp, note, template, meta } =
		product_slug_map[slug] ?? {};

	const componentName = useMemo(() => {
		if (template && template in TemplateComponent) {
			return TemplateComponent[template];
		}
		return comp;
	}, [template]);

	const DynamicPageComponent = dynamic(
		() =>
			import(`../${componentName}`)
				.then((_mod) => {
					return _mod[componentName];
				})
				.catch((err) => {
					console.error(
						"Error loading component: ",
						componentName,
						err
					);
					return null;
				}),
		{
			ssr: false,
		}
	);

	const productDetails = product_key ? products[product_key] : null;
	console.log("productDetails:: ", product_key, productDetails);

	return (
		<div>
			<Headings title={label} />
			<Flex direction="column" mx={{ base: "4", md: "0" }} mb="32">
				{note?.length > 0 ? (
					<Text mb="20px" fontSize={{ base: "xs", sm: "sm" }}>
						<span
							style={{
								backgroundColor: "#FFD93B",
								fontWeight: "700",
							}}
						>
							Note:
						</span>
						&nbsp; {note}
					</Text>
				) : null}
				<Flex
					direction="column"
					px={{ base: "6", md: "8" }}
					pt="6"
					pb="8"
					bg="white"
					border="card"
					boxShadow="basic"
					borderRadius="10px"
				>
					<DynamicPageComponent
						productDetails={productDetails}
						{...meta}
					/>
				</Flex>
			</Flex>
		</div>
	);
};

export default PricingForm;
