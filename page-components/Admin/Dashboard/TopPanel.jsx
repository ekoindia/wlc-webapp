import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import {
	Currency,
	IcoButton,
	Icon,
	WaffleChart,
	XScrollArrow,
} from "components";
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
	const [isAiChatBotAllowed] = useFeatureFlag("AI_CHATBOT_HOME");

	if (!isAiChatBotAllowed && !panelDataList?.length) return null;

	return (
		<XScrollArrow pos="center" mb="10px" ml="-30px" w="calc(100% + 60px)">
			<Grid
				px="30px"
				templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
				gap={{ base: "2", md: "4" }}
				whiteSpace="nowrap"
				display="flex"
				py="10px"
				// css={{
				// 	"&::-webkit-scrollbar": {
				// 		width: "0px",
				// 		height: "0px",
				// 	},
				// 	"&::-webkit-scrollbar-thumb": {
				// 		borderRadius: "0px",
				// 	},
				// }}
			>
				{/* AI Chat Bot Trigger – Ask AI */}
				<AskAiCard />

				{/* Other Panel Data Items */}
				{panelDataList
					?.filter(
						(item) =>
							item.value !== null && item.value !== undefined
					)
					.map((item) => (
						<Flex
							key={item.key}
							bg="white"
							justify="space-between"
							p="12px 18px"
							border="basic"
							borderRadius="10px"
							minW="250px" // {{ base: "200px", sm: "250px" }}
							gap="1em"
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
								{item.key === "activeOverall" ? (
									<WaffleChart
										data={[
											{
												value: item.value,
												label: "Active Users",
											},
											{
												value: item.total - item.value,
												label: "Inactive Users",
											},
										]}
										colors={["#4ECDC4", "#FF6B6B"]}
										rows={4}
										cols={8}
										size="6px"
										gap="3px"
										animationDuration="0.2s"
										animationDelay="0.02s"
									/>
								) : (
									<IcoButton
										size="md"
										color="white"
										iconName={item.icon}
										rounded={10}
										bgGradient="linear(to-b, primary.light, primary.dark)"
									/>
								)}
							</Flex>
						</Flex>
					))}
			</Grid>
		</XScrollArrow>
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
			// mb="10px"
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
