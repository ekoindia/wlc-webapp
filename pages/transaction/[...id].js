import { useMenuContext } from "contexts/MenuContext";
import { useUser } from "contexts/UserContext";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import React, { useEffect } from "react";

const Transaction = () => {
	const router = useRouter();
	const { id } = router.query;
	console.log("id::::", id);
	const start_id = id && id.length > 0 ? id[0] : 0;

	const { userData } = useUser();
	const { role_tx_list } = useMenuContext();
	console.log(">>> USER DATA:: ", userData, role_tx_list);

	// const _onTrxnBusyChanged = (e) => {
	// 	console.log(">>> _onTrxnBusyChanged:: ", e);
	// };

	useEffect(function () {
		window.Polymer = window.Polymer || {
			dom: "shadow",
			lazyRegister: true,
			useNativeCSSProperties: false,
		};
	}, []);

	// Add listeners for the custom events dispatched by the widget. On component unmount, the event listener is removed.
	useEffect(() => {
		const _onTrxnBusyChanged = (e) => {
			console.log("🎬 >>> _onTrxnBusyChanged:: ", e);
		};

		const _onOpenUrl = (e) => {
			console.log("🎬 >>> _onOpenUrl:: ", e);
		};

		const _onGotoHistory = (e) => {
			console.log("🎬 >>> _onOpenUrl:: ", e);
		};

		window.addEventListener("trxn-busy-change", _onTrxnBusyChanged);
		window.addEventListener("open-url", _onOpenUrl);
		window.addEventListener("iron-signal-goto-history", _onGotoHistory);

		return () => {
			window.removeEventListener("trxn-busy-change", _onTrxnBusyChanged);
			window.removeEventListener("open-url", _onOpenUrl);
			window.removeEventListener(
				"iron-signal-goto-history",
				_onGotoHistory
			);
		};
	}, []);

	return (
		<>
			<Head>
				<title>Transaction</title>
				<link
					rel="import"
					href="http://localhost:3000/elements/tf-eko-connect-widget/tf-wlc-widget.html"
				/>
			</Head>
			<Script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.24/webcomponents-lite.min.js" />
			{/* <Layout> */}
			<tf-wlc-widget
				role_trxn_list={JSON.stringify(role_tx_list)}
				logged_in={userData.loggedIn}
				interaction_id={start_id}
				user_id={userData.userId}
				login_id={userData.userDetails.login_id}
				language="en"
				onTrxnBusyChange={(e) => {
					console.log("🎬 TrxnBusyChange::: ", e);
				}}
				onMessage={(e) => {
					console.log("🎬 Message::: ", e);
				}}
				onIronAnnounce={(e) => {
					console.log("🎬 IronAnnounce::: ", e);
				}}
				onIronSignal={(e) => {
					console.log("🎬 IronSignal::: ", e);
				}}
			></tf-wlc-widget>
			{/* dark-theme={true} */}
			{/* </Layout> */}
		</>
	);
};

export default Transaction;
