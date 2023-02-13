import {
	Box,
	Heading,
	Stack,
	StackDivider,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import { Cards, IconButtons } from "../";
import Router from "next/router";

const PersonalPane = () => {
	const [isSmallerThan768] = useMediaQuery("(max-width:768px)");

	const personalData = [
		{ name: "date_of_birth", label: "Date of birth", value: "06/02/1989" },
		{ name: "gender", label: "Gender", value: "Male" },
		{ name: "shop_name", label: "Shop name", value: "Alam Store" },
		{
			name: "marital_status",
			label: "Marital Status",
			value: "Not disclosed",
		},
		{ name: "monthly_income", label: "Monthly Income", value: "NA" },
		{ name: "shop_type", label: "Shop Type", value: "Kirana" },
	];

	return (
		<Cards h="365px">
			<Box
				display="flex"
				alignItems={"center"}
				justifyContent="space-between"
			>
				<Heading
					fontSize={{ base: 16, md: 18 }}
					fontWeight="semibold"
					color={"light"}
				>
					Personal information
				</Heading>
				<IconButtons
					onClick={() =>
						Router.push("/admin/my-network/profile/up-per-info")
					}
					title={isSmallerThan768 ? "" : "Edit Details"}
					iconPos={isSmallerThan768 ? "" : "left"}
					iconName="mode-edit"
					iconStyle={{
						width: "12px",
						height: "12px",
					}}
				></IconButtons>
			</Box>
			<Stack
				direction={"column"}
				divider={<StackDivider />}
				mt={"5"}
				fontSize={14}
			>
				{personalData.map((item, index) => (
					<Box display={"flex"} key={index}>
						<Text color="light">{item.label}:</Text>
						<Text fontWeight={"medium"}>&nbsp; {item.value}</Text>
					</Box>
				))}
			</Stack>
		</Cards>
	);
};

export default PersonalPane;
