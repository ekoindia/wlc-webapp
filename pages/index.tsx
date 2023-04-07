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
	const invalidOrg = {
		notFound: true,
	};

	if (process.env.NEXT_PUBLIC_ENV === "development2") {
		data = {
			org_id: process.env.WLC_ORG_ID || 1,
			app_name: process.env.WLC_APP_NAME || "wlc",
			org_name: process.env.WLC_ORG_NAME || "wlc",
			logo: process.env.WLC_LOGO,
			support_contacts: {
				phone: process.env.WLC_SUPPORT_CONTACTS_PHONE || 1234567890,
				email:
					process.env.WLC_SUPPORT_CONTACTS_EMAIL || "xyz@gmail.com",
			},
			login_types: {
				google: {
					client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
				},
			},
		};
	} else {
		const host = req.headers.host;
		console.log("host: ", host);

		const subdomainRootHost =
			"." + (process.env.WLC_SUBDOMAIN_ROOT || "xxxx");
		let domain = "";
		let subdomain = "";

		if (host.endsWith(subdomainRootHost)) {
			// Subdomain root found. Extract subdomain from host
			subdomain = host.slice(0, -subdomainRootHost.length);
		} else {
			// Subdomain root not found. Get the whole host as domain
			domain = host;
		}

		if (!domain && !subdomain) {
			return invalidOrg;
		}

		data = await fetch(
			process.env.NEXT_PUBLIC_API_BASE_URL +
				"/wlctransactions/wlcorgmeta",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
				// body: JSON.stringify({ sub_domain: "simple" }),
				body: JSON.stringify(
					domain
						? { domain: encodeURIComponent(domain) }
						: { sub_domain: encodeURIComponent(subdomain) }
				),
			}
		)
			.then((data) => data.json())
			.then((res) => {
				if (res && res.status == 0) {
					return res.data;
				} else {
					return invalidOrg;
				}
			})
			.catch((e) => {
				console.error("Error getting org details: ", e);
				return invalidOrg;
			});
	}

	if (!Object.entries(data).length) {
		return invalidOrg;
	}

	return {
		props: {
			data: data,
		},
	};
}
