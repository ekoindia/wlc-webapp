import { Flex, Grid, Text } from "@chakra-ui/react";
import { Currency, IcoButton, Icon } from "components";

/**
 * A TopPanel page-component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @param prop.data
 * @param prop._data
 * @param prop.topPanelList
 * @example	`<TopPanel></TopPanel>`
 */
const TopPanel = ({ topPanelList }) => {
	if (!topPanelList?.length) return null;

	return (
		<Grid
			w="100%"
			templateColumns="repeat(4, 4fr)"
			overflowX="auto"
			css={{
				"&::-webkit-scrollbar": {
					width: "0px",
					height: "0px",
				},
				"&::-webkit-scrollbar-thumb": {
					borderRadius: "0px",
				},
			}}
		>
			{topPanelList?.map((item, index) => (
				<Flex
					key={item.key}
					bg="white"
					justify="space-between"
					p="12px 18px"
					border="basic"
					borderRadius="10px"
					minW={{ base: "250px", sm: "300px" }}
					ml={index === 0 ? "0px" : "20px"}
				>
					<Flex direction="column" gap="1">
						<Text fontSize="sm">{item.label}</Text>
						<Flex
							direction={{ base: "column", sm: "row" }}
							align={{ base: "flex-start", sm: "center" }}
							gap={{ base: "1", sm: "6" }}
						>
							<Flex fontWeight="semibold" color="primary.DEFAULT">
								{item.type === "amount" ? (
									<Currency amount={item.value} />
								) : (
									<span>{item.value}</span>
								)}
							</Flex>
							<Flex gap="1" align="center">
								{item.variation ? (
									<>
										<Icon
											name={
												item.variation > 0
													? "increase"
													: "decrease"
											}
											color={
												item.variation > 0
													? "success"
													: "error"
											}
											size="xs"
										/>
										<Flex
											fontSize="10px"
											wrap="nowrap"
											gap="1"
										>
											<Text
												color={
													item.variation > 0
														? "success"
														: "error"
												}
											>
												{item.variation}%
											</Text>
											<Text>
												{item.variation > 0
													? "Increase"
													: "Decrease"}
											</Text>
										</Flex>
									</>
								) : null}
							</Flex>
						</Flex>
					</Flex>
					<IcoButton
						size="md"
						color="white"
						iconName={item.icon}
						rounded={10}
						bgGradient="linear(to-b, primary.light, primary.dark)"
					/>
				</Flex>
			))}
		</Grid>
	);
};

export default TopPanel;
