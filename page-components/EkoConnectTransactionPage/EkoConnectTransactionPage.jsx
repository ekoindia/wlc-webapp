import { Flex, Spinner, Text, useToken } from "@chakra-ui/react";
import { Button, ErrorBoundary, PaddingBox, PrintReceipt } from "components";
import { ActionIcon, useKBarReady } from "components/CommandBar";
import { TransactionIds } from "constants";
import {
	useAppSource,
	useGlobalSearch,
	useMenuContext,
	useOrgDetailContext,
	usePubSub,
	useUser,
	useWallet,
} from "contexts";
import {
	useAppLink,
	useCamera,
	useExternalResource,
	useRaiseIssue,
} from "hooks";
import useRefreshToken from "hooks/useRefreshToken";
import { useRegisterActions } from "kbar";
import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * The <EkoConnectTransactionPage> component loads the Eko Connect widget (built using Google Polmer v1 library).
 * The widget is loaded in a shadow DOM and is not affected by the host page's CSS.
 * TODO: use this component in the EkoConnectWidget page component [WIP]
 * It takes care of the following functionalities:
 * - Loading & managing the transaction flows (requests & responses).
 * - Caching transactions metadata.
 * - Theme & localization.
 * - Location capture.
 * - Toast notifications.
 * - Raise Query (ticket management).
 * @param {object} props Properties passed to the component
 * @param {string|integer} props.start_id The transaction id to load. Start of the path.
 * @param {Array<string>} props.paths The list of sub-paths to load.
 * @param {...*} rest Rest of the props passed to this component.
 * @example	`<EkoConnectTransactionPage start_id="123" route_params={{trxntypeid: 123, subpath_list: ["123"]}} />`
 */
const EkoConnectTransactionPage = ({ start_id, paths, ...rest }) => {
	console.log(
		"[EkoConnectTransactionPage] Transaction id to load: ",
		start_id,
		paths
	);

	const { openUrl, router } = useAppLink();
	const { userData, isLoggedIn, refreshUser } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions || {};
	const { balance } = useWallet();
	const { subscribe, TOPICS } = usePubSub();
	const { appSource } = useAppSource();
	const { setSearchTitle } = useGlobalSearch();

	// The current state of the transaction flow
	const [transactionFlow, setTransactionFlow] = useState({
		breadcrumb: null,
		path: null,
		latest: null,
		cardType: null, // request | response
		response: null,
	});

	// Create a reference for the Widget component
	const widgetRef = useRef(null);

	// Show the "Raise Issue" dialog
	const { showRaiseIssueDialog } = useRaiseIssue();

	// Open Camera
	const { openCamera } = useCamera();

	// Check if CommandBar is loaded...
	const { ready } = useKBarReady();

	const [widgetLoadState /*, reloadWidget */] = useExternalResource(
		process.env.NEXT_PUBLIC_CONNECT_WIDGET_URL +
			"/elements/tf-eko-connect-widget/tf-wlc-widget.html",
		"link",
		"import"
	);
	const [scriptLoadState /*, reloadScript */] = useExternalResource(
		"https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.24/webcomponents-lite.min.js",
		"script"
	);

	// Get theme values
	const [
		primary,
		primary_light,
		primary_dark,
		accent,
		accent_light,
		accent_dark,
	] = useToken("colors", [
		"primary.DEFAULT",
		"primary.light",
		"primary.dark",
		"accent.DEFAULT",
		"accent.light",
		"accent.dark",
	]);

	const theme_colors = {
		"--primary-color": primary,
		"--light-primary-color": primary_light,
		"--dark-primary-color": primary_dark,
		"--accented-text-color": primary_light,
		"--menu-selected-background-color": primary + "40",
		"--light-menu-selected-background-color": primary_light + "30",
		"--dark-menu-selected-background-color": primary_dark + "40",
		"--secondary-button-color": primary,
		"--light-secondary-button-color": primary_light,
		"--dark-secondary-button-color": primary_dark,
		"--primary-button-color": accent,
		"--accent-color": accent,
		"--light-accent-color": accent_light,
		"--bright-accent-color": accent_dark,
	};

	// Subscribe to the Android responses
	useEffect(() => {
		const unsubscribe = subscribe(TOPICS.ANDROID_RESPONSE, (data) => {
			console.log(
				"[EkoConnectTransactionPage] [PubSub] >>> android-response:: ",
				data
			);
			if (data?.action) {
				widgetRef?.current?.callFromAndroid(data.action, data.data);
			}
		});

		console.log(
			"[EkoConnectTransactionPage] >>> ORG + USER DATA:: ",
			orgDetail,
			userData,
			role_tx_list
		);

		return unsubscribe;
	}, []);

	// Setup KBar search actions related to the open transaction
	const trxnActions = useMemo(() => {
		if (!ready) {
			return [];
		}

		const start_trxn = role_tx_list[start_id];
		if (!start_trxn) {
			return [];
		}

		const isResp = transactionFlow?.cardType === "response";
		const resp = isResp ? transactionFlow?.response : null;
		const metadata = {
			breadcrumb: transactionFlow?.breadcrumb,
		};
		if (isResp) {
			metadata.transaction_detail = {
				...resp?.response,
				tx_typeid: resp?.interaction_type_id,
			};
			// metadata.parameters_formatted = resp?.response?.parameters_formatted;
			// metadata.pre_msg_ = resp?.response?.pre_msg_template || "";
		}

		return [
			{
				id: "trxnpagehlp/" + start_id,
				name: `Need help with ${start_trxn.label}?`,
				subtitle: "Submit your query and we'll get back to you.",
				icon: (
					<ActionIcon
						icon="operator"
						style="filled"
						iconSize="md"
						color="#f43f5e"
					/>
				),
				priority: 99, // Show on top
				// shortcut: ["$mod+shift+/"],
				perform: () => {
					showRaiseIssueDialog(
						{
							origin: isResp ? "Response" : "Command-Bar",
							tid: resp?.response?.data?.tid ?? -1,
							status:
								resp?.response?.data?.tx_status?.toString() ??
								"-1",
							metadata: metadata,
							customIssueType:
								isResp && resp?.response?.data?.tid
									? undefined
									: "Need help with " + start_trxn.label,
						},
						// Handle Response: Inform widget when the Raise-Issue dialog is closed with a response
						(data) =>
							data &&
							widgetRef?.current?.feedbackResponse({
								feedback_ticket_id:
									data.feedback_ticket_id || "",
								to_and_fro_data: data.context,
							})
					);
				},
			},
		];
	}, [start_id, role_tx_list, transactionFlow, ready]);

	useEffect(() => {
		const start_trxn = role_tx_list[start_id];
		if (!start_trxn) {
			return;
		}
		setSearchTitle(`Need help with ${start_trxn.label}?`);
		return () => {
			setSearchTitle("");
		};
	}, [start_id, role_tx_list]);

	useRegisterActions(trxnActions, [trxnActions]);

	// const { widgetLoading } =
	useSetupWidgetEventListeners(
		widgetRef,
		router,
		openUrl,
		refreshUser,
		setTransactionFlow,
		showRaiseIssueDialog,
		openCamera
	);

	// Handle widget load error
	if (widgetLoadState === "error" || scriptLoadState === "error") {
		return (
			<Flex
				direction="column"
				w="100%"
				p={2}
				align="center"
				justify="center"
			>
				<Text my={5} color="error" fontWeight="bold">
					Load failed. Please check your internet connection and try
					again.
				</Text>
				<Button
					onClick={() => {
						location.reload();
						// if (widgetLoadState === "error") reloadWidget();
						// if (scriptLoadState === "error") reloadScript();
					}}
				>
					Retry
				</Button>
			</Flex>
		);
	}

	// Show a spinner while the widget is loading
	if (widgetLoadState === "loading" || scriptLoadState === "loading") {
		return (
			<Flex w="100%" p={2} align="center" justify="center">
				<Spinner
					thickness="4px"
					speed="0.65s"
					emptyColor="gray.200"
					color="accent.DEFAULT"
					size="xl"
				/>
			</Flex>
		);
	}

	return (
		<PaddingBox noSpacing={true} {...rest}>
			<Head>
				<title>Transaction</title>
				{/* <link
					rel="import"
					href={
						process.env.NEXT_PUBLIC_CONNECT_WIDGET_URL +
						"/elements/tf-eko-connect-widget/tf-wlc-widget.html"
					}
				/> */}
			</Head>
			{/* <Script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.24/webcomponents-lite.min.js" /> */}

			{/* {widgetLoadState === "loading" && (
				<Flex w="100%" p={2} align="center" justify="center">
					<Spinner
						thickness="4px"
						speed="0.65s"
						emptyColor="gray.200"
						color="accent.DEFAULT"
						size="xl"
					/>
				</Flex>
			)} */}

			{/* {widgetLoadState === "error" && (
				<Flex
					direction="column"
					w="100%"
					p={2}
					align="center"
					justify="center"
				>
					<Text my={5} color="error" fontWeight="bold">
						Load failed. Please check your internet connection and
						try again.
					</Text>
					<Button onClick={() => location.reload()}>Retry</Button>
				</Flex>
			)} */}

			<ErrorBoundary ignoreError={true}>
				<PrintReceipt heading="Transaction Receipt">
					<tf-wlc-widget
						ref={widgetRef}
						interaction_id={start_id}
						route_params={JSON.stringify({
							trxntypeid: start_id,
							subpath_list: paths,
						})}
						logged_in={isLoggedIn}
						user_id={userData.userId}
						login_id={userData.userDetails.login_id}
						role_trxn_list={JSON.stringify(role_tx_list)}
						save_trxn_enabled={
							userData.userDetails.save_trxn_enabled
						}
						save_threshold_amount={
							userData.userDetails.save_threshold_amount
						}
						user_balance={balance}
						language="en"
						enable-print={true}
						user_details={JSON.stringify(userData.userDetails)}
						account_details={JSON.stringify(
							userData.accountDetails
						)}
						personal_details={JSON.stringify(
							userData.personalDetails
						)}
						shop_details={JSON.stringify(userData.shopDetails)}
						session_details={JSON.stringify(
							userData.sessionDetails
						)}
						show_set_pin={showSetPIN(
							TransactionIds.SET_PIN,
							role_tx_list,
							userData?.userDetails?.is_pin_not_set
						)}
						appsource={appSource}
						// receipt-title={
						// 	orgDetail.app_name || orgDetail.org_name || ""
						// }
						// receipt-subtitle={
						// 	orgDetail.app_name === orgDetail.org_name
						// 		? ""
						// 		: orgDetail.org_name || ""
						// }
						receipt-logo={orgDetail.logo || ""}
						analytics-partner-tracking-id={
							process.env.NEXT_PUBLIC_WIDGET_GA_ID || ""
						}
						analytics-partner-user-id={
							userData.accountDetails.code || ""
						}
						theme-colors={JSON.stringify(theme_colors)}
					></tf-wlc-widget>
					{/* dark-theme={true} autolink_params={autolinkParams} zoho_id={userData.userDetails.zoho_id} */}
				</PrintReceipt>
			</ErrorBoundary>
		</PaddingBox>
	);
};

/**
 * Add listeners for the custom events dispatched by the Connect widget.
 * @param root0
 * @param root0.setWidgetLoading
 * @param root0.generateNewToken
 * @param root0.refreshUser
 * @param root0.setBalance
 * @param root0.router
 * @param root0.openUrl
 * @param root0.setTransactionFlow
 * @param root0.showRaiseIssueDialog
 * @param root0.openCamera
 * @param root0.widgetRef
 */
const setupWidgetEventListeners = ({
	setWidgetLoading,
	generateNewToken,
	refreshUser,
	setBalance,
	router,
	openUrl,
	setTransactionFlow,
	showRaiseIssueDialog,
	openCamera,
	widgetRef,
}) => {
	/**
	 * Event called when the user session expires
	 * and the widget needs to refresh the access-token.
	 */
	const onLoginAgain = () => {
		console.log("🎬 >>> onLoginAgain");
		// Login again (refresh access-token) when the session expires
		const newTokenGenerated = generateNewToken();
		if (!newTokenGenerated) {
			// If the token re-generation fails because the token was not yet expired, try to refresh the user data.
			refreshUser();
		}
	};

	const onTrxnBusyChanged = (e) => {
		console.log("🎬 >>> onTrxnBusyChanged:: ", e);
		// TODO: Implement this function...
	};

	const onOpenUrl = (e) => {
		console.log("[EkoConnectTransactionPage] >>> onOpenUrl:: ", e);

		if (!e?.detail) {
			return;
		}

		openUrl(e.detail);
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
		console.log("[EkoConnectTransactionPage] setWalletBalance:: ", balance);

		if (balance === null || balance === undefined || balance === "") {
			return;
		}

		setBalance(balance);
	};

	const onWlcWidgetLoad = () => {
		setWidgetLoading(false);
	};

	const onEkoResponse = ({ detail }) => {
		// console.log(">>> TRACK EVENT:: onEkoResponse:: ", detail);
		const isResp = "invalid_params" in detail ? false : true;
		setTransactionFlow((prev) => ({
			...prev,
			cardType: isResp ? "response" : "request",
			response: detail,
		}));
	};

	const onFeedbackDialogEvent = ({ detail }) => {
		// console.log("[EkoConnectTransactionPage] >>> onFeedbackDialogEvent:: ", detail);
		showRaiseIssueDialog(
			detail,
			// Handle Response: Inform widget when the Raise-Issue dialog is closed with a response
			(data) =>
				data &&
				widgetRef?.current?.feedbackResponse({
					feedback_ticket_id: data.feedback_ticket_id || "",
					to_and_fro_data: data.context,
				})
		);
	};

	const onRequestCamCapture = ({ detail }) => {
		openCamera(
			detail,
			// Handle Response: Inform widget when the Camera is closed with a response
			(data) =>
				data?.image && widgetRef?.current?.cameraResponse(data.image)
		);
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
	 * @param {object} e.detail	- The event detail object
	 * @param {string} e.detail.name	- The name of the event
	 * @param e
	 */
	const onIronSignal = (e) => {
		console.log("🎬 >>> onIronSignal:: ", e?.detail);

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
			case "track-event":
				// Track Google Analytics events (from widget)
				// console.log(">>> TRACK EVENT:: ", e?.detail?.data);
				switch (e?.detail?.data?.category) {
					case "Transaction":
						if (e?.detail?.data?.action === "Page Change") {
							// Track transaction page changes
							const breadcrumb = e?.detail?.data?.label;
							if (!breadcrumb) {
								break;
							}
							const path = breadcrumb.split(" > ");
							setTransactionFlow((prev) => ({
								...prev,
								breadcrumb,
								path: path,
								latest: path.pop(),
								cardType: "request",
								response: null,
							}));
							// Note: the "response" event is handled separately by "eko-response" & "eko-network-error" events.
						}
						break;
				}
				break;

			// TODO: Add these Event listeners as well:
			// case "show-toast":
			// capture-location
			// iron-signal-profile-reloaded
			// on-iron-signal-capture-location
		}
	};

	// Use AbortController to remove the event listeners when the component is unmounted
	const controller = new AbortController();
	const { signal } = controller;

	window.addEventListener("iron-signal", onIronSignal, { signal });
	window.addEventListener("trxn-busy-change", onTrxnBusyChanged, { signal });
	window.addEventListener("open-url", onOpenUrl, { signal });
	window.addEventListener("wlc-widget-loaded", onWlcWidgetLoad, { signal });
	window.addEventListener("eko-response", onEkoResponse, { signal });
	window.addEventListener("feedback-dialog-event", onFeedbackDialogEvent, {
		signal,
	});
	window.addEventListener("request-camera-capture", onRequestCamCapture, {
		signal,
	});

	// TODO: iron-signal / show-toast
	// TODO: iron-signal / track-event
	// TODO: profile-update   		(es-interaction.html #1716)
	// TODO: ask-to-reload-connect    (es-interaction.html #3265)		// cache-busting
	// TODO: eko-response   		(es-interaction.html #4275)
	// TODO: eko-network-error   	(es-interaction.html #4419)
	/*
		this.fire('iron-signal', { name: 'track-event', data: {
				category: "Transaction",
				action: "Page Change",
				label: this.transaction_flow_breadcrumb_label
			}
		});

		// Update global profile data
		this.fire('profile-update', { section: _profile_sec, updated_profile_params: [{
				name: _profile_key,
				value: this.chain_request.chain.chain_metadata.set_profile[_key]
			}]
		});
	*/

	// Cleanup...
	return () => {
		// On component unmount, remove the event listeners by using the AbortController
		controller.abort();
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

/**
 * Custom hook to setup event listeners for the Connect widget.
 * @param {object} widgetRef - The React reference to the Connect widget component.
 * @param {object} router - The React Router instance
 * @param {Function} openUrl - The useAppLink function to open internal or external URLs.
 * @param {Function} refreshUser - Function to refresh the user profile data.
 * @param {Function} setTransactionFlow - Function to set the current transaction flow state.
 * @param {Function} showRaiseIssueDialog - Function to show the "Raise Issue" dialog.
 * @param {Function} openCamera - Function to open the camera.
 * @returns	{object} - The widgetLoading state
 */
const useSetupWidgetEventListeners = (
	widgetRef,
	router,
	openUrl,
	refreshUser,
	setTransactionFlow,
	showRaiseIssueDialog,
	openCamera
) => {
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
			refreshUser,
			setBalance,
			router,
			openUrl,
			setTransactionFlow,
			showRaiseIssueDialog,
			openCamera,
			widgetRef,
		});
		configurePolymer();

		// Cleanup...
		return cleanup;
	}, []);

	return { widgetLoading };
};

/**
 * Show nudges to Set PIN?
 * Show if:
 * 1. interaction-id to 'Set PIN' is available in current role
 * 2. this.user_details.is_pin_not_set = 1
 * @param {string} set_pin_transaction_id - The transaction-id to 'Set PIN'
 * @param role_tx_list
 * @param is_pin_not_set
 * @returns {boolean} - True if the nudge should be shown, false otherwise
 */
const showSetPIN = (set_pin_transaction_id, role_tx_list, is_pin_not_set) => {
	return set_pin_transaction_id &&
		set_pin_transaction_id in role_tx_list &&
		is_pin_not_set == 1
		? true
		: false;
};

export default EkoConnectTransactionPage;
