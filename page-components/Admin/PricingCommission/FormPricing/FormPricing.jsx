import { Flex } from "@chakra-ui/react";
import { Radio } from "components";
import { useState } from "react";
import { FormSetPricingSlug } from "..";

const AGENT_TYPE = {
	RETAILERS: "0",
	DISTRIBUTOR: "2",
};

const agent_type_list = [
	{ value: AGENT_TYPE.RETAILERS, label: "Retailers" },
	{ value: AGENT_TYPE.DISTRIBUTOR, label: "Distributors" },
];

/**
 * The parent component to show pricing/commission form for Retailers and Distributors.
 * @param {*} props
 * @param {object} props.productDetails Pricing configuration for this product, such as, slabs, limits, etc.
 * @param {string} props.pricingType Pricing type for this product (pricing or commission)
 * @param {object} props.additional_payload Additional payload to be sent to the API
 * @param {object} props.additional_headers Additional headers to be sent to the API
 */
const FormPricing = ({
	productDetails,
	pricingType,
	additional_payload,
	additional_headers,
}) => {
	const [agentType, setAgentType] = useState(AGENT_TYPE.RETAILERS);

	if (!productDetails) {
		return <Text color="error">Error: Product-key not defined</Text>;
	}

	return (
		<Flex direction="column" gap="8">
			<Radio
				label="Select Agent Type"
				value={agentType}
				options={agent_type_list}
				onChange={(val) => {
					setAgentType(val);
				}}
				required={true}
			/>

			<FormSetPricingSlug
				agentType={agentType}
				productDetails={productDetails}
				pricingType={pricingType}
				additional_payload={additional_payload}
				additional_headers={additional_headers}
			/>
		</Flex>
	);
};

export default FormPricing;
