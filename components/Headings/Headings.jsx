import { Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Icon } from "..";

const Headings = (props) => {
	const { hasIcon = true, title, marginLeft = "1rem", redirectPath } = props;

	const router = useRouter();
	const redirectTo = () => {
		router.push(`${redirectPath}`);
	};
	return (
		<Box
			onClick={redirectTo}
			marginTop={"1.8vw"}
			px={{ base: "1.5vw", lg: "0px" }}
		>
			{hasIcon ? (
				<Flex
					alignItems="center"
					gap={{ base: "2", lg: "4" }}
					cursor="pointer"
				>
					<Icon name="arrow-back" width="14px" height="13px" />
					<Text
						fontSize={{
							base: "12px",
							md: "15px",
							lg: "18px",
							"2xl": "35px",
						}}
						fontWeight="semibold"
					>
						{title}
					</Text>
				</Flex>
			) : (
				<Text
					fontSize={{
						base: "4px",
						md: "15px",
						lg: "18px",
						"2xl": "35px",
					}}
					fontWeight="semibold"
				>
					{title}
				</Text>
			)}
		</Box>
	);
};

export default Headings;
