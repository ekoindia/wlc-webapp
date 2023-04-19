import { Center } from "@chakra-ui/react";
import { IconButtons } from "components";
const Test = () => {
	return (
		<Center h={"100vh"}>
			<IconButtons
				title="View All Transactions"
				iconName="arrow-forward"
				// iconPos="left"
				// hasBG={false}
				iconStyle={{
					width: "18px",
					height: "15px",
				}}
			/>
		</Center>
	);
};

export default Test;
