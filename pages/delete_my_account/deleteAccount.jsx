import { LayoutLogin } from "components/Layout";
import { UserTypeLabel } from "constants";
import { useOrgDetailContext, useUser } from "contexts";

const DeleteAccount = () => {
	const { orgDetail } = useOrgDetailContext();
	const { userData, isLoggedIn } = useUser();

	const { user_type } = userData.userDetails;
	const { app_name, org_id } = orgDetail;
	const currentUrl = window.location.href;
	const baseUrl = currentUrl.split("/").slice(0, 3).join("/");

	let src_url_loggedIn = `https://forms.zohopublic.in/ekoindiafinancialservicespvtlt/form/DeleteMyAccountforLoggedInUser/formperma/4GiiXnxk9apjC7ws-hRTNIlcosXjlNHErNocfMRFCMA?name=${app_name}&org_url=${baseUrl}&org_id=${org_id}&agent_type=${UserTypeLabel[user_type]}`;
	let src_url =
		"https://forms.zohopublic.in/ekoindiafinancialservicespvtlt/form/DeleteAccount/formperma/iFg1L_aO6rkzx-qSpR07UaUAJLTngr5cbO4aJJqTKY8";
	return (
		<>
			<iframe
				allow="fullscreen"
				src={isLoggedIn ? src_url_loggedIn : src_url}
				height={1000}
				width="100%"
				frameborder="0"
				marginheight="0"
				marginwidth="0"
			></iframe>
		</>
	);
};

DeleteAccount.pageMeta = {
	title: "Delete My Account",
};

//Custom simple layout...
DeleteAccount.getLayout = (page) => <LayoutLogin>{page}</LayoutLogin>;

export default DeleteAccount;
