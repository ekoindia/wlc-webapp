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

const isBrowser = () => typeof window !== "undefined";

const publicLinks = ["/"];
const roleRoutes = {
	admin: "/admin",
	agent: "/agent",
};

const RouteProtecter = (props) => {
	const { router, children } = props; //TODO : Getting Error in _app.tsx
	const { userData } = useUser();
	const { loggedIn, role } = userData;
	const [authorized, setAuthorized] = useState(false);

	console.info("RouteProtecter: start");
	console.log({ loggedIn: loggedIn, authorized: authorized });

	// if (
	// 	isBrowser() &&
	// 	userData?.loggedIn !== true &&
	// 	router?.pathname in PageRoles &&
	// 	!PageRoles[router?.pathname].includes('admin')
	// ) {
	// 	router.push({ pathname: '/'});
	// }

	useEffect(() => {
		console.log("router.pathname", router.pathname);
		const path = router.pathname.split("?")[0];
		// if (
		// 	isBrowser() &&
		// 	userData?.loggedIn !== true &&
		// 	router?.pathname in PageRoles &&
		// 	!PageRoles[router?.pathname].includes('admin')
		// ) {
		// 	router.push({ pathname: '/' });
		// }
		// else{
		// 	if (userData?.loggedIn && router?.pathname in PageRoles){
		// 		router.back()
		// 	}
		// 	if (!userData?.loggedIn){
		// 		router.push('/')
		// 	}
		// 	setAuthorized(true)

		// }

		// authCheck(router.asPath);
		// setAuthorized(true);

		if (loggedIn) {
			if (
				publicLinks.includes(path) ||
				path[0].includes(roleRoutes[role])
			) {
				router.back();
			}
			if (!authorized) {
				setAuthorized(true);
			}
			// if (path[0].includes(roleRoutes[role]){
			// 	setAuthorized(true)
			// }
		} else if (!loggedIn) {
			router.push("/");
			setAuthorized(false);
		}
	}, [router.asPath, loggedIn]);

	function authCheck(url) {
		console.log(" protected route : authCheck - ", loggedIn, url);
		const publicLinks = ["/"];
		const path = url.split("?")[0];
		console.log("path", path);
		if (!loggedIn && !publicLinks.includes(path)) {
			console.log("Route Protector : Not logged");
			setAuthorized(false);
			router.push("/");
		} else if (loggedIn && router.pathname.includes("/admin")) {
			console.log("Route Protector : logged");
			// router.push(router.pathname);
			setAuthorized(true);
		}
	}

	return (
		<>
			{authorized && loggedIn ? (
				<Layout isLoggedIn={loggedIn}>{children}</Layout>
			) : (
				children
			)}
			{/* {authorized ? (
				loggedIn ? (
					<Layout isLoggedIn={loggedIn}>{children}</Layout>
				) : (
					children
				)
			) :
				(
					<Button
						onClick={() => {
							router.push("/");
						}}
					>
						You dont have access to this page
					</Button>
				)} */}
		</>
	);
};

export default RouteProtecter;
