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
		<Flex m="20px" fontSize="sm" justify="space-between">
			<Flex
				direction={{ base: "column", md: "row" }}
				align={{ base: "flex-start", md: "center" }}
				gap={{ base: "2", md: "8" }}
			>
				<Text fontWeight="semibold" fontSize="2xl">
					Dashboard
				</Text>
				<Flex
					p="0.5"
					gap="4"
					h={{ base: "36px", md: "40px" }}
					bg={{ base: "divider", md: "inherit" }}
					borderRadius={{ base: "80px", md: "0px" }}
				>
					{headingList?.map((item, index) => {
						const isActive = index === pageId;
						return (
							<Flex
								key={item}
								justify="center"
								align="center"
								w={{ base: "156px", md: "120px" }}
								fontSize={{ base: "xs", md: "sm" }}
								bg={{
									base: isActive
										? "accent.DEFAULT"
										: "inherit",
									md: isActive ? "accent.DEFAULT" : "white",
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
			{/* <Flex>
					<DateView
						date="2017-01-13T16:14:24+05:30"
						format="dd-MM-yyyy"
					/>
					<span>&nbsp;-&nbsp;</span>
					<DateView
						date="2017-07-13T16:14:24+05:30"
						format="dd-MM-yyyy"
					/>
				</Flex> */}
			{/* <Flex
				align="center"
				justify="space-between"
				w={{ base: "40%", xl: "25%" }}
			>
				<Flex>Last 7 Days</Flex>
				<Flex>Last 30 Days</Flex>
				<IcoButton
					iconName="calender"
					size="md"
					bg="primary.DEFAULT"
					color="white"
				/>
			</Flex> */}
		</Flex>
	);
};

export default DashboardHeading;
