import { useRouter } from "next/router";

/**
 * Hook for handling internal links.
 */
const useAppLink = () => {
	const router = useRouter();
	const regRemoveConnectUrl = new RegExp(
		"^(" +
			(typeof window !== "undefined" && window?.location?.origin
				? window?.location?.origin + "|"
				: "") +
			"(https?://)?connect.eko.in|ekoconnect://)",
		"i"
	);

	const openUrl = (url) => {
		if (!url) return;

		// Remove the following from internal links:
		// - current domain
		// - or, https://connect.eko.in/	(old Connect app URL)
		// - or, ekoconnect://				(old Connect custom URL scheme)
		url = url.trim().replace(regRemoveConnectUrl, "");

		// remove HashBang, if present (used for old Polymer based Connect app)
		if (url.startsWith("/#!")) {
			url = url.substring(3);
		}

		if (false === /^(?:[-_a-z]+:|[a-z]+\.)/i.test(url)) {
			// Open Internal Page (eg:  "/transaction/64")

			// Ensure '/' at beginning of URL
			url = (url.startsWith("/") ? "" : "/") + url;
			console.log("[useAppLink] Opening Internal Link:", url);

			// Open URL internally (same browser tab/window)
			router.push(url);
		} else {
			// Open External Link (new browser tab/window)...
			console.log("[useAppLink] Opening External Link:", url);
			if (typeof window !== "undefined") {
				window.open(url, "_blank");
			}
		}
	};

	return { openUrl, router };
};

export default useAppLink;
