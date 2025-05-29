import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { Currency, IcoButton, Icon } from "components";
import { useAiChatbotPopup, useFeatureFlag } from "hooks";
import { RiChatAiLine } from "react-icons/ri";

/**
 * A TopPanel page-component
 * @component
 * @example
 * ```jsx
 * <TopPanel panelDataList={[{ key: '1', label: 'Revenue', value: 1000, type: 'amount', variation: 5, icon: 'money' }]} />
 * ```
 * @param {object} props - Component props
 * @param {Array} props.panelDataList - List of panel data objects
 * @param {string} props.panelDataList[].key - Unique key for the panel item
 * @param {string} props.panelDataList[].label - Label text for the panel item
 * @param {number|string} props.panelDataList[].value - The value to display
 * @param {string} [props.panelDataList[].type] - Type of value (e.g., "amount")
 * @param {number} [props.panelDataList[].variation] - Percentage variation (positive or negative)
 * @param {string} [props.panelDataList[].info] - Additional info text
 * @param {string} props.panelDataList[].icon - Icon name for the button
 * @returns {JSX.Element|null} The rendered component or null if no data
 */
const TopPanel = ({ panelDataList }) => {
	if (!panelDataList?.length) return null;

	return (
		<Grid
			w="100%"
			templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
			gap="4"
			overflowX="auto"
			whiteSpace="nowrap"
			display="flex"
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
			{/* AI Chat Bot Trigger – Ask AI */}
			<AskAiCard />

			{/* Other Panel Data Items */}
			{panelDataList
				?.filter(
					(item) => item.value !== null && item.value !== undefined
				)
				.map((item) => (
					<Flex
						key={item.key}
						bg="white"
						justify="space-between"
						p="12px 18px"
						border="basic"
						borderRadius="10px"
						minW={{ base: "250px", sm: "300px" }}
						mb="10px"
					>
						<Flex direction="column" gap="1">
							<Text fontSize="sm">{item.label}</Text>
							<Flex
								direction={{ base: "column", sm: "row" }}
								align={{ base: "flex-start", sm: "center" }}
								gap={{ base: "1", sm: "6" }}
							>
								<Flex
									fontWeight="semibold"
									color="primary.DEFAULT"
								>
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
							<Flex>
								{item.info ? (
									<Text
										color="primary.DEFAULT"
										fontSize="xs"
										fontWeight="500"
									>
										{item.info}
									</Text>
								) : null}
							</Flex>
						</Flex>
						<Flex align="center">
							<IcoButton
								size="md"
								color="white"
								iconName={item.icon}
								rounded={10}
								bgGradient="linear(to-b, primary.light, primary.dark)"
							/>
						</Flex>
					</Flex>
				))}
		</Grid>
	);
};

/**
 * "Ask AI" card component for the top panel of the dashboard.
 * This component displays a card/button that opens an AI chatbot when clicked.
 */
const AskAiCard = () => {
	const [isAiChatBotAllowed] = useFeatureFlag("AI_CHATBOT_HOME");
	const { showAiChatBot } = useAiChatbotPopup();

	if (!isAiChatBotAllowed) return null;

	return (
		<Flex
			position="relative"
			bg="#8752a3"
			bgGradient="linear(to left, #8e2de2, #4a00e0)"
			color="white"
			justify="space-between"
			p="12px 22px"
			border="basic"
			borderRadius="10px"
			mb="10px"
			onClick={() => showAiChatBot()}
			cursor="pointer"
		>
			<Flex direction="column" gap="1" align="center">
				<Text fontSize="sm" fontWeight="bold">
					Ask AI
				</Text>
				<Box flex="1" />
				<RiChatAiLine size="1.9em" />
				<Box flex="5" />
				<Text
					position="absolute"
					bottom="-6px"
					fontSize="8px"
					fontWeight="500"
					bg="accent.dark"
					color="white"
					p="1px 6px"
					borderRadius="full"
				>
					BETA
				</Text>
			</Flex>
		</Flex>
	);
};

export default TopPanel;
