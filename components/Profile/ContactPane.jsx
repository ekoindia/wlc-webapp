import {
	Box,
	Heading,
	Stack,
	StackDivider,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import { Cards, IconButtons } from "../";

const ContactPane = () => {
	const [isSmallerThan440] = useMediaQuery("(max-width:440px)");
	return (
		<Cards h="365px">
			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
			>
				<Heading
					fontSize={{ base: 16, md: 18 }}
					fontWeight="semibold"
					color={"light"}
				>
					Contact information
				</Heading>
				<IconButtons
					title={isSmallerThan440 ? "" : "Edit Details"}
					iconPos="left"
					iconName="mode-edit"
					iconStyle={{
						width: "12px",
						height: "12px",
					}}
				/>
			</Box>

			<Stack
				direction={"column"}
				divider={<StackDivider />}
				mt={"5"}
				fontSize={14}
			>
				<Box display={"flex"}>
					<Text>Mobile number:</Text>
					<Text fontWeight={"medium"}>&nbsp; +91 9898239232</Text>
				</Box>
				<Box display={"flex"} justifyContent={"space-between"}>
					<Box display={"flex"} as="span">
						<Text>Email:</Text>
						<Text fontWeight={"medium"}>
							&nbsp; angeltech@email.co.in
						</Text>
					</Box>
					<Box
						as="span"
						color="accent.DEFAULT"
						fontWeight={"semibold"}
					>
						Email Now
					</Box>
				</Box>
				<Box display={"flex"}>
					<Text>Landline:</Text>
					<Text fontWeight={"medium"}>&nbsp; 0123 - 23412332</Text>
				</Box>
			</Stack>
		</Cards>
	);
};

export default ContactPane;
