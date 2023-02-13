import { Box, Text } from "@chakra-ui/react";

const Divider = ({ title, titleStyle, ...props }) => {
	return (
		<Box textAlign="center" maxW="100%" {...props}>
			<Text
				as="h2"
				// textAlign='center'
				overflow="hidden"
				// display="block"
			>
				<Text
					variant="selectNone"
					position="relative"
					px="12px"
					// display="inline-block"
					// fontSize="20px"
					as="span"
					_before={{
						position: "absolute",
						top: "50%",
						width: "1000px",
						borderTop: "1px solid",
						content: "''",
						right: "100%",
						borderColor: "#707070",
					}}
					_after={{
						position: "absolute",
						top: "50%",
						width: "1000px",
						borderTop: "1px solid",
						content: "''",
						left: "100%",
						borderColor: "#707070",
					}}
					{...titleStyle}
				>
					{title}
				</Text>
			</Text>
		</Box>
	);
};

export default Divider;
