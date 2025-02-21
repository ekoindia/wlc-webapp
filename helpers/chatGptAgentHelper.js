/**
 * Returns the URL of the ChatGPT Custom Agent for the given organization and user type.
 * @param {object} props
 * @param {number} props.orgId - The organization ID
 * @param {boolean} props.isAdmin - If the user is an admin
 */
export const getChatGptAgentUrl = ({ orgId, isAdmin }) => {
	let gptAgentUrl = null;
	if (orgId === 287) {
		// 287 = Eko Kiosk (For all agents)
		gptAgentUrl = "g-6790d44389448191805b94259a16b196-eko-sbi-kiosk-helper";
	} else if (isAdmin) {
		// Other Eloka Admins...
		gptAgentUrl = "g-67b81fe9146c8191bd036d3ca423b2d4-eko-eloka-helper";
	}
	return gptAgentUrl ? `https://chatgpt.com/g/${gptAgentUrl}/` : null;
};
