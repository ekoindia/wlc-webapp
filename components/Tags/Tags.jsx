import { Button } from "@chakra-ui/react";

const statusChecker = {
	Active: "success",
	Success: "success",
	Inactive: "error",
	Cancel: "error",
	Failed: "error",
	Fail: "error",
	Pending: "orange.500",
	Other: "light",
};

const Tags = ({
	status = "Other",
	px = { base: "16px", md: "18px", xl: "22px" },
	size = "md",
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
			size={size}
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
