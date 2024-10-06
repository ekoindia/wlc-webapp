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
 * @param props
 * @param props.productDetails
 */
const FormPricing = ({ productDetails }) => {
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
			/>
		</Flex>
	);
};

export default FormPricing;
