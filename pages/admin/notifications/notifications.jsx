import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NotificationCreator } from "page-components/Admin";

const Notifications = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/admin/notifications": "Send Notifications",
				}}
			>
				<NotificationCreator />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

Notifications.pageMeta = {
	title: "Notifications | Admin",
	// isSubPage: true,
};

export default Notifications;
