import { ChakraProvider } from "@chakra-ui/react";
import { Inter } from "@next/font/google";
import { GetLogoProvider } from "contexts/getLogoContext";
import { LayoutProvider } from "contexts/LayoutContext";
import { MenuProvider } from "contexts/MenuContext";
import Head from "next/head";
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
					<GetLogoProvider>
						<UserProvider>
							<LayoutProvider>
								<MenuProvider>
									<RouteProtecter router={router}>
										<main className={inter.className}>
											<Component {...pageProps} />
										</main>
									</RouteProtecter>
								</MenuProvider>
							</LayoutProvider>
						</UserProvider>
					</GetLogoProvider>
				</ChakraProvider>
			</GoogleOAuthProvider>
		</>
	);
}
