import { Image } from "@chakra-ui/react";

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
	// CDN placeholder - replace with actual logo URL when available

	return (
		<Image
			src={BBPS_LOGO_URL}
			alt="BBPS Logo"
			height={{ base: "32px", md: "48px" }}
			width="auto"
			objectFit="contain"
			fallback={
				<div
					style={{
						height: "24px",
						width: "48px",
						backgroundColor: "#e2e8f0",
						borderRadius: "4px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: "10px",
						color: "#718096",
					}}
				>
					BBPS
				</div>
			}
		/>
	);
};
