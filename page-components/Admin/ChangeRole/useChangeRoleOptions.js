import { UserType } from "constants/UserTypes";
import { useUserTypes } from "hooks/useUserTypes";
import { useMemo } from "react";

/**
 * Hook that provides Change Role tab options with dynamic user type labels.
 * Labels are resolved from org-specific overrides via `useUserTypes()`.
 * @returns {{ ORG_VIEW_TABS: Array, AGENT_VIEW_TABS: Array }}
 */
const useChangeRoleOptions = () => {
	const { getUserTypeLabel } = useUserTypes();

	const ORG_VIEW_TABS = useMemo(
		() => [
			{
				slug: "transfer-retailer",
				label: `Assign ${getUserTypeLabel(UserType.DISTRIBUTOR)}`,
				path: "/admin/my-network/profile/change-role",
				transferConfig: { targetUserType: UserType.MERCHANT },
			},
			{
				slug: "transfer-fos",
				label: `Assign ${getUserTypeLabel(UserType.FOS)}`,
				path: "/admin/my-network/profile/change-role",
				transferConfig: { targetUserType: UserType.FOS },
			},
			{
				slug: "retailer-to-iretailer",
				label: `Unassign ${getUserTypeLabel(UserType.DISTRIBUTOR)}`,
				path: "/admin/my-network/profile/change-role",
			},
			{
				slug: "retailer-to-distributor",
				label: `Promote ${getUserTypeLabel(UserType.MERCHANT)} To ${getUserTypeLabel(UserType.DISTRIBUTOR)}`,
				path: "/admin/my-network/profile/change-role",
			},
		],
		[getUserTypeLabel]
	);

	const AGENT_VIEW_TABS = useMemo(
		() => [
			{
				slug: "transfer-retailer",
				label: `Assign ${getUserTypeLabel(UserType.DISTRIBUTOR)}`,
				path: "/admin/my-network/profile/change-role",
				allowedUserTypes: [UserType.I_MERCHANT],
			},
			{
				slug: "transfer-retailer",
				label: `Change ${getUserTypeLabel(UserType.DISTRIBUTOR)}`,
				path: "/admin/my-network/profile/change-role",
				allowedUserTypes: [UserType.MERCHANT],
			},
			{
				slug: "retailer-to-iretailer",
				label: `Unassign ${getUserTypeLabel(UserType.DISTRIBUTOR)}`,
				path: "/admin/my-network/profile/change-role",
				allowedUserTypes: [UserType.MERCHANT],
			},
			{
				slug: "retailer-to-distributor",
				label: `Promote To ${getUserTypeLabel(UserType.DISTRIBUTOR)}`,
				path: "/admin/my-network/profile/change-role",
				allowedUserTypes: [UserType.MERCHANT, UserType.I_MERCHANT],
			},
		],
		[getUserTypeLabel]
	);

	return { ORG_VIEW_TABS, AGENT_VIEW_TABS };
};

export default useChangeRoleOptions;
