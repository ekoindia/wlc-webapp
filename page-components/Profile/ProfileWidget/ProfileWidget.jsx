import { Avatar, Box, Flex, Progress, Text } from "@chakra-ui/react";
import { Button, Icon, IconButtons } from "components";
import { UserTypeLabel } from "constants/userTypes";
import { useUser } from "contexts/UserContext";

/**
 * A <ProfileWidget> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<ProfileWidget></ProfileWidget>` TODO: Fix example
 */
const ProfileWidget = () => {
	const { userData } = useUser();
	const data = userData.userDetails;
	console.log("data", data);
	const onEditClick = () => {
		console.log("clicked");
	};
	const onChangeBtnClick = () => {
		console.log("clicked");
	};
	return (
		<Flex
			direction="column"
			color="white"
			w="100%"
			h={{ base: "240px", sm: "350px", md: "387px", lg: "400px" }}
			border="1px solid grey"
			borderRadius="10px"
			background="url('./bg.svg'), linear-gradient(to bottom, #11299e, #09154f)"
			backgroundRepeat="no-repeat"
			backgroundSize="cover"
			backgroundPosition="bottom"
			p="5"
			boxShadow="0px 5px 15px #0000000D"
		>
			<Flex justify="space-between" align="center">
				<Avatar size="xl" name={data.name[0]} src={data.pic} />
				<Flex direction="column" rowGap="2">
					<Text fontSize={{ base: "24px" }} color="highlight">
						{data.name}
					</Text>
					<Flex gap="3">
						<Text>{UserTypeLabel[data.user_type]}</Text>
						<Text>&#124;</Text>
						<Text>User Code: {data.code}</Text>
					</Flex>
					<Flex align="center" gap="2" mt="2">
						<Icon
							name="phone-circle-outline"
							w="30px"
							color="highlight"
						/>
						<Text>
							{data?.mobile}
							{data?.alternate_mobiles?.length > 0
								? ", " + data.alternate_mobiles.join(", ")
								: null}
						</Text>
					</Flex>
				</Flex>
				<Flex align="flex-start" height="full">
					<IconButtons
						onClick={onEditClick}
						iconName="mode-edit"
						iconStyle={{ height: "12px", width: "12px" }}
					/>
				</Flex>
			</Flex>
			<Flex direction="column" mt="auto">
				<Text>Profile Completeness</Text>
				<Box>
					<Progress colorScheme="green" value={20} size="sm" />
				</Box>
				<Text>value</Text>
			</Flex>
			<Flex
				bg="#FFFFFFCC"
				justify="space-between"
				align="center"
				mt="auto"
				p="10px"
				borderRadius="10px"
				border="1px solid #FFFFFF;"
			>
				<Text color="dark">
					Membership Plan:
					<Box as="span" fontWeight="bold">
						&nbsp; Specialist {/*  //TODO */}
					</Box>
				</Text>
				<Button onClick={onChangeBtnClick}>Change</Button>
			</Flex>
		</Flex>
	);
};

export default ProfileWidget;
