import { ChakraProvider } from "@chakra-ui/react";
import { Inter } from "@next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RouteProtecter } from "components";
import { localStorageProvider } from "helpers";
import Head from "next/head";
import { SWRConfig } from "swr";
import { GetLogoProvider } from "../contexts/getLogoContext";
import { UserProvider } from "../contexts/UserContext";
import { light } from "../styles/themes";

const inter = Inter({
	weight: ["400", "500", "600", "700", "800"],
	style: ["normal"],
	fallback: ["system-ui", "sans-serif"],
	subsets: ["cyrillic"],
});

export default function App({ Component, pageProps, router }) {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
				/>
			</Head>

			<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID}>
				<ChakraProvider theme={light}>
					{/* <main className={inter.className}> */}
					<GetLogoProvider>
						<UserProvider>
							<RouteProtecter router={router}>
								<SWRConfig
									value={{ provider: localStorageProvider }}
								>
									<Component {...pageProps} />
								</SWRConfig>
							</RouteProtecter>
						</UserProvider>
					</GetLogoProvider>
					{/* </main> */}
				</ChakraProvider>
			</GoogleOAuthProvider>
		</>
	);
}
