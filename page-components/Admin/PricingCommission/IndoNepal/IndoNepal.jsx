import { Flex } from "@chakra-ui/react";
import { IndoNepalRetailer } from ".";

// const AGENT_TYPE = {
// 	RETAILERS: "0",
// 	DISTRIBUTOR: "2",
// };

// const agent_type_list = [
// 	{ value: AGENT_TYPE.RETAILERS, label: "Retailers" },
// 	{ value: AGENT_TYPE.DISTRIBUTOR, label: "Distributors" },
// ];

/**
 * A IndoNepal tab page-component
 * @example	<IndoNepal/>
 */
const IndoNepal = () => {
	// const [agentType, setAgentType] = useState(AGENT_TYPE.RETAILERS);

	return (
		<Flex direction="column" gap="8">
			{/* <Radio
				label="Select Agent Type"
				value={agentType}
				options={agent_type_list}
				onChange={(val) => {
					setAgentType(val);
				}}
			/>

			{agentType === AGENT_TYPE.RETAILERS ? ( */}
			<IndoNepalRetailer />
			{/* ) : (
				<IndoNepalDistributor />
			)} */}
		</Flex>
	);
};

export default IndoNepal;
