import { Button } from "@chakra-ui/react";

const statusChecker = {
	Active: "success",
	Pending: "primary.DEFAULT",
	Inactive: "error",
	Other: "light",
	Cancel: "error",
};

const Tags = ({
	status = "Active",
	px = { base: "16px", md: "18px", xl: "22px" },
	styles,
	...props
}) => {
	const sts = statusChecker[status];
	return (
		<Button
			variant={"outline"}
			border={"1px"}
			borderRadius={"28"}
			colorScheme={sts}
			color={sts}
			bg="white"
			size={"md"}
			fontWeight={"regular"}
			px={px}
			{...styles}
			{...props}
		>
			{status}
		</Button>
	);
};

export default Tags;
