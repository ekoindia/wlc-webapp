import { Flex, Spinner } from "@chakra-ui/react";
import { PaddingBox } from "components";
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
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions;
	console.log(">>> USER DATA:: ", userData, role_tx_list);

	const { widgetLoading } = useSetupWidgetEventListeners(router);

	return (
		<PaddingBox noSpacing={true}>
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
			console.log("Opening External Link: ", uri);
			window.open(uri, "_blank");
		}
	};

	const onGotoTrxn = (e) => {
		if (!e?.detail?.trxnid) {
			return;
		}

		// Open the transaction page
		router.push("/transaction/" + e.detail.trxnid);
	};

	const onGotoHist = (e) => {
		let filter_string = e?.detail?.product_id
			? "?product_id=" + e?.detail?.product_id
			: "";

		router.push("/history" + filter_string);
	};

	const onWlcWidgetLoad = () => {
		setWidgetLoading(false);
	};

	window.addEventListener("iron-signal-login-again", onLoginAgain);
	window.addEventListener("trxn-busy-change", onTrxnBusyChanged);
	window.addEventListener("open-url", onOpenUrl);
	window.addEventListener("iron-signal-goto-transaction", onGotoTrxn);
	window.addEventListener("iron-signal-goto-history", onGotoHist);
	window.addEventListener("wlc-widget-loaded", onWlcWidgetLoad);

	// TODO: Add these Event listeners as well:
	// iron-signal-profile-reloaded
	// [DONE] on-iron-signal-goto-transaction
	// [DONE] on-iron-signal-goto-history
	// on-iron-signal-capture-location

	// Cleanup...
	return () => {
		// On component unmount, remove the event listeners.
		window.removeEventListener("iron-signal-login-again", onLoginAgain);
		window.removeEventListener("trxn-busy-change", onTrxnBusyChanged);
		window.removeEventListener("open-url", onOpenUrl);
		window.removeEventListener("iron-signal-goto-transaction", onGotoTrxn);
		window.removeEventListener("iron-signal-goto-history", onGotoHist);
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

	useEffect(function () {
		const cleanup = setupWidgetEventListeners({
			setWidgetLoading,
			generateNewToken,
			router,
		});
		configurePolymer();

		// Cleanup...
		return cleanup;
	}, []);

	return { widgetLoading };
};

export default Transaction;
