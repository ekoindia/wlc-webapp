import { Flex } from "@chakra-ui/react";
import { Radio } from "components";
import { useState } from "react";
import { CardPaymentDistributor, CardPaymentRetailer } from ".";

const AGENT_TYPE = {
	RETAILERS: "0",
	DISTRIBUTOR: "2",
};

const agent_type_list = [
	{ value: AGENT_TYPE.RETAILERS, label: "Retailers" },
	{ value: AGENT_TYPE.DISTRIBUTOR, label: "Distributors" },
];

/**
 * A CardPayment tab page-component
 * @example	<CardPayment/>
 */
const CardPayment = () => {
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
			/>

			{agentType === AGENT_TYPE.RETAILERS ? (
				<CardPaymentRetailer />
			) : (
				<CardPaymentDistributor />
			)}
		</Flex>
	);
};

export default CardPayment;
