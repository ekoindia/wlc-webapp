import { Box, Heading, Stack, StackDivider, Text } from "@chakra-ui/react";
import { Cards } from "../";

const PersonalPane = () => {
	return (
		<Cards h="365px">
			<Heading fontSize={18} fontWeight="semibold" color={"light"}>
				Personal information
			</Heading>
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
