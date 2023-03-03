import { Button, Center } from "@chakra-ui/react";
import { LoginPanel } from "page-components/Admin";
import React from "react";
const chakra = () => {
	return (
		<Center>
			<Button size={"md"} variant="accent">
				CLick me{" "}
			</Button>
			<LoginPanel />
		</Center>
	);
};

export default chakra;
