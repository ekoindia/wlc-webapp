import { Center } from "@chakra-ui/react";

const statusColorMapping = {
	Active: "success",
	Success: "success",
	Inactive: "error",
	Cancel: "error",
	Failed: "error",
	Fail: "error",
	Pending: "orange.500",
	Other: "light",
};

const Tags = ({ status = "Other", ...rest }) => {
	const clr = statusColorMapping[status];
	return (
		<Center
			border="1px"
			borderColor={clr}
			color={clr}
			textAlign="center"
			fontSize="sm"
			bg="white"
			px="2.5"
			py={{ base: "0.75", md: "1" }}
			{...rest}
		>
			{status}
		</Center>
	);
};

export default Tags;
