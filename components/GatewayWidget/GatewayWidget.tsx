import { useOrgDetailContext } from "contexts";
import { useFeatureFlag } from "hooks";
import { useRouter } from "next/router";
import GatewayLayout from "./GatewayLayout";
import { GATEWAY_PRODUCT_REGISTRY } from "./GatewayProductRegistry";
import TransactionWidget from "./TransactionWidget";

interface GatewayWidgetProps {
	id: string[];
	token: string;
}

const GatewayWidget = ({ id, token }: GatewayWidgetProps) => {
	const { orgDetail } = useOrgDetailContext();
	const [isGatewayAllowed] = useFeatureFlag("ELOKA_GATEWAY");
	const router = useRouter();
	const role = (router.query.role as string) || undefined;
	const mobile = (router.query.mobile as string) || undefined;

	console.log("[Onboarding] gatewayWidget role", role);

	// router.query is empty on the first render in Next.js pages router.
	// Wait until it's hydrated so components that capture query params at
	// mount (e.g. capturedRole via useState) receive the real values.
	if (!router.isReady || !isGatewayAllowed || !id?.length) return null;

	const productKey = id[0];

	console.log("[Onboarding] productKey", productKey);

	const productConfig = GATEWAY_PRODUCT_REGISTRY[productKey];

	if (!productConfig) return null;

	// Custom Component Flow (bypass everything except layout)
	if (productConfig.type === "custom") {
		const Component = productConfig.component;
		const componentProps = {
			token,
			...(productConfig.passRole ? { role } : {}),
			...(productConfig.passMobile ? { mobile } : {}),
		};
		return (
			<GatewayLayout orgDetail={orgDetail}>
				<Component {...componentProps} />
			</GatewayLayout>
		);
	}

	// Transaction Flow
	return (
		<GatewayLayout orgDetail={orgDetail}>
			<TransactionWidget
				start_id={productConfig.startId}
				paths={[]}
				token={token}
			/>
		</GatewayLayout>
	);
};

export default GatewayWidget;
