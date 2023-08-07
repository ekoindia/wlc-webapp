import { useAppSource, usePubSub } from "contexts";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { ANDROID_ACTION, doAndroidAction } from "utils";
import { PageLoader } from "..";

/**
 * Custom (light) page layout component for the Login page
 * @param {String} appName - The name of the application. This will be displayed in the browser titlebar.
 * @param {Object} pageMeta - The page meta data.
 * @param {String} pageMeta.title - The page title. This will be displayed in the browser titlebar.
 */
const LayoutLogin = ({ appName, children }) => {
	const { publish, TOPICS } = usePubSub();
	const { isAndroid, setNativeVersion } = useAppSource();

	const [isPageLoading, setIsPageLoading] = useState(false);
	Router.events.on("routeChangeStart", () => setIsPageLoading(true));
	Router.events.on("routeChangeComplete", () => setIsPageLoading(false));
	Router.events.on("routeChangeError", () => setIsPageLoading(false));

	// Setup Android Listener...
	// TODO: Duplicate code from the default Layout component...Breakout into a separate component/hook?
	useEffect(() => {
		if (typeof window !== "undefined" && isAndroid) {
			// Android action response listener
			window["callFromAndroid"] = (action, data) => {
				console.log("[_app.tsx] callFromAndroid:: ", action, data);

				// Set the Android app version
				if (action === ANDROID_ACTION.SET_NATIVE_VERSION) {
					setNativeVersion(parseInt(data));
					return;
				} else {
					// Any other action? Publish it to the PubSub so that
					// other components can listen to it...
					publish(TOPICS.ANDROID_RESPONSE, { action, data });
				}
			};

			// Inform Android wrapper app that the page has loaded and is ready to listen to messages from Android...
			doAndroidAction(ANDROID_ACTION.WEBAPP_READY);
		}
	}, []);

	return (
		<>
			<Head>
				<title>
					Welcome
					{appName ? `  to ${appName}` : ""}
				</title>
				<link
					rel="icon"
					type="image/svg+xml"
					href="/favicon.closed.svg"
				/>
			</Head>

			{/* Show page-loading animation */}
			{isPageLoading && <PageLoader />}

			<>{children}</>
		</>
	);
};

export default LayoutLogin;
