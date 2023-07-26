import { Flex, Text } from "@chakra-ui/react";

/**
 * A DashboardHeading
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DashboardHeading></DashboardHeading>`
 */
const DashboardHeading = ({ pageId, headingList, handleHeadingClick }) => {
	return (
		<Flex
			direction={{ base: "column", md: "row" }}
			align={{ base: "flex-start", md: "center" }}
			gap={{ base: "2", md: "8" }}
			w="100%"
			m="20px"
			fontSize="sm"
			justify="space-between"
		>
			<Text fontWeight="semibold" fontSize="2xl">
				Dashboard
			</Text>
			<Flex
				p="0.5"
				gap="4"
				w="100%"
				h={{ base: "36px", md: "40px" }}
				bg={{ base: "divider", md: "inherit" }}
				borderRadius={{ base: "80px", md: "0px" }}
				justify={{ base: "space-between", md: "flex-start" }}
			>
				{headingList?.map((item, index) => {
					const isActive = index === pageId;
					return (
						<Flex
							key={item}
							justify="center"
							align="center"
							w={{ base: "50%", md: "120px" }}
							fontSize={{ base: "xs", md: "sm" }}
							bg={{
								base: isActive ? "primary.DEFAULT" : "inherit",
								md: isActive ? "primary.DEFAULT" : "white",
							}}
							boxShadow={
								isActive ? "0px 3px 6px #11299E33" : null
							}
							border={{
								base: "none",
								md: !isActive ? "card" : null,
							}}
							color={isActive ? "white" : "dark"}
							borderRadius={{ base: "80px" }}
							onClick={() => handleHeadingClick(index)}
							cursor="pointer"
						>
							<span>{item}</span>
						</Flex>
					);
				})}
			</Flex>
		</Flex>
	);
};

export default DashboardHeading;
