import { getChatGptAgentUrl } from "helpers";
import { ActionImpl, Priority } from "kbar";
import { RiChatAiLine } from "react-icons/ri";

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

	// console.log("getChatGptAgentAction:", queryValue);

	return [
		ActionImpl.create(
			{
				id: "chatGptAgent/search",
				name: "Ask ChatGPT",
				subtitle: `Eloka के बारे में अपनी भाषा में कुछ भी पूछें...`,
				keywords: queryValue,
				icon: <RiChatAiLine size="28px" />,
				priority: queryValue ? -888 : Priority.HIGH,
				perform: () => {
					openChatGptTab && openChatGptTab(queryValue);
				},
			},
			{}
		),
	];
};
