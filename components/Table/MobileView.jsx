import { Box, Flex, Text } from "@chakra-ui/react";
import { prepareTableCell } from ".";

/**
 * A MobileView component is a part of table component, this component will handle default mobile view of the table.
 * @param	{Array}	data	TODO: Property description.
 * @param 	{Array}	renderer	Properties passed to the component
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Tr></Tr>` TODO: Fix example
 */
const MobileView = ({
	data,
	renderer,
	isLoading,
	onRowClick,
	ResponsiveCard,
}) => {
	const _hasOnClickEvent = typeof onRowClick === "function";

	const handleMobileViewCardClick = (index) => {
		if (_hasOnClickEvent) {
			onRowClick(data[index]);
		}
	};

	if (isLoading) {
		console.log("isLoading, show skeleton");
	}

	return (
		<Flex direction="column" mx="2" /* gap="4" */>
			{data?.map((item, index) =>
				ResponsiveCard !== undefined ? (
					<Box
						key={index}
						onClick={() => handleMobileViewCardClick(index)}
						cursor={_hasOnClickEvent ? "pointer" : "default"}
					>
						<ResponsiveCard {...{ item }} />
					</Box>
				) : (
					<Flex
						key={`mvc-${index}`}
						direction="column"
						borderRadius="10px"
						bg="white"
						p="20px"
						onClick={() => handleMobileViewCardClick(index)}
					>
						{renderer?.map((ele, rIndex) => (
							<Flex
								key={`${rIndex}-${ele.field}-${index}`}
								fontSize="xs"
								align="center"
								color="light"
								gap="1"
								cursor={
									_hasOnClickEvent ? "pointer" : "default"
								}
							>
								{`${ele.field}:`}
								<Text
									as="span"
									color="dark"
									fontWeight="medium"
								>
									{prepareTableCell(item, ele, index)}
								</Text>
							</Flex>
						))}
					</Flex>
				)
			)}
		</Flex>
	);
};

export default MobileView;
