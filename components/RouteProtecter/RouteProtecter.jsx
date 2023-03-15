import { useUser } from "contexts/UserContext";
import { useEffect, useState } from "react";
import { Layout } from "..";
import { publicLinks, roleRoutes } from "constants";

/**
 * A <RouteProtecter> component
 * TODO: to protect the private routes and gives access to route according to user role.
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<RouteProtecter></RouteProtecter>`
 */
var freeLinks = ["/"];
const RouteProtecter = (props) => {
	const { router, children } = props; //TODO : Getting Error in _app.tsx
	const { userData, loading } = useUser();
	const { loggedIn, role } = userData;
	const [authorized, setAuthorized] = useState(false);

	console.log("%cRoute-Protecter: Start", "color:green");
	console.log({
		loggedIn: loggedIn,
		authorized: authorized,
		loading: loading,
	});

	useEffect(() => {
		console.log("router.pathname", router.pathname);
		// const path = router.asPath.split("?");
		const path = router.pathname;
		console.log("path", path);

		if (path === "/404") {
			console.log("Screen : 404");
			if (authorized) setAuthorized(false);
			return;
		}
		// when the user is loggedIn and loading is false
		if (loggedIn && !loading) {
			// This condition will redirect to initial path if the route is inaccessible after loggedIn
			if (
				publicLinks.includes(path) ||
				!path.includes(roleRoutes[role])
			) {
				router.replace("/admin/my-network");
			}

			if (!authorized) {
				setAuthorized(true);
			}
		} else if (!loggedIn && !loading) {
			console.log("I am out");
			// This condition will redirect to initial path if the route is inaccessible
			if (!publicLinks.includes(path)) {
				console.log("Enter in else if");
				router.push("/");
			}
			if (authorized) setAuthorized(false);
		}
	}, [router.asPath, loading, loggedIn]);

	if (
		(router.pathname !== "/404" &&
			!freeLinks.includes(router.pathname) &&
			!loggedIn) ||
		loading
	) {
		return "loading...";
	}
	// if (loading) return "Loading...";

	console.log("%cRoute-Protecter: End", "color:green");
	return (
		<>
			{loggedIn && authorized ? (
				<Layout isLoggedIn={true}>{children}</Layout>
			) : (
				children
			)}
		</>
	);
};

export default RouteProtecter;

{
	/* {authorized ? (
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
	)} */
}
