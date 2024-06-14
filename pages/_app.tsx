import { ChakraProvider, ToastPosition } from "@chakra-ui/react";
import { GoogleTagManager } from "@next/third-parties/google";
import { ErrorBoundary, RouteProtecter } from "components";
import { KBarLazyProvider } from "components/CommandBar";
import {
	AppSourceProvider,
	CommissionSummaryProvider,
	EarningSummaryProvider,
	GlobalSearchProvider,
	NotificationProvider,
	OrgDetailProvider,
	OrgDetailSessionStorageKey,
	PubSubProvider,
	TodoProvider,
	UserProvider,
	WalletProvider,
} from "contexts";
import { MenuProvider } from "contexts/MenuContext";
import { localStorageProvider } from "helpers";
import { fetchOrgDetails } from "helpers/fetchOrgDetailsHelper";
import { Layout } from "layout-components";
import App from "next/app";
// import { Inter } from "next/font/google";
import Head from "next/head";
import { SWRConfig } from "swr";
import { MockAdminUser, MockUser } from "__tests__/test-utils/test-utils.mocks";
import { light } from "../styles/themes";

// Variable Font
// const inter = Inter({
// 	weight: "variable",
// 	subsets: ["latin"],
// 	fallback: ["system-ui", "sans-serif"],
// });

// Configure Chakra Toast default properties
const toastDefaultOptions = {
	position: "bottom-right" as ToastPosition,
	duration: 6000,
	isClosable: true,
};

/**
 *
 * @param root0
 * @param root0.Component
 * @param root0.pageProps
 * @param root0.router
 * @param root0.org
 */
export default function InfinityApp({ Component, pageProps, router, org }) {
	console.log("[_app.tsx] Started: ", {
		org,
		is_local: typeof window === "undefined" ? false : true,
		path: router.pathname,
	});

	// Read initial data from SessionStorage (if available)
	if (typeof window !== "undefined") {
		// Fallback if org data not received from getInitialProps()
		// Fix: this may not be required as we are loading org details
		// 		from local storage within getInitialProps()
		if (!org) {
			try {
				org = JSON.parse(
					sessionStorage.getItem(OrgDetailSessionStorageKey)
				);
				console.log("[_app.tsx] loading org details from local: ", org);
			} catch (err) {
				console.error(
					"[_app.tsx] Error reading initial org data from SessionStorage: ",
					err
				);
			}
		}
	}

	// Setup custom theme...
	const colors = org?.metadata?.theme;
	const theme = colors
		? {
				...light,
				colors: {
					...light.colors,
					primary: {
						...light.colors.primary,
						light:
							colors?.primary_light || light.colors.primary.light,
						DEFAULT:
							colors?.primary || light.colors.primary.DEFAULT,
						dark: colors?.primary_dark || light.colors.primary.dark,
					},
					accent: {
						...light.colors.accent,
						light:
							colors?.accent_light || light.colors.accent.light,
						DEFAULT: colors?.accent || light.colors.accent.DEFAULT,
						dark: colors?.accent_dark || light.colors.accent.dark,
					},
				},
			}
		: {
				...light,
			};

	// Add NavBar style colors (light or default dark)...
	const lightNav = colors?.navstyle === "light";
	theme.colors = {
		...theme.colors,
		navbar: {
			...light.colors.navbar,
			bg: lightNav ? theme.colors.primary.DEFAULT : "#FFF",
			bgAlt: lightNav ? "#FFFFFF30" : "#00000020",
			text: lightNav ? "#FFFFFFEE" : "#000000DD",
			textLight: lightNav ? "#FFFFFF70" : "#00000070",
			dark: lightNav ? "#FFFFFF" : "#000000",
		},
		sidebar: {
			...light.colors.sidebar,
			bg: lightNav ? "#FFF" : theme.colors.primary.DEFAULT,
			text: lightNav ? "#333" : "#FFF",
			dark: lightNav ? "#000000" : "#FFFFFF",
			sel: lightNav
				? theme.colors.primary.DEFAULT // theme.colors.primary.DEFAULT + "40"
				: theme.colors.primary.dark, // Selection color

			divider: lightNav
				? theme.colors.primary.light + "40"
				: theme.colors.primary.light,
		},
		status: {
			...light.colors.status,
			bg: lightNav ? theme.colors.primary.DEFAULT + "30" : "#00000050",
			bgLight: lightNav ? "#FFF" : "#00000030",
			text: lightNav ? "#111" : "#FFF",
			wm: lightNav ? "#00000050" : "#FFFFFF50", // Watermark color
			wmLight: lightNav ? "#00000030" : "#FFFFFF25",
			title: lightNav ? theme.colors.primary.dark : "#FFD93B",
			borderRightColor: lightNav ? "#FFF" : "#00000050",
		},
		logo: {
			text: lightNav ? "#fff" : "primary.dark",
		},
	};

	// Setup default toast options for small screen...
	if (typeof window !== "undefined") {
		if (window.innerWidth < 768) {
			toastDefaultOptions.position = "top-right" as ToastPosition;
		}
	}

	// Mock login for local testing...
	let mockUser = null;
	if (process.env.NEXT_PUBLIC_ENV === "development") {
		if (process.env.NEXT_PUBLIC_MOCK_LOGIN === "agent") {
			mockUser = MockUser;
		} else if (process.env.NEXT_PUBLIC_MOCK_LOGIN === "admin") {
			mockUser = MockAdminUser;
		}

		console.log("[_app.tsx] !! Mock User: ", mockUser);
	}

	// Get standard or custom Layout for the page...
	// - For custom layout, define the getLayout function in the page Component (pages/<MyPage>/index.jsx). Eg: See the login page (pages/index.tsx)
	// - For hiding the top navbar on small screens, define isSubPage = true in the page Component (pages/<MyPage>/index.jsx).
	const getLayout =
		Component.getLayout ||
		((page) => (
			<Layout
				// fontClassName={inter.className}
				appName={org?.app_name}
				pageMeta={Component?.pageMeta || {}}
			>
				{page}
			</Layout>
		));

	// Is this a login page? This should help decide if features like CommandBar should be loaded.
	const isLoginPage =
		router.pathname === "/" || router.pathname === "/signup" ? true : false;

	const AppCompArray = (
		<ChakraProvider
			theme={theme}
			resetCSS={true}
			toastOptions={{ defaultOptions: toastDefaultOptions }}
		>
			<AppSourceProvider>
				<OrgDetailProvider initialData={org || null}>
					<KBarLazyProvider load={!isLoginPage}>
						<GlobalSearchProvider>
							<UserProvider userMockData={mockUser}>
								<MenuProvider>
									<WalletProvider>
										<RouteProtecter router={router}>
											<SWRConfig
												value={{
													provider:
														localStorageProvider,
												}}
											>
												<NotificationProvider>
													<EarningSummaryProvider>
														<CommissionSummaryProvider>
															<TodoProvider>
																<PubSubProvider>
																	<ErrorBoundary>
																		{getLayout(
																			<Component
																				{...pageProps}
																			/>,
																			org
																		)}
																	</ErrorBoundary>
																</PubSubProvider>
															</TodoProvider>
														</CommissionSummaryProvider>
													</EarningSummaryProvider>
												</NotificationProvider>
											</SWRConfig>
										</RouteProtecter>
									</WalletProvider>
								</MenuProvider>
							</UserProvider>
						</GlobalSearchProvider>
					</KBarLazyProvider>
				</OrgDetailProvider>
			</AppSourceProvider>
		</ChakraProvider>
	);

	// const useDefaultGoogleLogin = org?.login_types?.google?.default
	// 	? true
	// 	: false;
	// const showGoogleLogin =
	// 	useDefaultGoogleLogin || org?.login_types?.google?.client_id;
	// const AppCompArrayWithSocialLogin = showGoogleLogin && false ? (
	// 	<GoogleOAuthProvider
	// 		clientId={
	// 			useDefaultGoogleLogin
	// 				? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
	// 				: org?.login_types?.google?.client_id
	// 		}
	// 	>
	// 		{AppCompArray}
	// 	</GoogleOAuthProvider>
	// ) : (
	// 	AppCompArray
	// );

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
				/>
				<link
					rel="icon"
					type="image/png"
					href="/favicon-32x32.png"
					sizes="32x32"
				/>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link
					rel="manifest"
					href="/manifest.json"
					crossOrigin="anonymous"
				/>
			</Head>

			{/* {process.env.NEXT_PUBLIC_GTM_ID ? (
				<Script id="google-tag-manager" strategy="lazyOnload">
					{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`}
				</Script>
			) : null} */}

			{/* {AppCompArrayWithSocialLogin} */}
			{AppCompArray}

			{/* Delay-Load Google Tag Manager after the page is hydrated */}
			{process.env.NEXT_PUBLIC_GTM_ID ? (
				<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
			) : null}
		</>
	);
}

InfinityApp.getInitialProps = async function (appContext) {
	const { ctx } = appContext;
	const { res } = ctx;

	const defaultProps = App.getInitialProps(appContext);

	if (typeof window !== "undefined") {
		console.log("[_app.tsx] getInitialProps from SessionStorage.");
		return {
			...defaultProps,
			org: JSON.parse(
				window.sessionStorage.getItem(OrgDetailSessionStorageKey)
			),
		};
	}

	// Get org details (like, logo, name, etc) from server
	const org_details = await fetchOrgDetails(ctx.req.headers.host, false);

	console.log(
		"\n\n\n>>>>>>> org_details: ",
		ctx.req.headers.host,
		org_details
	);

	console.debug(
		"[_app.tsx] getInitialProps:: ",
		JSON.stringify(
			{
				host: ctx?.req?.headers?.host,
				org: org_details?.props?.data,
			},
			null,
			2
		)
	);

	if (!org_details?.props?.data) {
		console.error(
			"[_app.tsx] getInitialProps:: Org details not found. Redirecting to 404"
		);
		// TODO: Redirect to marketing landing page...
		// res.writeHead(302, { Location: "https://eko.in" });
		// res.end();
		res.statusCode = 404;
		res.end();
		return {
			err: {
				statusCode: 404,
			},
		};
	}

	return {
		...defaultProps,
		org: org_details?.props?.data,
	};
};

// TODO: Remove from production...
// export function reportWebVitals(metric) {
// 	console.log("📈 WebVitals: ", metric.name + "=" + metric.value, metric);
// }

// Console warning to show to end users...
console.info(
	"%cWARNING!\n\n%cUsing this console may allow attackers to pretend to be you and steal your information using an attack called Self-XSS.\nAvoid entering or pasting code if you're unsure about it.",
	"color:red;background:yellow;font-size:20px",
	"font-size:16px"
);
