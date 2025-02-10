import { UserTypeLabel } from "constants";
import { useOrgDetailContext, useUser } from "contexts";
import { LayoutLogin } from "layout-components";

const DeleteAccount = () => {
	const { orgDetail } = useOrgDetailContext();
	const { userData, isLoggedIn } = useUser();

	const { user_type, mobile } = userData.userDetails;
	const { app_name, org_id } = orgDetail;
	const currentUrl = window.location.href;
	const baseUrl = currentUrl.split("/").slice(0, 3).join("/");

	let src_url_loggedIn = `https://zfrmz.in/Ap36vU4GDK5eywKxdEA4?name=${app_name}&org_url=${baseUrl}&org_id=${org_id}&agent_type=${UserTypeLabel[user_type]}&mobile=${mobile}`;
	let src_url = `https://zfrmz.in/qibBUJGotvHwFHLpV1pJ?name=${app_name}&org_url=${baseUrl}`;
	return (
		<>
			<iframe
				allow="fullscreen"
				src={isLoggedIn ? src_url_loggedIn : src_url}
				height={1000}
				width="100%"
				marginheight="0"
				marginwidth="0"
				style={{ border: "none" }}
			></iframe>
		</>
	);
};

DeleteAccount.pageMeta = {
	title: "Delete My Account",
};

//Custom simple layout...
DeleteAccount.getLayout = LayoutLogin;

export default DeleteAccount;
