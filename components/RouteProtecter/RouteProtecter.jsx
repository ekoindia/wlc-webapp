import { useUser } from "contexts/UserContext";
import { useEffect, useState } from "react";
import { Layout } from "..";
import { publicLinks, baseRoute, initialRoute } from "constants";

/**
 * A <RouteProtecter> component
 * TODO: To protect the private routes and gives access to route according to user role.
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<RouteProtecter></RouteProtecter>`
 */
var freeLinks = ["/"];
const RouteProtecter = (props) => {
	const { router, children } = props; //TODO : Getting Error in _app.tsx
	const { userData, loading, setLoading } = useUser();
	const { loggedIn, role } = userData;
	const [authorized, setAuthorized] = useState(false);
	const [is404, setIs404] = useState(false);

	console.log("%cRoute-Protecter: Start\n", "color:green", {
		loggedIn: loggedIn,
		authorized: authorized,
		loading: loading,
	});

	useEffect(() => {
		const path = router.pathname;
		console.log("path", path);

		if (path === "/404") {
			console.log("Screen : 404");
			setLoading(false);
			setIs404(true);
		}
		// when the user is loggedIn and loading is false
		else if (loggedIn) {
			// This condition will redirect to initial path if the route is inaccessible after loggedIn
			if (publicLinks.includes(path) || !path.includes(baseRoute[role])) {
				router.replace(initialRoute[role]);
				return;
			}
			setLoading(false);
			setAuthorized(true);
		} else if (!loggedIn && !loading) {
			console.log("I am out");
			// This condition will redirect to initial path if the route is inaccessible
			if (!publicLinks.includes(path)) {
				console.log("Enter in else if");
				router.push("/");
				return;
			}
			if (authorized) setAuthorized(false);
		}
	}, [router.asPath, loading, loggedIn]);

	// Remove the flash of private pages when user not loggedIn or if loading true
	if (
		(router.pathname !== "/404" &&
			!freeLinks.includes(router.pathname) &&
			!loggedIn) ||
		loading
	) {
		return "loading...";
	}

	console.log("%cRoute-Protecter: End", "color:green");
	return (
		<>
			{loggedIn && !is404 && authorized ? (
				<Layout isLoggedIn={true}>{children}</Layout>
			) : (
				children
			)}
		</>
	);
};

export default RouteProtecter;
