import { Center, Image, Text } from "@chakra-ui/react";
/**
 * Show the organization Logo. If logo is not available, show the app name as logo
 * @param 	{object}	orgDetail	Organization Details, specially `logo` & `app_name`
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<OrgLogo></OrgLogo>` TODO: Fix example
 */
const OrgLogo = ({ orgDetail, size = "md", ...rest }) => {
	const logoHeight =
		size === "lg"
			? { base: "2.2rem", md: 16 }
			: {
					base: "30px",
					md: "36px",
					"2xl": "46px",
			  };
	const logoFontSize =
		size === "lg" ? { base: "xl", md: "3xl" } : { base: "lg", md: "xl" };

	if (!(orgDetail && orgDetail.logo) && orgDetail.app_name) {
		return (
			<Center
				maxW={{ base: "12rem", md: "20rem", "2xl": "30rem" }}
				// height={logoHeight}
				// bg="accent.PRIMARY"
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
	return (
		<Image
			src={
				orgDetail.logo ||
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 56'%3E%3Crect fill='%23bbb' width='200' height='56' rx='6' ry='6'/%3E%3C/svg%3E"
			}
			alt={orgDetail.app_name + " logo"}
			maxW={{ base: "10rem", md: "20rem", "2xl": "30rem" }}
			height={logoHeight}
			{...rest}
		/>
	);
};

export default OrgLogo;
