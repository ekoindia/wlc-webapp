import { Center, Spinner } from "@chakra-ui/react";
import { baseRoute, initialRoute, publicLinks } from "constants";
import { useSession } from "contexts/UserContext";
import { useEffect, useState } from "react";
import { Layout } from "..";

/**
 * A <RouteProtecter> component
 * TODO: To protect the private routes and give access to route according to user role.
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.router]	Router is passed from _app.js
 * @param	{string}	[prop.children]	Children is also passed from _app.js
 * @example	`<RouteProtecter></RouteProtecter>`
 */

const isBrowser = typeof window !== "undefined";

const RouteProtecter = (props) => {
	const { router, children } = props; //TODO : Getting Error in _app.tsx
	const { isLoggedIn, isAdmin, loading, setLoading } = useSession();
	const [authorized, setAuthorized] = useState(false);
	// const [is404, setIs404] = useState(false);

	const role = isAdmin ? "admin" : "non-admin";

	console.log("%cRoute-Protecter: Start\n", "color:green", {
		isLoggedIn: isLoggedIn,
		authorized: authorized,
		loading: loading,
	});

	useEffect(() => {
		const path = router.pathname;
		console.log("Path", path);

		if (path === "/404") {
			setLoading(false);
			// setIs404(true);
		}
		// when the user is isLoggedIn and loading is false
		else if (!isLoggedIn && !loading) {
			console.log("::::nonLogged user::::");
			console.log("condition 1 :", !publicLinks.includes(path));
			// This condition will redirect to initial path if the route is inaccessible
			if (!publicLinks.includes(path)) {
				console.log("Enter in nonLogged : if");
				router.push("/");
				return;
			}
			if (authorized) setAuthorized(false);
		} else if (isLoggedIn && role === "admin") {
			console.log("::::Enter in Admin::::");
			console.log("condition 1 :", !path.includes(baseRoute[role]));
			console.log("condition 2 :", publicLinks.includes(path));
			// This condition will redirect to initial path if the route is inaccessible after isLoggedIn
			if (publicLinks.includes(path) || !path.includes(baseRoute[role])) {
				console.log("Enter in admin : if");
				router.replace(initialRoute[role]);
				return;
			}
			setLoading(false);
			setAuthorized(true);
		} else if (isLoggedIn && role === "non-admin") {
			console.log("::::Enter in nonAdmin::::");
			console.log("condition 1 :", path.includes(baseRoute[role]));
			console.log("condition 2 :", publicLinks.includes(path));
			// Above condition will check, publicLink contain path or path contain "/admin"
			if (publicLinks.includes(path) || path.includes("/admin")) {
				console.log("Enter in nonAdmin : if");
				router.replace(initialRoute[role]);
				return;
			}
			setLoading(false);
			setAuthorized(true);
		}
	}, [router.asPath, loading, isLoggedIn]);

	/**
	 * Remove the flash of private pages when user is not nonLogged
	 * Show Spinner
	 */
	if (
		(isBrowser &&
			router.pathname !== "/404" &&
			!publicLinks.includes(router.pathname) &&
			!isLoggedIn) ||
		loading
	) {
		return (
			<Center height={"100vh"}>
				<Spinner />
			</Center>
		);
	}

	console.log("%cRoute-Protecter: End", "color:green");
	return (
		<>
			{isLoggedIn && authorized ? (
				<Layout isLoggedIn={true}>{children}</Layout>
			) : (
				children
			)}
		</>
	);
};

export default RouteProtecter;
