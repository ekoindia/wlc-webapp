import { Center, Spinner } from "@chakra-ui/react";
import { baseRoute, initialRoute, publicLinks } from "constants";
import { useSession } from "contexts/UserContext";
import { useEffect, useState } from "react";

/**
 * A <RouteProtecter> component
 * TODO: To protect the private routes and give access to route according to user role.
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.router]	Router is passed from _app.js
 * @param	{string}	[prop.children]	Children is also passed from _app.js
 * @example	`<RouteProtecter></RouteProtecter>`
 */

const isBrowser = typeof window !== "undefined";

const RouteProtecter = ({ router, children }) => {
	const {
		isLoggedIn,
		isAdmin,
		isAdminAgentMode,
		userId,
		isOnboarding,
		loading,
		setLoading,
	} = useSession();
	const [authorized, setAuthorized] = useState(false);

	const role = isAdmin ? "admin" : "non-admin";

	console.log("%cRoute-Protecter: Start\n", "color:green", {
		// pathname: router.pathname,
		asPath: router.asPath,
		// query: router.query,
		isLoggedIn: isLoggedIn,
		isAdmin: isAdmin,
		isAdminAgentMode: isAdminAgentMode,
		userId: userId,
		authorized: authorized,
		loading: loading,
	});

	useEffect(() => {
		const path = router.pathname;
		let isAuthorized = authorized;

		console.log("%cRoute-Protecter: ROUTE UPDATED:\n", "color:green", {
			asPath: router.asPath,
			path: path,
			isLoggedIn: isLoggedIn,
			isAdmin: isAdmin,
			userId: userId,
			authorized: authorized,
			loading: loading,
		});

		if (path === "/404") {
			setLoading(false);
			isAuthorized = false;
		}
		// when the user is isLoggedIn and loading is false
		else if (!isLoggedIn && !loading) {
			console.log("::::nonLogged user::::");
			// This condition will redirect to initial path if the route is inaccessible
			if (!publicLinks.includes(path)) {
				router.push("/");
				return;
			}
			if (authorized) setAuthorized(false);
			isAuthorized = false;
		} else if (isLoggedIn && (userId === "1" || isOnboarding === true)) {
			console.log("::::Enter in Onboarding::::", path, userId);
			if (path !== "/signup") {
				// Goto onboarding page if user is not on onboarding page
				router.replace("/signup");
				return;
			}
			setLoading(false);
			setAuthorized(true);
			isAuthorized = true;
		} else if (isLoggedIn && role === "admin") {
			console.log("::::Enter in Admin::::", path, isAdminAgentMode);
			// This condition will redirect to initial path if the route is inaccessible after isLoggedIn
			if (publicLinks.includes(path) || !path.includes(baseRoute[role])) {
				router.replace(initialRoute[role]);
				return;
			}

			// Handle Agent-View for admins...update homepage to the correct view
			if (isAdminAgentMode) {
				if (path === "/admin") {
					router.replace("/admin/home");
					return;
				}
			} else {
				if (path === "/admin/home") {
					router.replace("/admin");
					return;
				}
			}

			setLoading(false);
			setAuthorized(true);
			isAuthorized = true;
		} else if (isLoggedIn && role === "non-admin") {
			console.log("::::Enter in nonAdmin::::", path);
			// Above condition will check, publicLink contain path or path contain "/admin"
			if (publicLinks.includes(path) || path.includes("/admin")) {
				router.replace(initialRoute[role]);
				return;
			}
			setLoading(false);
			setAuthorized(true);
			isAuthorized = true;
		}

		// Cache the last route (if it is not the Login route)...
		if (isAuthorized && path !== "/") {
			localStorage.setItem(
				"inf-last-route",
				JSON.stringify({
					path: path,
					meta: router.query,
					at: Date.now(),
				})
			);
		}
	}, [router.asPath, loading, isLoggedIn, userId, role, isAdminAgentMode]);

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

	return <>{children}</>;
};

export default RouteProtecter;
