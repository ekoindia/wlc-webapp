import { EkoConnectWidget } from "components/EkoConnectWidget";
import { useRouter } from "next/router";

/**
 * The transaction page component to render all financial transaction flows.
 * Currently, it loads the connect-wlc-widget.
 */
const TransactionPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const start_id = id && id.length > 0 ? id[0] : 0;

	return <EkoConnectWidget start_id={start_id} />;
};

export default TransactionPage;
