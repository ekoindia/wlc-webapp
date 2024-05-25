import { Center, Image, Text } from "@chakra-ui/react";
import { useState } from "react";

const fallbackLogo =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 56'%3E%3Crect fill='%23bbb' width='200' height='56' rx='6' ry='6'/%3E%3C/svg%3E";

/**
 * Show the organization Logo. If logo is not available, show the app name as logo
 * @param 	{object}	orgDetail	Organization Details, specially `logo` & `app_name`
 * @param	{string}	size	Size of the logo. `lg` for large, `md` for medium
 * @param	{boolean}	dark	Show logo on dark background
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<OrgLogo></OrgLogo>` TODO: Fix example
 */
const OrgLogo = ({ orgDetail, size = "md", dark = false, ...rest }) => {
	const [imageState, setImageState] = useState("loading");
	const [isSmallLogo, setIsSmallLogo] = useState(false); // Is it a circular/squarish logo?

	const onLoad = (success, e) => {
		if (success) {
			// Set image as loaded
			setImageState("loaded");

			// Check if the logo is small (circular/squarish)
			if (e?.target?.width) {
				if (e.target.width / e.target.height < 1.2) {
					setIsSmallLogo(true);
				}
			}
		} else {
			// Set image loading as failed
			setImageState("failed");
		}
		console.log("LOGO loaded: ", success, e);
	};

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

	// Get org-logo and replace "https://files.eko.in/" with "_files/"
	const orgLogo = (orgDetail?.logo || "").replace(
		"https://files.eko.co.in/",
		"_files/"
	);

	// Show only Text Logo...
	if ((!orgLogo || imageState === "failed") && orgDetail.app_name) {
		return (
			<Center
				maxW={{ base: "12rem", md: "20rem", "2xl": "30rem" }}
				// height={logoHeight}
				// bg="primary.DEFAULT"
				// px={{ base: "0.6rem", md: "1.2rem" }}
				// borderRadius="6px"
				{...rest}
			>
				<TextLogo
					app_name={orgDetail.app_name}
					logoFontSize={logoFontSize}
					dark={dark}
				/>
			</Center>
		);
	}

	// Image Logo...
	return (
		<Center
			h={logoHeight}
			transition="opacity 1s ease-out"
			opacity={imageState === "loaded" ? 1 : 0}
		>
			<Image
				src={orgLogo || fallbackLogo}
				// fallbackSrc={fallbackLogo}
				alt={orgDetail.app_name + " logo"}
				maxW={{
					base: "min(100%, 10rem)",
					md: "min(100%, 20rem)",
					"2xl": "min(100%, 30rem)",
				}}
				maxH={logoHeight}
				w="auto"
				h="auto"
				sx={{
					"@media print and (max-width:5in)": {
						maxHeight: "32px",
					},
				}}
				loading="eager"
				onLoad={(e) => onLoad(true, e)}
				onError={() => onLoad(false)}
				{...rest}
			/>
			{isSmallLogo &&
			(imageState === "loaded" || imageState === "failed") ? (
				<TextLogo
					app_name={orgDetail.app_name}
					logoFontSize={logoFontSize}
					dark={dark}
					color="primary.dark"
					ml={imageState === "loaded" ? 2 : 0}
				/>
			) : null}
		</Center>
	);
};

/**
 * The app-name as organization logo
 * @param {object} props
 * @param {string} props.color	Color of the text logo
 * @param {string} props.app_name	App name to show as logo
 * @param {string} props.logoFontSize	Font size of the logo
 * @param {object} restTextLogoAttrs	Rest of the props passed to this component.
 * @returns
 */
const TextLogo = ({
	app_name,
	logoFontSize,
	color = "gray.800",
	dark = false,
	...restTextLogoAttrs
}) => (
	<Text
		as="b"
		color={dark ? "white" : color}
		noOfLines={1}
		maxW={{ base: "12rem", md: "20rem", "2xl": "30rem" }}
		fontSize={logoFontSize}
		fontWeight="600"
		textShadow="0px 3px 10px #29292933"
		{...restTextLogoAttrs}
	>
		{app_name}
	</Text>
);

export default OrgLogo;
