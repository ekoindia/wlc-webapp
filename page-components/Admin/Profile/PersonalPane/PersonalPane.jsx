import {
	Box,
	Heading,
	Stack,
	StackDivider,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import { Cards, IconButtons } from "components";
import Router from "next/router";

/**
 * A <PersonalPane> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<PersonalPane></PersonalPane>`
 */
const PersonalPane = () => {
	const [isSmallerThan769] = useMediaQuery("(max-width:769px)");

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
					fontSize={{ base: 20, md: 15, lg: 17, xl: 18 }}
					fontWeight="semibold"
					color={"light"}
				>
					Personal information
				</Heading>
				<IconButtons
					onClick={() =>
						Router.push("/admin/my-network/profile/up-per-info")
					}
					title={isSmallerThan769 ? "" : "Edit Details"}
					iconPos={isSmallerThan769 ? "" : "left"}
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
				fontSize={{ base: 14, md: 12, lg: 14 }}
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
