import { useBreakpointValue } from "@chakra-ui/react";
import Image from "next/image";

const BBPS_LOGO_URL =
	"https://files.eko.co.in/docs/logos/utility/BharatConnectLogoNoBG.svg";

/**
 * BBPS Logo component for displaying the Bharat Bill Payment System logo
 * Uses a CDN placeholder that can be replaced with the actual logo URL
 * @returns {JSX.Element} BBPS logo image component
 * @example
 * ```tsx
 * <BbpsLogo />
 * ```
 */
export const BbpsLogo = (): JSX.Element => {
	const height = useBreakpointValue({ base: 32, md: 48 });

	return (
		<Image
			src={BBPS_LOGO_URL}
			alt="BBPS Logo"
			height={height}
			width={0}
			style={{
				width: "auto",
				height: `${height}px`,
				objectFit: "contain",
			}}
			priority
		/>
	);
};
