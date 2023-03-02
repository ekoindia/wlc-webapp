import { useRouter } from "next/router";
import { useUser } from "contexts/UserContext";
import React, { useEffect, useRef, useState } from "react";
import { Layout } from "..";
import { Button } from "@chakra-ui/react";

/**
 * A <RouteProtecter> component
 * TODO: to protect the private routes and gives access to route according to user role.
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<RouteProtecter></RouteProtecter>`
 */

const RouteProtecter = (props) => {
	const { router, children } = props; //TODO : Getting Error in _app.tsx
	const { userData } = useUser();
	const { loggedIn } = userData;
	const [authorized, setAuthorized] = useState(false);

	console.info("RouteProtecter: start");
	console.log({ loggedIn: loggedIn, authorized: authorized });

	useEffect(() => {
		console.log(router.pathname);
		// on initial load - run auth check
		authCheck(router.asPath);
		// const preventAccess = () => setAuthorized(false);

		// router.events.on("routeChangeStart", preventAccess);
		// router.events.on("routeChangeComplete", authCheck);

		// return () => {
		// 	router.events.off("routeChangeStart", preventAccess);
		// 	router.events.off("routeChangeComplete", authCheck);
		// };

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.pathname, userData]);

	function authCheck(url) {
		console.log(" protected route : authCheck - ", loggedIn, url);
		const publicLinks = ["/"];
		const path = url.split("?")[0];
		console.log("path", path);
		if (!loggedIn && !publicLinks.includes(path)) {
			console.log("Route Protector : Not logged");
			setAuthorized(false);
			router.push("/");
		} else {
			console.log("Route Protector : logged");
			setAuthorized(true);
			// if (loggedIn && redirect !== url) {
			// 	console.log("Redirect Executed");
			// 	storeUrlRef.current = url;
			// }
			// else{
			// 	console.log("Else Redirect Executed", storeUrlRef.current);
			// 	setRedirect(storeUrlRef.current);
			// }
			// if (loggedIn && redirect !== storeUrlRef) {
			// 	// 	if (router.pathname.startsWith("/admin")) {
			// 	// 		console.log("RouteProtecter: check pathname");
			// 	// 		setAuthorized(true);
			// 	console.log("Redirect Executed");
			// 	storeUrlRef(url)
			// }
			// 	else {
			// 		setAuthorized(true);
			// 	}
		}
	}

	return (
		<>
			{authorized ? (
				loggedIn ? (
					<Layout isLoggedIn={loggedIn}>{children}</Layout>
				) : (
					children
				)
			) : (
				<Button
					onClick={() => {
						router.push("/");
					}}
				>
					You dont have access to this page
				</Button>
			)}
		</>
	);
};

export default RouteProtecter;
