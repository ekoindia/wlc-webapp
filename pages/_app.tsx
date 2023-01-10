import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { light } from "../styles/themes";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={light}>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}
