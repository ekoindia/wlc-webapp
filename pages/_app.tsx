import { ChakraProvider } from "@chakra-ui/react";
import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import { GetLogoProvider } from "../contexts/getLogoContext";
import { light } from "../styles/themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider, useUser } from "../contexts/UserContext";
import { Layout, RouteProtecter } from "components";

const inter = Inter({
	weight: ["400", "500", "600", "700", "800"],
	style: ["normal"],
	fallback: ["system-ui", "sans-serif"],
	subsets: ["cyrillic"],
});

export default function App({ Component, pageProps, router }: AppProps) {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
				/>
			</Head>

			<GoogleOAuthProvider clientId="476909327136-6uv46cem9eoiqs7kv7lr59r623996ba0.apps.googleusercontent.com">
				<ChakraProvider theme={light}>
					<main className={inter.className}>
						<UserProvider>
							<GetLogoProvider>
								<RouteProtecter router={router}>
									<Component {...pageProps} />
								</RouteProtecter>
							</GetLogoProvider>
						</UserProvider>
					</main>
				</ChakraProvider>
			</GoogleOAuthProvider>
		</>
	);
}
