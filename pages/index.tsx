/* eslint-disable react-hooks/exhaustive-deps */
import { Inter } from "@next/font/google";
import { LoginPanel } from "components";
import { useEffect } from "react";
import { useGetLogoContext } from "../contexts/getLogoContext";

export default function Index({ data }) {
	// console.log(data);

	const { logo, setLogo } = useGetLogoContext();
	useEffect(() => {
		setLogo(data?.link);
	}, [data]);

	return <LoginPanel />;
}

export async function getServerSideProps({ req }) {
	// console.log(req.headers.host.split('.')[0]);
	const subdomain = req.headers.host.split(".")[0];
	const domain = req.headers.host.split(".");
	const data = await fetch(
		`https://sore-teal-codfish-tux.cyclic.app/logos/${subdomain}`
	)
		.then((data) => data.json())
		.then((res) => res)
		.catch((e) => console.log(e));
	return {
		props: {
			data: {
				...data,
				subdomain,
				domain,
			},
		},
	};
}
