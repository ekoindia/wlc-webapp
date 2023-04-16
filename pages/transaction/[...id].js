import { Flex, Spinner } from "@chakra-ui/react";
import { useMenuContext } from "contexts/MenuContext";
import { useUser } from "contexts/UserContext";
import useRefreshToken from "hooks/useRefreshToken";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * The transaction page component to render all financial transaction flows.
 * Currently, it loads the connect-wlc-widget.
 */
const Transaction = () => {
	const router = useRouter();
	const { id } = router.query;
	const start_id = id && id.length > 0 ? id[0] : 0;

	console.log("Transaction id to load: ", id);

	const { userData } = useUser();
	const { role_tx_list } = useMenuContext();
	console.log(">>> USER DATA:: ", userData, role_tx_list);

	const { widgetLoading } = useSetupWidgetEventListeners();

	return (
		<>
			<Head>
				<title>Transaction</title>
				<link
					rel="import"
					href={
						process.env.NEXT_PUBLIC_CONNECT_WIDGET_URL +
						"/elements/tf-eko-connect-widget/tf-wlc-widget.html"
					}
				/>
			</Head>
			<Script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.24/webcomponents-lite.min.js" />

			{widgetLoading && (
				<Flex w="100%" p={2} align="center" justify="center">
					<Spinner
						thickness="4px"
						speed="0.65s"
						emptyColor="gray.200"
						color="primary.DEFAULT"
						size="xl"
					/>
				</Flex>
			)}

			<tf-wlc-widget
				role_trxn_list={JSON.stringify(role_tx_list)}
				logged_in={userData.loggedIn}
				interaction_id={start_id}
				user_id={userData.userId}
				login_id={userData.userDetails.login_id}
				language="en"
			></tf-wlc-widget>
			{/* dark-theme={true} */}
		</>
	);
};

/**
 * Add listeners for the custom events dispatched by the Connect widget.
 */
const setupWidgetEventListeners = ({ setWidgetLoading, generateNewToken }) => {
	/**
	 * Event called when the user session expires
	 * and the widget needs to refresh the access-token.
	 */
	const onLoginAgain = () => {
		console.log("🎬 >>> onLoginAgain");
		// Login again (refresh access-token) when the session expires
		generateNewToken();
	};

	const onTrxnBusyChanged = (e) => {
		console.log("🎬 >>> onTrxnBusyChanged:: ", e);
	};

	const onOpenUrl = (e) => {
		console.log("🎬 >>> onOpenUrl:: ", e);
	};

	const onWlcWidgetLoad = () => {
		setWidgetLoading(false);
	};

	window.addEventListener("login-again", onLoginAgain);
	window.addEventListener("trxn-busy-change", onTrxnBusyChanged);
	window.addEventListener("open-url", onOpenUrl);
	window.addEventListener("wlc-widget-loaded", onWlcWidgetLoad);

	// Cleanup...
	return () => {
		// On component unmount, remove the event listeners.
		window.removeEventListener("login-again", onLoginAgain);
		window.removeEventListener("trxn-busy-change", onTrxnBusyChanged);
		window.removeEventListener("open-url", onOpenUrl);
		window.removeEventListener("wlc-widget-loaded", onWlcWidgetLoad);
	};
};

/**
 * Configure Polymer framework for Connect widget
 */
const configurePolymer = () => {
	window.Polymer = window.Polymer || {
		dom: "shadow",
		lazyRegister: true,
		useNativeCSSProperties: false,
	};
};

const useSetupWidgetEventListeners = () => {
	// Is connect-wlc-widget loading?
	const [widgetLoading, setWidgetLoading] = useState(true);

	// To refresh access-token when it expires
	const { generateNewToken } = useRefreshToken();

	useEffect(function () {
		const cleanup = setupWidgetEventListeners({
			setWidgetLoading,
			generateNewToken,
		});
		configurePolymer();

		// Cleanup...
		return cleanup;
	}, []);

	return { widgetLoading };
};

export default Transaction;
