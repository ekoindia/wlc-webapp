import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NotificationsBreadcrumbData } from "constants";
import { NotificationCreator } from "page-components/Admin";

const Notifications = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={NotificationsBreadcrumbData}>
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
