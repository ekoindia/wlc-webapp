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
	let org_detail = {};

	if (process.env.NEXT_PUBLIC_ENV === "development") {
		org_detail = {
			org_id: process.env.WLC_ORG_ID || 1,
			app_name: process.env.WLC_APP_NAME || "wlc",
			org_name: process.env.WLC_ORG_NAME || "wlc",
			logo: process.env.WLC_LOGO,
			login_types: {
				google: {
					client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
				},
			},
			support_contacts: {
				phone: process.env.WLC_SUPPORT_CONTACTS_PHONE || 1234567890,
				email:
					process.env.WLC_SUPPORT_CONTACTS_EMAIL || "xyz@gmail.com",
			},
		};
	} else {
		let hostPath = req.headers.host;
		let domainPath = process.env.WLC_SUBDOMAIN_ROOT;
		let domainOrSubdomain = "";

		if (hostPath.endsWith(domainPath))
			domainOrSubdomain = hostPath.split(".")[0];
		else domainOrSubdomain = hostPath;

		org_detail = await fetch(
			`https://sore-teal-codfish-tux.cyclic.app/logos/${domainOrSubdomain}`
		)
			.then((data) => data.json())
			.then((res) => res)
			.catch((e) => console.log(e));
	}
	if (!Object.entries(org_detail).length) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			data: org_detail,
		},
	};
}
