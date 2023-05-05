import { Flex, Text } from "@chakra-ui/react";
import { IconButtons } from "components";
import { useUser } from "contexts/UserContext";

/**
 * A <PersonalDetailCard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<PersonalDetailCard></PersonalDetailCard>` TODO: Fix example
 */
const PersonalDetailCard = () => {
	const { userData } = useUser();
	const data = userData.personalDetails;
	const personalDetailObj = {
		gender: "Gender",
		dob: "Date of Birth",
		qualification: "Qualification",
		marital_status: "Marital Status",
	};
	const onEditClick = () => {
		console.log("clicked");
	};
	return (
		<Flex
			w="100%"
			h={{ base: "400px" }}
			bg="white"
			direction="column"
			borderRadius="10px"
			border="1px solid #D2D2D2"
			boxShadow="0px 5px 15px #0000000D"
			p="5"
		>
			<Flex justify="space-between">
				<Text fontWeight="semibold" fontSize={{ base: "18px" }}>
					Personal Details
				</Text>
				<IconButtons
					onClick={onEditClick}
					iconName="mode-edit"
					iconStyle={{ height: "12px", width: "12px" }}
				/>
			</Flex>
			<Flex direction="column" mt="20px" rowGap="20px">
				{Object.entries(personalDetailObj).map(([key, value], index) =>
					data[key] != "" ? (
						<Flex key={index} direction="column">
							<Text>{value}</Text>
							<Text fontWeight="semibold">{data[key]}</Text>
						</Flex>
					) : null
				)}
			</Flex>
		</Flex>
	);
};

export default PersonalDetailCard;
