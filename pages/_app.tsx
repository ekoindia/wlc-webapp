import { ChakraProvider, ToastPosition } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ErrorBoundary, RouteProtecter } from "components";
import { OrgDetailProvider, UserProvider, WalletProvider } from "contexts";
import { LayoutProvider } from "contexts/LayoutContext";
import { MenuProvider } from "contexts/MenuContext";
import { localStorageProvider } from "helpers";
import { fetchOrgDetails } from "helpers/fetchOrgDetailsHelper";
import App from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import { SWRConfig } from "swr";

import { light } from "../styles/themes";

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

export default function WlcApp({ Component, pageProps, router, org }) {
	// if (colors) {
	// 	sessionStorage.setItem("colors", JSON.stringify(colors));
	// } else {
	// 	colors = JSON.parse(sessionStorage.getItem("colors"));
	// }

	console.log(">>>>>>>>>> ############## ", {
		org,
		is_local: typeof window === "undefined" ? false : true,
	});

	if (typeof window !== "undefined" && !org) {
		try {
			org = JSON.parse(sessionStorage.getItem("org_detail"));
			console.log(">>>>>>>>>>>> ##### _app.js from local 2: ", org);
		} catch (err) {
			console.error("Error parsing org_detail: ", err);
		}
	}

	const colors = org?.colors;

	const theme = {
		...light,
		colors: {
			...light.colors,
			accent: {
				...light.colors.accent,
				light: colors?.accent_light || light.colors.accent.light,
				DEFAULT: colors?.accent || light.colors.accent.DEFAULT,
				dark: colors?.accent_dark || light.colors.accent.dark,
			},
			primary: {
				...light.colors.primary,
				light: colors?.primary_light || light.colors.primary.light,
				DEFAULT: colors?.primary || light.colors.primary.DEFAULT,
				dark: colors?.primary_dark || light.colors.primary.dark,
			},
		},
	};

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

			<GoogleOAuthProvider
				clientId={pageProps?.data?.login_types?.google?.client_id || ""}
			>
				<ChakraProvider
					theme={theme}
					toastOptions={{ defaultOptions: toastDefaultOptions }}
				>
					<OrgDetailProvider orgMockData={null}>
						<UserProvider userMockData={null}>
							<LayoutProvider>
								<MenuProvider>
									<WalletProvider>
										<RouteProtecter router={router}>
											<SWRConfig
												value={{
													provider:
														localStorageProvider,
												}}
											>
												<ErrorBoundary>
													<main
														className={
															inter.className
														}
													>
														<Component
															{...pageProps}
														/>
													</main>
												</ErrorBoundary>
											</SWRConfig>
										</RouteProtecter>
									</WalletProvider>
								</MenuProvider>
							</LayoutProvider>
						</UserProvider>
					</OrgDetailProvider>
				</ChakraProvider>
			</GoogleOAuthProvider>
		</>
	);
}

WlcApp.getInitialProps = async function (appContext) {
	const { ctx } = appContext;

	const defaultProps = App.getInitialProps(appContext);

	console.log("!!!!!!#####");

	if (typeof window !== "undefined") {
		console.log("!!!!! ##### getInitialProps from local.");

		return {
			...defaultProps,
			org: JSON.parse(window.sessionStorage.getItem("org_detail")),
		};
	}

	console.log("getInitialProps Executed:: ", ctx.req.headers.host);

	// Get org details (like, logo, name, etc) from server
	const org_details = await fetchOrgDetails(ctx.req.headers.host);

	return {
		...defaultProps,
		org: org_details.props.data,
	};
};
