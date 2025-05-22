import { useUser } from "contexts";
import { useRouter } from "next/router";
import { useMemo } from "react";

/**
 * Custom hook to determine whether the current route is a "subpage"
 * based on the URL structure and admin status.
 *
 * A subpage is identified based on the number of path segments:
 * - For admin users: a subpage has more than 2 segments (e.g., /admin/pricing/config)
 * - For non-admin users: a subpage has more than 1 segment (e.g., /dashboard/settings)
 * @param {boolean | undefined} predefinedValue - Optional override. If provided, this value is returned directly.
 * @returns {boolean} - Returns `true` if the current page is considered a subpage, otherwise `false`.
 */
const useIsSubPage = (predefinedValue?: boolean): boolean => {
	const { pathname } = useRouter(); // Get the current route path
	const { isAdmin } = useUser(); // Check if the current user is an admin

	// Memoize the subpage check to avoid unnecessary recalculations
	const isSubPage = useMemo(() => {
		// If a predefined value is passed, return it directly
		if (predefinedValue !== undefined) {
			return predefinedValue;
		}

		// Normalize path by removing leading/trailing slashes and splitting by "/"
		const pathArray = pathname.replace(/^\/|\/$/g, "").split("/");

		// Define minimum path length required to *not* be a subpage
		// Admin paths usually start with `/admin`, so we expect at least 3 segments
		const MinPathLength = isAdmin ? 2 : 1;

		// Return true if the current path exceeds the threshold
		return pathArray.length > MinPathLength;
	}, [pathname, isAdmin, predefinedValue]);

	return isSubPage;
};

export default useIsSubPage;
