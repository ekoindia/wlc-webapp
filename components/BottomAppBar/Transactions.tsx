import { useMenuContext } from "contexts";
import ContentDrawer from "./ContentDrawer";

const Transactions = () => {
	const { trxnList: list } = useMenuContext();
	return (
		<ContentDrawer
			{...{ list, title: "Transactions", icon: "transaction" }}
		/>
	);
};

export default Transactions;
