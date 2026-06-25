import OnboardingGateway from "features/onboarding/page-components/OnboardingGateway/OnboardingGateway";

type GatewayProductConfig =
	| {
			type: "transaction";
			startId: number;
	  }
	| {
			type: "custom";
			component: React.ComponentType<{
				token?: string;
				mobile?: string;
			}>;
			/** Pass the URL `mobile` query param to the component as a prop. Defaults to false. */
			passMobile?: boolean;
	  };

export const GATEWAY_PRODUCT_REGISTRY: Record<string, GatewayProductConfig> = {
	aeps: {
		type: "transaction",
		startId: 252,
	},
	onboarding: {
		type: "custom",
		component: OnboardingGateway,
		passMobile: true,
	},
};
