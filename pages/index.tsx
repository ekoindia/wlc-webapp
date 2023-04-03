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
					client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
				},
			},
		};
	} else {
		let hostPath = req.headers.host;
		let domainPath = process.env.WLC_SUBDOMAIN_ROOT;
		let dotIndex = hostPath.indexOf(".");

		if (hostPath.slice(dotIndex + 1) === domainPath) {
			const subdomain = hostPath.split(".")[0];

			data = await fetch(
				`https://sore-teal-codfish-tux.cyclic.app/logos/${subdomain}`
			)
				.then((data) => data.json())
				.then((res) => res)
				.catch((e) => console.log(e));
		}
	}

	if (!Object.entries(data).length) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			data: data,
		},
	};
}
