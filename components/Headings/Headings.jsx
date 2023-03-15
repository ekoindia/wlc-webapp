import { Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Icon } from "..";

const Headings = (props) => {
	const {
		hasIcon = true,
		insideNav = false,
		title,
		marginLeft = "1rem",
		redirectPath,
		propComp,
	} = props;

	const router = useRouter();
	const redirectTo = () => {
		// router.push(`${redirectPath}`);
		router.back();
	};
	return (
		<Flex
			marginBottom={{
				base: !insideNav ? "10px" : "0px",
				sm: !insideNav ? "8px" : "0px",
				md: !insideNav ? "12px" : "0px",
				lg: "16px",
				xl: "18px",
				"2xl": "20px",
			}}
			width="100%"
			px={{ base: "16px", md: !insideNav ? "0px" : "16px" }}
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
			{propComp ? (
				<Box>{!insideNav ? propComp : "Change Role"}</Box>
			) : null}
		</Flex>
	);
};

export default Headings;
