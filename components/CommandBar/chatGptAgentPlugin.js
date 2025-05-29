import { getChatGptAgentUrl } from "helpers";
import { Priority } from "kbar";
import { RiOpenaiLine } from "react-icons/ri";
import { getKBarAction } from ".";

/**
 * Get the ChatGPT agent action for the command bar. It opens a new tab with ChatGPT and copies the query to the clipboard so that the user can paste it there.
 * @param {*} param0
 * @returns
 */
export const getChatGptAgentAction = ({
	queryValue,
	org_id,
	isAdmin,
	// userType,
	toast,
	copy,
}) => {
	// if (!(queryValue?.length > 10)) {
	// 	return [];
	// }

	const gptAgentUrl = getChatGptAgentUrl({ orgId: org_id, isAdmin });

	if (!gptAgentUrl) {
		return [];
	}

	/**
	 * TODO: URL-encode query and open ChatGpt link with this query
	 * Currently, it just opens ChatGPT in a new tab after copying the query to clipboard so that the user can paste it there.
	 * @param query
	 */
	const openChatGptTab = (query) => {
		if (query) {
			copy(query);
			toast({
				title: "Opening ChatGPT...Just paste your query there!",
				// description: query,
				status: "info",
				position: "top",
				duration: 4000,
			});
		}

		// const queryEncoded = encodeURIComponent(query);
		setTimeout(
			() => {
				try {
					window.open(gptAgentUrl, "_blank");
				} catch (err) {
					console.error("Error opening ChatGPT:", err);
					toast({
						title: "Error opening ChatGPT",
						status: "error",
						duration: 3000,
					});
				}
			},
			query ? 4000 : 0
		);
	};

	return [
		getKBarAction({
			id: "chatGptAgent/open",
			name: "Ask ChatGPT About Eloka Features",
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
					{/* <RiChatAiLine
						size="100%"
						style={{ fill: "url(#bg-gradient)" }}
					/> */}
					<RiOpenaiLine
						size="100%"
						style={{ fill: "url(#bg-gradient)" }}
					/>
				</>
			),
			priority: queryValue ? -889 : Priority.MEDIUM,
			perform: () => {
				openChatGptTab(queryValue);
			},
		}),
	];
};
