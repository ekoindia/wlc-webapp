/**
 * Get the chat GPT agent URL.
 * @param {object} props
 * @param {number} props.orgId - The organization ID
 * @param {boolean} props.isAdmin - If the user is an admin
 */
export const getChatGptAgentUrl = ({ orgId, isAdmin }) => {
	let gptAgentUrl = null;
	if (orgId === 287) {
		// 287 = Eko Kiosk
		gptAgentUrl = "g-6790d44389448191805b94259a16b196-eko-sbi-kiosk-helper";
	} else if (isAdmin) {
		// Other Admins...
		gptAgentUrl = null;
		// gptAgentUrl = "g-6790d44389448191805b94259a16b196-eko-sbi-kiosk-helper";
	}
	return gptAgentUrl ? `https://chatgpt.com/g/${gptAgentUrl}/` : null;
};
