import { Priority } from "kbar";
import { RiChatAiLine } from "react-icons/ri";
import { getKBarAction } from ".";

/**
 * KBar plugin to generate a KBar action for opening AI Chatbot popup widget with the given query.
 * @param {object} props
 * @param {string} props.queryValue - The query value to be used in the action.
 * @param {Function} props.showAiChatBot - Function to show the AI Chatbot.
 * @returns {Array} - An array of KBar actions.
 */
export const getAiChatBotAction = ({ queryValue, showAiChatBot }) => {
	if (!(queryValue?.length > 3)) {
		return [];
	}

	return [
		getKBarAction({
			id: "aiChatBot/open",
			name: "Ask AI",
			subtitle: `Ask anything about Eloka in your language...`,
			keywords: queryValue,
			IconComp: (
				<>
					<svg width="0" height="0">
						<linearGradient
							id="bg-gradient"
							x1="100%"
							y1="100%"
							x2="0%"
							y2="0%"
						>
							<stop stopColor="#009FFF" offset="0%" />
							<stop stopColor="#ec2F4B" offset="100%" />
						</linearGradient>
					</svg>
					<RiChatAiLine
						size="100%"
						style={{ fill: "url(#bg-gradient)" }}
					/>
				</>
			),
			priority: queryValue ? -888 : Priority.HIGH,
			perform: () => {
				showAiChatBot(queryValue);
			},
		}),
	];
};
