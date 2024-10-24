import { useEffect } from "react";
import { Spinner, Flex, Text } from "@chakra-ui/react";

const Redirect = () => {
	const queryParams = new URLSearchParams(window.location.search);
	const _status = queryParams.get("status");

	useEffect(() => {
		const targetOrigin =
			process.env.NEXT_PUBLIC_ENV === "production" ||
			window.location.origin.includes("connect.eko.in")
				? window.location.origin
				: "*";

		window.opener.postMessage(
			{ type: "STATUS_UPDATE", body: { status: _status } },
			targetOrigin
		);

		setTimeout(() => {
			window.close();
		}, 400);
	}, []);

	return (
		<Flex
			height="100vh"
			alignItems="center"
			justifyContent="center"
			direction="column"
		>
			<Spinner size="xl" />
			<Text mt={4}>Redirecting...</Text>
		</Flex>
	);
};

export default Redirect;
