import { Box, Center, Text } from "@chakra-ui/react";
import { Buttons } from "components";
import Link from "next/link";
const index = () => {
	return (
		<Center h="100vh">
			<Center
				flexDirection="column"
				color={"#232323"}
				rowGap={"10px"}
				w="30%"
			>
				<Box fontWeight={"700"}>
					<Text as="h1" fontSize="146px" lineHeight="normal">
						404
					</Text>
				</Box>
				<Text
					as="h2"
					fontSize="22px"
					fontWeight={"700"}
					color="inherit"
					textTransform={"uppercase"}
				>
					Oops! Page Not Be Found
				</Text>

				<Text as={"p"} color={"#787878"} fontWeight={"400"}>
					Sorry but the page you are looking for does not exist, have
					been removed. name changed or is temporarily unavailable
				</Text>
				<Link href="/">
					<Buttons>Back to homepage</Buttons>
				</Link>
			</Center>
		</Center>
	);
};

export default index;
