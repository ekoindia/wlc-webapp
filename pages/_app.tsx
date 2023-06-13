import { ChakraProvider, ToastPosition } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ErrorBoundary, Layout, RouteProtecter } from "components";
import { ActionIcon } from "components/CommandBar";
import {
	CommisionSummaryProvider,
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
import { KBarProvider, Priority } from "kbar";
import App from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import { SWRConfig } from "swr";
import { MockAdminUser, MockUser } from "__tests__/test-utils/test-utils.mocks";
import { light } from "../styles/themes";

// Variable Font
const inter = Inter({
	weight: "variable",
	subsets: ["latin"],
	fallback: ["system-ui", "sans-serif"],
});

// Configure Chakra Toast default properties
const toastDefaultOptions = {
	position: "bottom-right" as ToastPosition,
	duration: 6000,
	isClosable: true,
};

export default function InfinityApp({ Component, pageProps, router, org }) {
	console.log("[_app.tsx] InfinityApp (web) Started: ", {
		org,
		is_local: typeof window === "undefined" ? false : true,
	});

	// Fallback if org data not received from getInitialProps()
	// Fix: this may not be required as we are loading org details
	// 		from local storage within getInitialProps()
	if (typeof window !== "undefined" && !org) {
		try {
			org = JSON.parse(
				sessionStorage.getItem(OrgDetailSessionStorageKey)
			);
			console.log("[_app.tsx] loading org details from local: ", org);
		} catch (err) {
			console.error("[_app.tsx] Error parsing org_detail: ", err);
		}
	}

	// Setup custom theme...
	const colors = org?.colors;
	const theme = colors
		? {
				...light,
				colors: {
					...light.colors,
					accent: {
						...light.colors.accent,
						light:
							colors?.accent_light || light.colors.accent.light,
						DEFAULT: colors?.accent || light.colors.accent.DEFAULT,
						dark: colors?.accent_dark || light.colors.accent.dark,
					},
					primary: {
						...light.colors.primary,
						light:
							colors?.primary_light || light.colors.primary.light,
						DEFAULT:
							colors?.primary || light.colors.primary.DEFAULT,
						dark: colors?.primary_dark || light.colors.primary.dark,
					},
				},
		  }
		: {
				...light,
		  };

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

	// Setup K-Bar options...
	const kbarDefaultActions = [
		{
			id: "systemsettings",
			name: "System",
			subtitle: "Clear cache or logout",
			icon: <ActionIcon icon="logout" size="sm" color="error" />,
			// shortcut: ["c"],
			// keywords: "signout quit close",
			// section: "System",
			priority: -999,
		},
		{
			id: "reloadapp",
			name: "Reload App",
			subtitle: "Reset cache and reload the app if you facing any issues",
			icon: <ActionIcon icon="reload" size="sm" color="error" />,
			shortcut: ["$mod+F5"],
			keywords: "reset cache reload",
			section: "System",
			priority: Priority.LOW,
			parent: "systemsettings",
			perform: () => {
				// Clear session storage (except org_detail)
				Object.keys(window.sessionStorage).forEach((key) => {
					if (key !== OrgDetailSessionStorageKey && key !== "todos") {
						window.sessionStorage.removeItem(key);
					}
				});

				// Reset All LocalStorage (Trxn/Menu/etc) Cache
				window.localStorage.clear();

				// Reload
				window.location.reload();
			},
		},
		{
			id: "logout",
			name: "Logout",
			icon: <ActionIcon icon="logout" size="sm" color="error" />,
			// shortcut: ["c"],
			keywords: "signout quit close",
			section: "System",
			priority: Priority.LOW,
			parent: "systemsettings",
			perform: () => (window.location.pathname = "contact"),
		},
	];

	// Get standard or custom Layout for the page...
	// - For custom layout, define the getLayout function in the page Component (pages/<MyPage>/index.jsx).
	// - For hiding the top navbar on small screens, define isSubPage = true in the page Component (pages/<MyPage>/index.jsx).
	const getLayout =
		Component.getLayout ||
		((page) => (
			<Layout
				fontClassName={inter.className}
				appName={org?.app_name}
				pageMeta={Component?.pageMeta || {}}
			>
				{page}
			</Layout>
		));

	const AppCompArray = (
		<ChakraProvider
			theme={theme}
			resetCSS={true}
			toastOptions={{ defaultOptions: toastDefaultOptions }}
		>
			<OrgDetailProvider initialData={org || null}>
				<KBarProvider
					actions={kbarDefaultActions}
					options={{
						enableHistory: false,
						disableScrollbarManagement: true,
						// callbacks: {
						// 	onOpen: () => {
						// 		console.log("[KBar] onOpen");
						// 	},
						// },
					}}
				>
					<GlobalSearchProvider>
						<UserProvider userMockData={mockUser}>
							<MenuProvider>
								<WalletProvider>
									<RouteProtecter router={router}>
										<SWRConfig
											value={{
												provider: localStorageProvider,
											}}
										>
											<NotificationProvider>
												<EarningSummaryProvider>
													<CommisionSummaryProvider>
														<TodoProvider>
															<PubSubProvider>
																<ErrorBoundary>
																	{getLayout(
																		<main
																			className={
																				inter.className
																			}
																		>
																			<Component
																				{...pageProps}
																			/>
																		</main>
																	)}
																</ErrorBoundary>
															</PubSubProvider>
														</TodoProvider>
													</CommisionSummaryProvider>
												</EarningSummaryProvider>
											</NotificationProvider>
										</SWRConfig>
									</RouteProtecter>
								</WalletProvider>
							</MenuProvider>
						</UserProvider>
					</GlobalSearchProvider>
				</KBarProvider>
			</OrgDetailProvider>
		</ChakraProvider>
	);

	const AppCompArrayWithSocialLogin = org?.login_types?.google?.client_id ? (
		<GoogleOAuthProvider
			clientId={org?.login_types?.google?.client_id || ""}
		>
			{AppCompArray}
		</GoogleOAuthProvider>
	) : (
		AppCompArray
	);

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
			</Head>

			{process.env.NEXT_PUBLIC_GTM_ID ? (
				<Script id="google-tag-manager" strategy="lazyOnload">
					{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`}
				</Script>
			) : null}

			{AppCompArrayWithSocialLogin}
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
	const org_details = await fetchOrgDetails(ctx.req.headers.host);

	console.log("\n\n\n>>>>>>> org_details: ", org_details);

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
