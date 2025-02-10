import { Flex } from "@chakra-ui/react";
import { Radio } from "components";
import { useState } from "react";
import { InsuranceDekhoDistributor, InsuranceDekhoRetailer } from ".";

const AGENT_TYPE = {
	RETAILERS: "0",
	DISTRIBUTOR: "2",
};

const agent_type_list = [
	{ value: AGENT_TYPE.RETAILERS, label: "Retailers" },
	{ value: AGENT_TYPE.DISTRIBUTOR, label: "Distributors" },
];

/**
 * A <InsuranceDekho> pricing configuration screen
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {string} prop.prop1 - TODO: Property description. A normal property.
 * @param {number} [prop.optionalProp2] - TODO: Property description. An optional property with default value.
 * @param {...*} rest - Rest of the props
 * @example	`<InsuranceDekho></InsuranceDekho>` TODO: Fix example
 */
const InsuranceDekho = () => {
	const [agentType, setAgentType] = useState(AGENT_TYPE.RETAILERS);

	// MARK: Main JSX
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

			{agentType === AGENT_TYPE.RETAILERS ? (
				<InsuranceDekhoRetailer />
			) : (
				<InsuranceDekhoDistributor />
			)}
		</Flex>
	);
};

export default InsuranceDekho;
