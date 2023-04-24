import { Box, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { useLayoutContext } from "contexts/LayoutContext";
import { useRouter } from "next/router";
import { Icon } from "..";
/**
 * A <Heading> component
 * TODO: Write more description here
 * @arg 	{String}	title	Properties passed to the component
 * @arg 	{Boolean}	hasIcon	Properties passed to the component
 * @arg 	{Component}	propComp	Properties passed to the component
 * @arg 	{Function}	redirectHandler	Properties passed to the component
 * @arg 	{Function}	redirectHandler	Properties passed to the component
 * @example	`<Heading></Heading>`
 */
const Headings = ({
	hasIcon = true,
	title,
	redirectHandler,
	propComp,
	isCompVisible = true,
}) => {
	const router = useRouter();
	const redirectTo = () => {
		router.back();
	};

	const { isNavHidden, setNavHidden } = useLayoutContext();
	const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");

	if (hasIcon) {
		if (isSmallerThan768) {
			setNavHidden(true);
		} else {
			setNavHidden(false);
		}
	} else {
		setNavHidden(false);
	}

	const styles = isNavHidden && {
		h: {
			base: "56px",
			sm: "56px",
			md: "50px",
			lg: "60px",
			xl: "50px",
			"2xl": "90px",
		},
		top: "0%",
		w: "full",
		position: "fixed",
		zIndex: "99",
		as: "section",
		boxShadow: "0px 3px 10px #0000001A",
		bg: "white",
		justifyContent: "space-between",
	};

	return (
		<>
			<Flex
				my={{
					base: isNavHidden ? "0px" : "10px",
					sm: isNavHidden ? "0px" : "8px",
					md: isNavHidden ? "0px" : "12px",
					lg: "16px",
					xl: "18px",
					"2xl": "20px",
				}}
				width="100%"
				px={{ base: "16px", md: "0px" }}
				justify="space-between"
				align="center"
				{...styles}
			>
				<Box>
					<Flex alignItems="center" gap={{ base: "2", lg: "4" }}>
						{hasIcon && (
							<Box
								onClick={redirectHandler || redirectTo}
								cursor="pointer"
							>
								<Icon
									name="arrow-back"
									width={{
										base: "15px",
										sm: "16px",
										"2xl": "18px",
									}}
									height={{
										base: "15px",
										sm: "16px",
										"2xl": "18px",
									}}
								/>
							</Box>
						)}
						<Text
							fontSize={{
								base: "18px",
								sm: "18px",
								md: "20px",
								lg: "25px",
								"2xl": "30px",
							}}
							fontWeight="semibold"
						>
							{title}
						</Text>
					</Flex>
				</Box>
				{isCompVisible && propComp}
			</Flex>
			{isNavHidden && (
				<Box
					as="nav"
					w={"full"}
					h={{
						base: "56px",
						sm: "56px",
						md: "50px",
						lg: "60px",
						xl: "50px",
						"2xl": "90px",
					}}
				></Box>
			)}
		</>
	);
};

export default Headings;
