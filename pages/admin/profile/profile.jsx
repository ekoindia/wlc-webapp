import { PaddingBox } from "components";
import { Profile } from "page-components";

const ProfilePage = () => {
	return (
		<PaddingBox>
			<Profile />
		</PaddingBox>
	);
};

ProfilePage.pageMeta = {
	title: "My Profile",
};

export default ProfilePage;
