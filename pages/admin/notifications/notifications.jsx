import { BreadcrumbWrapper, PaddingBox } from "components";
import { NotificationCreator } from "page-components/Admin";

const Notifications = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/admin/notifications": "Send Notifications",
				}}
			>
				<NotificationCreator />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

Notifications.pageMeta = {
	title: "Notifications | Admin",
	// isSubPage: true,
};

export default Notifications;
