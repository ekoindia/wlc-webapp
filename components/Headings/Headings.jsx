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
		<Box onClick={redirectTo}>
			{hasIcon ? (
				<Flex alignItems="center" gap="4" cursor="pointer">
					<Icon name="arrow-back" width="18px" height="15px" />
					<Text fontSize="30px" fontWeight="semibold">
						{title}
					</Text>
				</Flex>
			) : (
				<Text fontSize="30px" fontWeight="semibold">
					{title}
				</Text>
			)}
		</Box>
	);
};

export default Headings;
