import { useEffect } from "react";
import { Spinner, Flex, Text } from "@chakra-ui/react";

const Redirect = () => {
	const queryParams = new URLSearchParams(window.location.search);
	const _status = queryParams.get("status");

	useEffect(() => {
		window.opener.postMessage(
			{ type: "STATUS_UPDATE", body: { status: _status } },
			window.location.origin
		);

		setTimeout(() => {
			window.close();
		}, 20000);
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
