import { useRouter } from "next/router";

/**
 * Hook for handling internal links.
 */
const useAppLink = () => {
	const router = useRouter();

	const openUrl = (url) => {
		if (!url) return;

		// Remove the (sub)domain or 'https://connect.eko.in/' from internal links...
		const re = new RegExp(
			"^(" + window.location.origin + "|(https?://)?connect.eko.in)",
			"i"
		);

		url = url.trim().replace(re, "");

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
			window.open(url, "_blank");
		}
	};

	return { openUrl, router };
};

export default useAppLink;
