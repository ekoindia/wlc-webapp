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
				role?: string;
				mobile?: string;
			}>;
			/** Pass the URL `role` query param to the component as a prop. Defaults to false. */
			passRole?: boolean;
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
		passRole: true,
		passMobile: true,
	},
};
