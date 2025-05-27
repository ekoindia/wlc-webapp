import { EkoConnectWidget } from "components/EkoConnectWidget";
import { useRouter } from "next/router";

/**
 * [For Admin] The transaction page component to render all financial transaction flows.
 * Currently, it loads the connect-wlc-widget.
 */
const TransactionPage = () => {
	const router = useRouter();
	const { id } = router.query;

	if (!(id && id.length > 0)) {
		return null;
	}

	// Starting transaction-type-id
	const start_id = parseInt(id[0]);

	return <EkoConnectWidget start_id={start_id} paths={id} />;
};

TransactionPage.pageMeta = {
	title: "Transaction",
	isSubPage: false,
};

export default TransactionPage;
