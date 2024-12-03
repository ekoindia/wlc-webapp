import { useMemo } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { Headings } from "components";
import { ConfigGrid } from "../ConfigGrid";
import {
	products,
	business_config_slug_map,
	productPricingType,
} from "constants";
import { useFeatureFlag } from "hooks";
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
	const {
		product_key,
		label,
		comp,
		note,
		template,
		meta,
		is_group,
		products: group_products,
		featureFlag,
	} = business_config_slug_map[slug] ?? {};

	const [_isFeatureEnabled, checkFeatureFlag] = useFeatureFlag();

	const componentName = useMemo(() => {
		if (template && template in TemplateComponent) {
			return TemplateComponent[template];
		}
		return comp;
	}, [template, comp]);

	// Check featureFlag:  if provided and not enabled, return null
	if (featureFlag && checkFeatureFlag(featureFlag) !== true) {
		return null;
	}

	// Render the group of products
	if (is_group && products) {
		return (
			<PricingPageHeader label={label} note={note}>
				<ConfigGrid product_list={group_products} sub_page />
			</PricingPageHeader>
		);
	}

	if (!componentName) {
		console.error(
			"Component not found for product-key: ",
			slug,
			componentName,
			comp
		);

		return (
			<Text color="error">
				Error: Component not found for product-key: {slug}
			</Text>
		);
	}

	// Dynamically import the component, if available
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

	const productDetails =
		product_key && product_key in products ? products[product_key] : null;
	const productPricingTypeDetails =
		product_key && product_key in productPricingType
			? productPricingType[product_key]
			: "Commission";

	console.log("productDetails:: ", product_key, productDetails);

	return (
		<PricingPageHeader label={label} note={note}>
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
					pricingType={productPricingTypeDetails}
					{...meta}
				/>
			</Flex>
		</PricingPageHeader>
	);
};

export default PricingForm;

const PricingPageHeader = ({ label, note, children }) => {
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
				{children}
			</Flex>
		</div>
	);
};
