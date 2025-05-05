import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { NavHeight } from "components/NavBar";
import { useRouter } from "next/router";
import { Icon, Tags } from "..";
/**
 * A Heading component for a page.
 * @component
 * @param 	{object}	props
 * @param 	{string}	props.title - The title
 * @param 	{string}	[props.subtitle] - The subtitle
 * @param 	{boolean}	[props.hideBackIcon] - Hide the back icon
 * @param 	{boolean}	[props.hideToolComponent] - Whether to show the component
 * @param 	{Component}	[props.toolComponent] - Show additional component on the right end of the heading row. It could be tools like a filter button.
 * @param 	{Function}	[props.onBack] - Function to call when the back icon is clicked. By default, it will call the router.back() function.
 * @param {boolean} [props.isBeta] - Whether to show the beta tag
 * @param 	{...*}	rest - Rest of the props
 * @example	`<Heading title="Welcome" />`
 */
const PageTitle = ({
	hideBackIcon = false,
	title,
	subtitle,
	toolComponent,
	hideToolComponent = false,
	onBack,
	isBeta = false,
	...rest
}) => {
	const router = useRouter();
	const goBack = () => {
		router.back();
	};

	const isSmallScreen = useBreakpointValue({ base: true, md: false });

	const isNavHidden = hideBackIcon !== true && isSmallScreen ? true : false;

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
					base: isNavHidden ? "0" : "3",
					md: isNavHidden ? "0" : "5",
				}}
				width="100%"
				px={{ base: "16px", md: "0px" }}
				justify="space-between"
				align="center"
				{...styles}
				sx={{
					"@media print": {
						display: "none !important",
					},
				}}
				{...rest}
			>
				<Flex alignItems="center" gap={{ base: "2", lg: "4" }}>
					{hideBackIcon ? null : (
						<Box onClick={onBack || goBack} cursor="pointer">
							<Icon
								name="arrow-back"
								size={{
									base: "16px",
									"2xl": "18px",
								}}
							/>
						</Box>
					)}
					<Flex direction="column" cursor="default" userSelect="none">
						<Flex direction="row" gap="2" h="100%" align="center">
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
							{isBeta ? (
								<Tags
									status="BETA"
									bg="accent.DEFAULT"
									color="white"
									borderRadius="full"
									h="14px"
									fontSize="8px"
									fontWeight="500"
									px="6px"
									border="none"
								/>
							) : null}
						</Flex>
						<Text fontSize="sm" color="gray.600">
							{subtitle}
						</Text>
					</Flex>
				</Flex>
				{toolComponent && hideToolComponent !== true
					? toolComponent
					: null}
			</Flex>
			{isNavHidden && (
				<Box
					as="nav"
					w={"full"}
					mb="10px"
					h={NavHeight}
					sx={{
						"@media print": {
							display: "none !important",
						},
					}}
				></Box>
			)}
		</>
	);
};

export default PageTitle;
