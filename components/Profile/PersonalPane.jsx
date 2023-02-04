import {
	Box,
	Heading,
	Stack,
	StackDivider,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import { Cards, IconButtons } from "../";

const PersonalPane = () => {
	const [isSmallerThan440] = useMediaQuery("(max-width:440px)");
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
					title={isSmallerThan440 ? "" : "Edit Details"}
					iconPos={isSmallerThan440 ? "" : "left"}
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
				<Box display={"flex"}>
					<Text>Date of birth:</Text>
					<Text fontWeight={"medium"}>&nbsp; 06/02/1989</Text>
				</Box>
				<Box display={"flex"}>
					<Text>Gender:</Text>
					<Text fontWeight={"medium"}>&nbsp; Male</Text>
				</Box>
				<Box display={"flex"}>
					<Text>Shop name:</Text>
					<Text fontWeight={"medium"}>&nbsp; Alam Store</Text>
				</Box>
				<Box display={"flex"}>
					<Text>Marital Status:</Text>
					<Text fontWeight={"medium"}>&nbsp; Not disclosed</Text>
				</Box>
				<Box display={"flex"}>
					<Text>Monthly Income:</Text>
					<Text fontWeight={"medium"}>&nbsp; NA</Text>
				</Box>
				<Box display={"flex"}>
					<Text>Shop Type:</Text>
					<Text fontWeight={"medium"}>&nbsp; Kirana</Text>
				</Box>
			</Stack>
		</Cards>
	);
};

export default PersonalPane;
