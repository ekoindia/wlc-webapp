import { useUser } from "contexts/UserContext";
import { useEffect, useState } from "react";
import { Layout } from "..";

/**
 * A <RouteProtecter> component
 * TODO: to protect the private routes and gives access to route according to user role.
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<RouteProtecter></RouteProtecter>`
 */

const publicLinks = ["/"];
const roleRoutes = {
	admin: "/admin",
	agent: "/agent",
};

const RouteProtecter = (props) => {
	const { router, children } = props; //TODO : Getting Error in _app.tsx
	const { userData, loading } = useUser();
	const { loggedIn, role } = userData;
	const [authorized, setAuthorized] = useState(false);
	// const [loading, setLoading] = useState(true)

	console.log("%cRoute-Protecter: Start", "color:green");
	console.log({
		loggedIn: loggedIn,
		authorized: authorized,
		loading: loading,
	});

	useEffect(() => {
		console.log("router.pathname", router.pathname);
		// const path = router.asPath.split("?");
		const path = router.asPath;
		console.log("path", path);

		if (loggedIn && !loading) {
			if (
				publicLinks.includes(path) ||
				!path.includes(roleRoutes[role])
			) {
				router.back();
			}
			if (!authorized) {
				setAuthorized(true);
			}
			// if (path[0].includes(roleRoutes[role]){
			// 	setAuthorized(true)
			// }
			// setLoading(false)
		} else if (!loggedIn && !loading) {
			console.log("I am out");
			if (!publicLinks.includes(path)) {
				console.log("Enter in else if");
				router.push("/");
			}
			if (authorized) setAuthorized(false);
			// setLoading(false)
		}

		return () => {
			// setLoading(false);
		};
	}, [router.asPath, loading]);

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

	console.log("%cRoute-Protecter: End", "color:green");
	if (loading) return "Loading...";

	return (
		<>
			{loggedIn ? (
				<Layout isLoggedIn={true}>{children}</Layout>
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
