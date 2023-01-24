import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { GetLogoProvider } from "../contexts/getLogoContext";
import { light } from "../styles/themes";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={light}>
			<GetLogoProvider>
				<Component {...pageProps} />
			</GetLogoProvider>
		</ChakraProvider>
	);
}
