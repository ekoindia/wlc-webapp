import { Flex } from "@chakra-ui/react";
import { EkoConnectWidget } from "components";

interface TransactionWidgetProps {
	start_id: number;
	paths: string[];
	token: string;
}

const TransactionWidget = ({
	start_id,
	paths,
	token,
}: TransactionWidgetProps) => {
	console.log("[TransactionWidget] start_id", start_id);
	console.log("[TransactionWidget] token", token);
	console.log("[TransactionWidget] paths", paths);

	if (!token) {
		return <div>Not Authorized</div>;
	}

	return (
		<Flex>
			<EkoConnectWidget start_id={start_id} paths={paths} />
		</Flex>
	);
};

export default TransactionWidget;
