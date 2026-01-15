import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

/**
 *
 */
export default function Document() {
	return (
		<Html lang="en" className="customScrollbars">
			<Head>
				{/* Copy React UI context for AI Prompts in Development (Hold Ctrl/Cmd + C): https://github.com/aidenybai/react-grab */}
				{process.env.NEXT_PUBLIC_ENV === "development" ? (
					<Script
						src="//unpkg.com/react-grab/dist/index.global.js"
						crossOrigin="anonymous"
						strategy="beforeInteractive"
					/>
				) : (
					""
				)}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>

			{/* For GTM */}
			{/* {process.env.NEXT_PUBLIC_GTM_ID ? (
				<noscript
					dangerouslySetInnerHTML={{
						__html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}" height="0" width="0" style="display: none; visibility: hidden;" />`,
					}}
				/>
			) : null} */}
		</Html>
	);
}
