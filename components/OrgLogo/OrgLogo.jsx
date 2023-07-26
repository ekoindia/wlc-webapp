import { Center, Image, Text } from "@chakra-ui/react";
import { useState } from "react";

const fallbackLogo =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 56'%3E%3Crect fill='%23bbb' width='200' height='56' rx='6' ry='6'/%3E%3C/svg%3E";

/**
 * Show the organization Logo. If logo is not available, show the app name as logo
 * @param 	{object}	orgDetail	Organization Details, specially `logo` & `app_name`
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<OrgLogo></OrgLogo>` TODO: Fix example
 */
const OrgLogo = ({ orgDetail, size = "md", ...rest }) => {
	const [imageState, setImageState] = useState("loading");

	const logoHeight =
		size === "lg"
			? { base: "4.2rem", md: 16 }
			: {
					base: "30px",
					md: "36px",
					"2xl": "46px",
			  };
	const logoFontSize =
		size === "lg" ? { base: "xl", md: "3xl" } : { base: "lg", md: "xl" };

	// Text Logo...
	if (
		(!(orgDetail && orgDetail.logo) || imageState === "failed") &&
		orgDetail.app_name
	) {
		return (
			<Center
				maxW={{ base: "12rem", md: "20rem", "2xl": "30rem" }}
				// height={logoHeight}
				// bg="primary.DEFAULT"
				// px={{ base: "0.6rem", md: "1.2rem" }}
				// borderRadius="6px"
				{...rest}
			>
				<Text
					as="b"
					color="gray.800"
					noOfLines={1}
					fontSize={logoFontSize}
					fontWeight="600"
					textShadow="0px 3px 10px #29292933"
				>
					{orgDetail.app_name}
				</Text>
			</Center>
		);
	}

	// Image Logo...
	return (
		<Center h={logoHeight}>
			<Image
				src={orgDetail.logo || fallbackLogo}
				// fallbackSrc={fallbackLogo}
				alt={orgDetail.app_name + " logo"}
				maxW={{ base: "10rem", md: "20rem", "2xl": "30rem" }}
				maxH={logoHeight}
				w="auto"
				h="auto"
				sx={{
					"@media print and (max-width:5in)": {
						maxHeight: "32px",
					},
				}}
				transition="opacity 1s ease-out"
				opacity={imageState === "loaded" ? 1 : 0}
				loading="eager"
				onLoad={() => setImageState("loaded")}
				onError={() => setImageState("failed")}
				{...rest}
			/>
		</Center>
	);
};

export default OrgLogo;
