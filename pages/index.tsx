/* eslint-disable react-hooks/exhaustive-deps */
import { LoginPanel } from "page-components";
import { useEffect } from "react";
import { useOrgDetailContext } from "../contexts";

export default function Index({ data }) {
	console.log(data);

	const { setOrgDetail } = useOrgDetailContext();
	useEffect(() => {
		setOrgDetail(data);
	}, [data]);

	return <LoginPanel />;
}

export async function getServerSideProps({ req }) {
	// console.log(req.headers.host.split('.')[0]);
	let data = {};
	if (process.env.NEXT_PUBLIC_ENV === "local") {
		data = {
			org_id: process.env.WLC_ORG_ID,
			app_name: process.env.WLC_APP_NAME,
			org_name: process.env.WLC_ORG_NAME,
			logo: process.env.WLC_LOGO,
			support_contacts: {
				phone: process.env.WLC_SUPPORT_CONTACTS_PHONE,
				email: process.env.WLC_SUPPORT_CONTACTS_EMAIL,
			},
			login_types: {
				google: {
					client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
				},
			},
		};
	} else {
		const subdomain = req.headers.host.split(".")[0];
		const domain = req.headers.host.split(".");
		data = await fetch(
			`https://sore-teal-codfish-tux.cyclic.app/logos/${subdomain}`
		)
			.then((data) => data.json())
			.then((res) => res)
			.catch((e) => console.log(e));
	}

	return {
		props: {
			data: data,
		},
	};
}
