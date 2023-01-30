import { useRouter } from "next/router";
import { useUser } from "contexts/UserContext";
import React, { useEffect, useRef, useState } from "react";
import { Layout } from "..";

/**
 * A <RouteProtecter> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<RouteProtecter></RouteProtecter>`
 */

const RouteProtecter = (props) => {
	const { router, children } = props;
	const { loggedIn } = useUser()[0];
	const [authorized, setAuthorized] = useState(false);

	console.info("RouteProtecter: start", loggedIn);

	useEffect(() => {
		if (router.pathname.startsWith("/admin") && loggedIn) {
			console.log("RouteProtecter: check pathname");
			setAuthorized(true);
		} else {
			router.push("/");
			setAuthorized(false);
		}
	}, [router.pathname]);

	// useEffect(() => {
	// 	// on initial load - run auth check
	// 	authCheck(router.asPath);
	// 	setAuthorized(true);
	// 	// on route change start - hide page content by setting authorized to false
	// 	const hideContent = () => setAuthorized(false);
	// 	router.events.on('routeChangeStart', hideContent);
	// 	// on route change complete - run auth check
	// 	router.events.on('routeChangeComplete', authCheck)
	// 	// unsubscribe from events in useEffect return function
	// 	return () => {
	// 		router.events.off('routeChangeStart', hideContent);
	// 		router.events.off('routeChangeComplete', authCheck);
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	// function authCheck(url) {
	// 	// redirect to login page if accessing a private page and not logged in
	// 	const publicLinks = ['/', '/login'];
	// 	const path = url.split('?')[0];
	// 	if (!loggedIn && !publicLinks.includes(path)) {
	// 		setAuthorized(false);
	// 		router.push({
	// 			pathname: '/',							// '/login'
	// 			// query: { returnUrl: router.asPath }
	// 		});
	// 	} else {
	// 		setAuthorized(true);
	// 	}
	// }

	return (
		<>
			{authorized && children}
			{!loggedIn && !authorized && children}
		</>
	);
};

export default RouteProtecter;
