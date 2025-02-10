import { LayoutGateway } from "layout-components";
import { GatewayWidget } from "components";
import { useRouter } from "next/router";

const GatewayPage = () => {
	const router = useRouter();
	const { id, token } = router.query;

	if (!(id && id.length > 0)) {
		return null;
	}

	// Starting transaction-type-id
	// const start_id = parseInt(id[0]);

	return <GatewayWidget id={id} token={token} />;
};

// Custom simple layout...
GatewayPage.getLayout = LayoutGateway;

export default GatewayPage;
