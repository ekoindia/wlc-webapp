import { Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Icon } from "..";

const Headings = (props) => {
	const {
		hasIcon = true,
		title,
		marginLeft = "1rem",
		redirectPath,
		propComp,
	} = props;
	console.log("propComp", propComp);

	const router = useRouter();
	const redirectTo = () => {
		// router.push(`${redirectPath}`);
		router.back();
	};
	return (
		<Flex
			marginTop={{ base: "0px", md: "1vw" }}
			px={{ base: "16px", md: "0px" }}
			justify="space-between"
			align="center"
		>
			<Box>
				{hasIcon ? (
					<Flex alignItems="center" gap={{ base: "2", lg: "4" }}>
						<Box
							onClick={redirectTo}
							cursor="pointer"
							width={{ base: "15px", sm: "16px", "2xl": "18px" }}
							height={{ base: "15px", sm: "16px", "2xl": "18px" }}
						>
							<Icon name="arrow-back" />
						</Box>
						<Text
							fontSize={{
								base: "18px",
								sm: "18px",
								md: "20px",
								lg: "25px",
								"2xl": "30px",
							}}
							fontWeight="semibold"
						>
							{title}
						</Text>
					</Flex>
				) : (
					<Text
						fontSize={{
							base: "18px",
							sm: "18px",
							md: "20px",
							lg: "25px",
							"2xl": "30px",
						}}
						fontWeight="semibold"
					>
						{title}
					</Text>
				)}
			</Box>
			<Box>{propComp}</Box>
		</Flex>
	);
};

export default Headings;
