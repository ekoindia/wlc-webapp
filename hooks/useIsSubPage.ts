import { useUser } from "contexts";
import { useRouter } from "next/router";

/**
 * Determines if the current page is a subpage based on the URL structure.
 * TODO: Add a parameter: predefinedValue (bool). If not undefined, return predefinedValue
 * TODO: Use useMemo for path calculation.
 *
 * A subpage is identified if the pathname contains more than one segment
 * (e.g., `/parent/child` or `/dashboard/settings`).
 * @returns {boolean} - `true` if the current page is a subpage, otherwise `false`.
 */
const useIsSubPage = (): boolean => {
	const { pathname } = useRouter();
	const { isAdmin } = useUser();

	// TODO: return `predefinedValue`, if not undefined.

	// TODO: useMemo below...
	
	// Remove leading and trailing slashes, then split by "/"
	const pathArray = pathname.replace(/^\/|\/$/g, "").split("/");

	// If the user is an admin, treat any path with more than two segment as a subpage
	if (isAdmin) {
		return pathArray.length > 2;
	}

	// For non-admin users, determine subpage based on the path structure
	return pathArray.length > 1;
};

export default useIsSubPage;
