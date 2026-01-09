/**
 * Browser information parsed from user agent string
 */
interface BrowserInfo {
	name: string;
	version: string;
}

/**
 * Parse browser name and version from user agent string using simple regex patterns
 * @param {string} userAgent - The navigator.userAgent string
 * @returns {BrowserInfo} Object containing browser name and version
 */
export const parseBrowserInfo = (userAgent: string): BrowserInfo => {
	try {
		// Check for Edge (must be checked before Chrome)
		const edgeMatch = userAgent.match(/Edg\/(\d+)/);
		if (edgeMatch) {
			return { name: "Edge", version: edgeMatch[1] };
		}

		// Check for Chrome
		const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
		if (chromeMatch && !userAgent.includes("Edg")) {
			return { name: "Chrome", version: chromeMatch[1] };
		}

		// Check for Firefox
		const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
		if (firefoxMatch) {
			return { name: "Firefox", version: firefoxMatch[1] };
		}

		// Check for Safari (must be checked after Chrome as Chrome also contains Safari)
		const safariMatch = userAgent.match(/Version\/(\d+).*Safari/);
		if (safariMatch && !userAgent.includes("Chrome")) {
			return { name: "Safari", version: safariMatch[1] };
		}

		return { name: "Unknown", version: "Unknown" };
	} catch (error) {
		console.error("Error parsing browser info:", error);
		return { name: "Unknown", version: "Unknown" };
	}
};
