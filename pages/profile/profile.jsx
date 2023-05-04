import { PaddingBox } from "components";
import Head from "next/head";
import { Profile } from "page-components";

const ProfilePage = () => {
	return (
		<>
			<PaddingBox>
				<Head>
					<title>Profile</title>
				</Head>
				<Profile />
			</PaddingBox>
		</>
	);
};

export default ProfilePage;
