/**
 * Onboarding Services Contract
 *
 * Defines the external services that the onboarding module needs from the host app.
 * The host app (or any third-party app) must provide these when using `<OnboardingProvider>`.
 *
 * This is the boundary between the onboarding feature module and the consuming application.
 * Internal components read these values from `useOnboardingContext().services`.
 * @example
 * ```tsx
 * // Host app creates the services object:
 * const services: OnboardingServices = {
 *   accessToken: "your-token",
 *   generateNewToken: async () => refreshedToken,
 *   isAndroid: false,
 *   pubsub: { publish, subscribe, TOPICS },
 * };
 *
 * <OnboardingProvider services={services} {...otherProps}>
 *   <OnboardingWidget />
 * </OnboardingProvider>
 * ```
 */
export interface OnboardingServices {
	/** Auth token for API calls */
	accessToken: string;

	/** Token refresh function — called when the current token expires */
	generateNewToken: (_logout_on_failure?: boolean) => boolean;

	/** Whether the app is running inside an Android WebView (default: false) */
	isAndroid?: boolean;

	/**
	 * PubSub system for cross-component communication.
	 * Used for Pintwin key refresh and Android WebView message handling.
	 * Optional — if not provided, PubSub-dependent features will be no-ops.
	 */
	pubsub?: {
		publish: (_topic: string, _data?: any) => void;
		subscribe: (
			_topic: string,
			_callback: (_data: any) => void
		) => () => void;
		TOPICS: Record<string, string>;
	};
}
