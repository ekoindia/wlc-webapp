import { ChakraProvider } from "@chakra-ui/react";
import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import { GetLogoProvider } from "../contexts/getLogoContext";
import { light } from "../styles/themes";

const inter = Inter({
	weight: ["400", "500", "600", "700", "800"],
	style: ["normal"],
	fallback: ["system-ui", "sans-serif"],
	subsets: ["cyrillic"],
});
export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
				/>
			</Head>

			<ChakraProvider theme={light}>
				<GetLogoProvider>
					<main className={inter.className}>
						<Component {...pageProps} />
					</main>
				</GetLogoProvider>
			</ChakraProvider>
		</>
	);
}
