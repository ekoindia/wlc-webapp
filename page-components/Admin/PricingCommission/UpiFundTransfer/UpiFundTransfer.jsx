import { Flex } from "@chakra-ui/react";
import { Radio } from "components";
import { useState } from "react";
import { UpiFundTransferDistributor, UpiFundTransferRetailer } from ".";

const AGENT_TYPE = {
	RETAILERS: "0",
	DISTRIBUTOR: "2",
};

const agent_type_list = [
	{ value: AGENT_TYPE.RETAILERS, label: "Retailers" },
	{ value: AGENT_TYPE.DISTRIBUTOR, label: "Distributors" },
];

/**
 * A <UpiFundTransfer> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<UpiFundTransfer></UpiFundTransfer>` TODO: Fix example
 */
const UpiFundTransfer = () => {
	const [agentType, setAgentType] = useState(AGENT_TYPE.RETAILERS);

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
				<UpiFundTransferRetailer />
			) : (
				<UpiFundTransferDistributor />
			)}
		</Flex>
	);
};

export default UpiFundTransfer;
