import { Flex, Spinner } from "@chakra-ui/react";
import { PaddingBox } from "components";
import { useWallet } from "contexts";
import { useMenuContext } from "contexts/MenuContext";
import { useUser } from "contexts/UserContext";
import useRefreshToken from "hooks/useRefreshToken";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * The <EkoConnectWidget> component loads the Eko Connect widget (built using Google Polmer v1 library).
 * The widget is loaded in a shadow DOM and is not affected by the host page's CSS.
 * It takes care of the following functionalities:
 * - Loading & managing the transaction flows (requests & responses).
 * - Caching transactions metadata.
 * - Theme & localization.
 * - Location capture.
 * - Toast notifications.
 * - Raise Query (ticket management).
 * @param	{string}	start_id	The transaction id to load.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<EkoConnectWidget start_id="123" />`
 */
const EkoConnectWidget = ({ start_id, ...rest }) => {
	console.log("[EkoConnectWidget] Transaction id to load: ", start_id);

	const router = useRouter();
	const { userData } = useUser();
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions;
	console.log("[EkoConnectWidget] >>> USER DATA:: ", userData, role_tx_list);

	const { widgetLoading } = useSetupWidgetEventListeners(router);

	return (
		<PaddingBox noSpacing={true} {...rest}>
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
		</PaddingBox>
	);
};

/**
 * Add listeners for the custom events dispatched by the Connect widget.
 */
const setupWidgetEventListeners = ({
	setWidgetLoading,
	generateNewToken,
	setBalance,
	router,
}) => {
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
		// TODO: Implement this function...
	};

	const onOpenUrl = (e) => {
		console.log("🎬 >>> onOpenUrl:: ", e);

		if (!e?.detail) {
			return;
		}

		let uri = e.detail.trim();

		// Remove the (sub)domain or 'https://connect.eko.in/' from internal links...
		const re = new RegExp(
			"^(" + window.location.origin + "|(https?://)?connect.eko.in)",
			"i"
		);
		uri = uri.replace(re, "");

		if (false === /^(?:[-_a-z]+:|[a-z]+\.)/i.test(uri)) {
			// Open Internal Page (eg:  "/transaction/64")

			// Ensure '/' at beginning of URL
			uri = (uri.startsWith("/") ? "" : "/") + uri;

			// Open URL internally (same browser tab/window)
			router.push(uri);
		} else {
			// Open External Link (new browser tab/window)...
			console.log("[EkoConnectWidget] Opening External Link: ", uri);
			window.open(uri, "_blank");
		}
	};

	const onGotoTrxn = ({ trxnid }) => {
		if (!trxnid) {
			return;
		}

		// Open the transaction page
		router.push("/transaction/" + trxnid);
	};

	const onGotoHist = ({ product_id }) => {
		const filter_string = product_id ? "?product_id=" + product_id : "";

		router.push("/history" + filter_string);
	};

	const setWalletBalance = (balance) => {
		console.log("🎬 >>> setWalletBalance:: ", balance);

		if (balance === null || balance === undefined || balance === "") {
			return;
		}

		setBalance(balance);
	};

	/**
	 * Common events listener for the custom global events dispatched by the Connect widget.
	 * Supports the following events (identified by the "name" property in the event detail object):
	 * 	- update-status: Wallet balance updated,
	 * 	- track-event: Track an event in Google Analytics,
	 * 	- capture-location: Capture the user's current location.
	 * 	- login-again: Login again (refresh access-token) when the session expires.
	 * 	- goto-transaction: Open the transaction page.
	 * 	- goto-history: Open the history page.
	 * @param {Object} e.detail	- The event detail object
	 * @param {String} e.detail.name	- The name of the event
	 */
	const onIronSignal = (e) => {
		console.log("🎬 >>> onIronSignal:: ", e?.detail);
		// update-status
		// track-event
		// capture-location
		// login-again", onLoginAgain
		// goto-transaction", onGotoTrxn
		// goto-history", onGotoHist

		if (!e?.detail?.name) {
			return;
		}

		switch (e.detail.name) {
			case "update-status":
				// Update wallet balance in the header (as reported by the Connect Widget)
				if (e?.detail?.data?.balance) {
					setWalletBalance(e.detail.data.balance);
				}
				break;
			case "login-again":
				// Login again (refresh access-token) when the session expires
				onLoginAgain();
				break;
			case "goto-transaction":
				// Open the transaction page
				onGotoTrxn(e?.detail);
				break;
			case "goto-history":
				// Open the transaction page
				onGotoHist(e?.detail);
				break;
		}
	};

	const onWlcWidgetLoad = () => {
		setWidgetLoading(false);
	};

	window.addEventListener("iron-signal", onIronSignal);
	window.addEventListener("trxn-busy-change", onTrxnBusyChanged);
	window.addEventListener("open-url", onOpenUrl);
	window.addEventListener("wlc-widget-loaded", onWlcWidgetLoad);

	// TODO: Add these Event listeners as well:
	// iron-signal-profile-reloaded
	// [DONE] on-iron-signal-goto-transaction
	// [DONE] on-iron-signal-goto-history
	// on-iron-signal-capture-location

	// Cleanup...
	return () => {
		// On component unmount, remove the event listeners.
		window.removeEventListener("iron-signal", onIronSignal);
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

const useSetupWidgetEventListeners = (router) => {
	// Is connect-wlc-widget loading?
	const [widgetLoading, setWidgetLoading] = useState(true);

	// To refresh access-token when it expires
	const { generateNewToken } = useRefreshToken();

	// To update Wallet balance
	const { setBalance } = useWallet();

	useEffect(function () {
		const cleanup = setupWidgetEventListeners({
			setWidgetLoading,
			generateNewToken,
			setBalance,
			router,
		});
		configurePolymer();

		// Cleanup...
		return cleanup;
	}, []);

	return { widgetLoading };
};

export default EkoConnectWidget;
