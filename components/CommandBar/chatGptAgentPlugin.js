import { ActionImpl, Priority } from "kbar";
import { RiChatAiLine } from "react-icons/ri";

export const getChatGptAgentAction = ({
	queryValue,
	org_id,
	// userType,
	toast,
	copy,
}) => {
	// if (!(queryValue?.length > 10)) {
	// 	return [];
	// }

	let gptAgentUrl = null;
	if (org_id === 287) {
		// Eko Kiosk
		gptAgentUrl = "g-6790d44389448191805b94259a16b196-eko-sbi-kiosk-helper";
	}

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
				description: query,
				status: "info",
				position: "top",
				duration: 4000,
			});
		}

		// const queryEncoded = encodeURIComponent(query);
		setTimeout(
			() => {
				try {
					window.open(
						`https://chatgpt.com/g/g-6790d44389448191805b94259a16b196-eko-sbi-kiosk-helper/`,
						"_blank"
					);
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
