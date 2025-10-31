/**
 * Helper hook to provide user type labels based on org details. If not found, fallback to default labels.
 * The custom labels are stored in the org details under `metadata.user_type_labels`.
 *
 * This hook merges the default labels with the org-specific labels, allowing for customization while maintaining a consistent structure.
 * It also returns a function `getUserTypeLabel(user_type_id)` to fetch the label for a specific user type ID.
 *
 * Example configuration in org metadata:
 * {
 *   "user_type_labels": {
 *     "1": { "en": "Branch Manager" },
 *     "2": { "en": "Agent" },
 *     "3": { "en": "Independent Agent" },
 *     "4": { "en": "Field Agent" },
 *   }
 * }
 * @returns {object} - An object mapping user type IDs to their labels.
 */

import { UserTypeLabel } from "constants/UserTypes";
import { useOrgDetailContext } from "contexts";
import { useMemo } from "react";

export const useUserTypes = () => {
	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail || {};
	const userTypeLabelsFromOrg = metadata?.user_type_labels;
	const userCodeLabelsFromOrg = metadata?.user_code_labels;

	// Memoized user type labels (default labels overridden by org-specific custom labels)
	const userTypeLabels = useMemo(() => {
		// Merge default labels with org-specific labels (while picking only the 'en' field)
		const mergedLabels = { ...UserTypeLabel };
		if (userTypeLabelsFromOrg) {
			Object.keys(userTypeLabelsFromOrg).forEach((key) => {
				mergedLabels[+key] = userTypeLabelsFromOrg[key].en; // TODO: Localize (fallback to `en`)
			});
		}
		return mergedLabels;
	}, [userTypeLabelsFromOrg]);

	/**
	 * Get the label for a specific user type ID. It returns the custom label if defined, otherwise falls back to the default label. If no label is found, it returns the user type ID itself.
	 * @param {number|string} user_type_id - The user type ID.
	 * @returns {string} - The label for the user type.
	 */
	const getUserTypeLabel = (user_type_id) =>
		userTypeLabels[+user_type_id] ||
		userTypeLabels[user_type_id] ||
		user_type_id;

	/**
	 * Get the custom label for User Code based on user type ID. If no custom label is defined, it returns the default "User Code".
	 * @param {number|string} user_type_id - The user type ID.
	 * @returns {string} - The label for User Code.
	 */
	const getUserCodeLabel = (user_type_id) => {
		if (!user_type_id || !userCodeLabelsFromOrg) return "User Code";
		return (
			userCodeLabelsFromOrg[+user_type_id] ||
			userCodeLabelsFromOrg[user_type_id] ||
			"User Code"
		);
	};

	return { userTypeLabels, getUserTypeLabel, getUserCodeLabel };
};
export default useUserTypes;
