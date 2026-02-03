import { Divider, Flex, Text } from "@chakra-ui/react";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useSession } from "contexts/UserContext";
import { WidgetBase } from "page-components/Home";

/**
 * Show App/Organizatiopn details to Admins in the profile page.
 */
const AppDetails = () => {
	const { isAdmin } = useSession();
	const { orgDetail } = useOrgDetailContext();

	// Show only to Admins
	if (!isAdmin) {
		return null;
	}

	console.log("Organization Details:: ", orgDetail);

	return (
		<WidgetBase
			title="Organization Details"
			// iconName="mode-edit"
			// linkOnClick={() => onOpen()}
		>
			<DetailRow label="App Name" value={orgDetail?.app_name || "N/A"} />
			<DetailRow
				label="Organization Name"
				value={orgDetail?.org_name || "N/A"}
			/>
			<DetailRow
				label="Website"
				value={
					orgDetail?.website ??
					(typeof window !== "undefined"
						? window.location.origin
						: "")
				}
				hideDivider
			/>
		</WidgetBase>
	);
};

/**
 * Row component to show a single detail
 * @param root0
 * @param root0.label
 * @param root0.value
 * @param root0.hideDivider
 */
const DetailRow = ({ label, value, hideDivider = false }) => {
	return (
		<Flex direction="column" fontSize="sm">
			<Text>{label}</Text>
			<Text fontSize="md" fontWeight="semibold" color="primary.DEFAULT">
				{value}
			</Text>
			{!hideDivider && <Divider my="14px" />}
		</Flex>
	);
};

export { AppDetails };
