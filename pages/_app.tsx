import { ChakraProvider, ToastPosition } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ErrorBoundary, RouteProtecter } from "components";
import { OrgDetailProvider, UserProvider, WalletProvider } from "contexts";
import { LayoutProvider } from "contexts/LayoutContext";
import { MenuProvider } from "contexts/MenuContext";
import { localStorageProvider } from "helpers";
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

export default function App({ Component, pageProps, router }) {
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

			{process.env.GTM_ID ? (
				<Script id="google-tag-manager" strategy="afterInteractive">
					{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.GTM_ID}');`}
				</Script>
			) : null}

			<GoogleOAuthProvider
				clientId={pageProps?.data?.login_types?.google?.client_id || ""}
			>
				<ChakraProvider
					theme={light}
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

// App.getInitialProps = async function({ Component, ctx }) {
// 	console.log("getInitialProps Executed");

// 	let data = {}
// 	if (typeof window === "undefined"){
// 		if (process.env.NEXT_PUBLIC_ENV === "local"){
// 			data = {
// 					"subdomainDetails": {
// 						"app_name": "EKO",
// 						"support_contacts": {
// 							"phone": "7689323333",
// 							"email": "support@absprint.com"
// 						},
// 						"org_id": 1,
// 						"logo": "https://files.eko.in/wlcorgs10000515connect.logo",
// 						"theme": {
// 							"secondary_color": "#8675656",
// 							"primary_color": "#323233"
// 						},
// 						"org_name": "EKO",
// 						"login_types": {
// 							"google": {
// 								"client_id": "476909327136-dirc650g1e8ri7de5o2anrgdg1o2s760.apps.googleusercontent.com"
// 							}
// 						}
// 					}
// 				}
// 		}
// 		else {
// 			const domain = ctx.req.headers.host.split(".");
// 			const subdomain = ctx.req.headers.host.split(".")[0];
// 			data = await fetch(`https://sore-teal-codfish-tux.cyclic.app/logos/${subdomain}`)
// 			.then((data) => data.json())
// 			.then((res) => res)
// 			.catch((e) => console.log(e));
// 		}
// 	}
// 	else{
// 		console.log("Else Executed");

// 	// 	data = sessionStorage.getItem('org_detail')
// 	// 	if (!data){
// 	// 		data = await fetch(
// 	// 	`https://sore-teal-codfish-tux.cyclic.app/logos/${subdomain}`
// 	// )
// 	// 	.then((data) => data.json())
// 	// 	.then((res) => res)
// 	// 	.catch((e) => console.log(e));
// 	// 	}
// 	// 	}

// 	}

//   return { data: data }
// }
