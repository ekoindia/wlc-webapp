import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { NavHeight } from "components/NavBar";
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

	const isSmallScreen = useBreakpointValue({ base: true, md: false });

	const isNavHidden = hasIcon && isSmallScreen ? true : false;

	const styles = isNavHidden && {
		h: NavHeight,
		top: "0%",
		w: "full",
		position: "fixed",
		zIndex: "99",
		as: "section",
		boxShadow: "0px 3px 10px #0000001A",
		bg: "white",
		color: "dark",
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
									size={{
										base: "16px",
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
				<Box as="nav" w={"full"} mb="10px" h={NavHeight}></Box>
			)}
		</>
	);
};

export default Headings;
