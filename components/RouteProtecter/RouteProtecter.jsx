import { Center, Spinner } from "@chakra-ui/react";
import {
	baseRoute,
	initialRoute,
	publicLinks,
	publicOnlyLinks,
	publicSections,
} from "constants";
import { useSession } from "contexts/UserContext";
import { useEffect, useState } from "react";

const isBrowser = typeof window !== "undefined";

/**
 * A <RouteProtecter> component
 * TODO: To protect the private routes and give access to route according to user role.
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.router]	Router is passed from _app.js
 * @param	{object}	[prop.children]	Children of the component
 */
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

	// Flag to check if the user is authorized to access the route
	const [authorized, setAuthorized] = useState(false);

	const role = isAdmin ? "admin" : "non-admin";

	console.log("%c[RouteProtecter] Start\n", "color:green", {
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

	/**
	 * On every route & login-status change, check if the user is authorized to access the route...
	 */
	useEffect(() => {
		const path = router.pathname; // Pathname of the route. Eg: /transaction/[id]
		const fullPath = router.asPath; // Full pathname + query params as shown in browser. Eg: /transaction/123?name=John
		let isAuthorized = authorized; // Local flag to check if the user is authorized to access the route
		const pathStart = path.split("/")[1]; // First part of the path. Eg: transaction

		console.log("%c[RouteProtecter] ROUTE UPDATED:\n", "color:green", {
			asPath: router.asPath,
			path: path,
			pathStart: pathStart,
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
			// MARK: LoggedOut
			console.log("[RouteProtecter] ::::nonLogged user::::");

			// Redirect to initial path if the route is inaccessible
			if (
				!(
					publicOnlyLinks.includes(path) ||
					publicLinks.includes(path) ||
					publicSections?.includes(pathStart)
				)
			) {
				// Add the URL-encoded original path to the redirect query parameter
				if (
					path &&
					path !== "/" &&
					path !== "/home" &&
					path !== "/admin"
				) {
					// If the user has forced-loggedout, do not store the original path for later redirection
					const forcedLogout =
						sessionStorage.getItem("inf-forced-logout");
					if (forcedLogout === "1") {
						sessionStorage.removeItem("inf-forced-logout");
						router.push("/");
						return;
					}

					// Otherwise, store the original path for later redirection after login
					router.push(`/?next=${encodeURIComponent(fullPath)}`);
				} else {
					router.push("/");
				}
				return;
			}
			//setLoading(false);
			//setAuthorized(true);
			if (authorized) setAuthorized(false);
			isAuthorized = false;
		} else if (isLoggedIn) {
			// Read the "next" query parameter to redirect the user after login
			const _next = router.query?.next;

			if (userId === "1" || isOnboarding === true) {
				// MARK: Onboarding
				console.log(
					"[RouteProtecter] ::::Onboarding::::",
					path,
					userId
				);
				if (path !== "/signup" && path !== "/redirect") {
					// Goto onboarding page if user is not on onboarding page
					router.replace("/signup");
					return;
				}
				setLoading(false);
				setAuthorized(true);
				isAuthorized = true;
			} else if (role === "admin") {
				// MARK: Admin
				console.log(
					"[RouteProtecter] ::::Logged-in as Admin::::",
					path,
					isAdminAgentMode
				);

				// Redirect to initial path if the route is inaccessible after login
				if (
					publicOnlyLinks.includes(path) ||
					!path.includes(baseRoute[role])
				) {
					// Redirect to the "next" query parameter if it exists.
					// If it does not start with the baseRoute, then redirect to the initialRoute.
					if (_next && _next.startsWith(baseRoute[role])) {
						router.replace(_next);
						return;
					}

					// Redirect to the initialRoute
					router.replace(initialRoute[role]);
					return;
				}

				// Handle Agent-View for admins...update homepage to the correct view
				if (isAdminAgentMode) {
					if (path === "/admin") {
						// Re-route Admin to Agent Home Page
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
			} else if (role === "non-admin") {
				// MARK: Non-Admin
				console.log(
					"[RouteProtecter] ::::Logged-in as nonAdmin::::",
					path
				);
				// If the current path is public-only (not for logged-in users),
				// or, if it contains "/admin", then redirect to the initial path
				if (publicOnlyLinks.includes(path) || path.includes("/admin")) {
					// Redirect to the "next" query parameter if it exists.
					if (_next) {
						router.replace(_next);
						return;
					}

					router.replace(initialRoute[role]);
					return;
				}
				setLoading(false);
				setAuthorized(true);
				isAuthorized = true;
			}
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
			!publicOnlyLinks.includes(router.pathname) &&
			!publicSections?.includes(router.pathname?.split("/")[1]) &&
			!isLoggedIn) ||
		loading
	) {
		return (
			<Center height={"100vh"}>
				<Spinner />
			</Center>
		);
	}

	console.log("%c[RouteProtecter] End", "color:green");

	return <>{children}</>;
};

export default RouteProtecter;
