import { Flex } from "@chakra-ui/react";
import { Radio } from "components";
import { useState } from "react";
import { UpiMoneyTransferDistributor, UpiMoneyTransferRetailer } from ".";

const AGENT_TYPE = {
	RETAILERS: "0",
	DISTRIBUTOR: "2",
};

const agent_type_list = [
	{ value: AGENT_TYPE.RETAILERS, label: "Retailers" },
	{ value: AGENT_TYPE.DISTRIBUTOR, label: "Distributors" },
];

/**
 * A UpiMoneyTransfer tab page-component
 * @example	<UpiMoneyTransfer/>
 */
const UpiMoneyTransfer = () => {
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
				<UpiMoneyTransferRetailer />
			) : (
				<UpiMoneyTransferDistributor />
			)}
		</Flex>
	);
};

export default UpiMoneyTransfer;
