import { Avatar, Flex, Text } from "@chakra-ui/react";
import { Icon, IconButtons } from "components";
import { UserTypeLabel } from "constants";
import { useUser } from "contexts/UserContext";
import { useEffect, useState } from "react";

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
	const [percent, setPercent] = useState(0);
	const data = userData.userDetails;
	//to calculate percentage completion of profile 👇
	const shopData = userData.shopDetails;
	const personalData = userData.personalDetails;
	const percentageData = { ...shopData, ...personalData };
	const parameterList = [
		"shop_name",
		"shop_type",
		"shop_address",
		"city",
		"state",
		"pincode",
		"gender",
		"dob",
		"qualification",
		"marital_status",
	];

	useEffect(() => {
		let count = 0;
		parameterList.forEach((item) => {
			if (percentageData[item] !== "") {
				count += 1;
			}
		});
		const percentage = Math.floor((count / parameterList.length) * 100);
		setPercent(percentage);
	}, [percentageData, parameterList]);

	const thresholds = [40, 60];
	const styleObj = {
		bg:
			percent >= thresholds[1]
				? "success"
				: percent >= thresholds[0] && percent <= thresholds[1]
				? "highlight"
				: percent <= thresholds[0]
				? "error"
				: null,
		color:
			percent >= thresholds[1]
				? "success"
				: percent >= thresholds[0] && percent <= thresholds[1]
				? "highlight"
				: percent <= thresholds[0]
				? "error"
				: null,
		boxShadow:
			percent >= thresholds[1]
				? "0px 0px 6px #00C34140"
				: percent >= thresholds[0] && percent <= thresholds[1]
				? "0px 0px 6px #FFD93B40"
				: percent <= thresholds[0]
				? "0px 0px 6px #FF408140"
				: null,
	};

	const onEditClick = () => {
		console.log("clicked");
	};

	// const onChangeBtnClick = () => {
	// 	console.log("clicked");
	// };

	return (
		<Flex
			direction="column"
			color="white"
			w="100%"
			h={{ base: "400px" }}
			border="1px solid grey"
			borderRadius="10px"
			background="url('./bg.svg'), linear-gradient(to bottom, #11299e, #09154f)"
			backgroundRepeat="no-repeat"
			backgroundSize="cover"
			backgroundPosition="bottom"
			p="5"
			boxShadow="0px 5px 15px #0000000D"
			rowGap="14"
		>
			<Flex justify="space-between" align="center">
				<Avatar size="xl" name={data.name[0]} src={data.pic} />
				<Flex direction="column" rowGap="1">
					<Text fontSize={{ base: "24px" }} color="highlight">
						{data.name}
					</Text>
					<Flex gap="2">
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
			<Flex direction="column">
				<Text color="divider">Profile Completeness</Text>
				<Flex align="center" gap="1">
					<Flex
						w="100%"
						bg="white"
						borderRadius="30px"
						h={{ base: "3px" }}
					>
						<Flex
							w={`${percent}%`}
							h="100%"
							bg={styleObj.bg}
							borderRadius="30px"
							boxShadow={styleObj.boxShadow}
						></Flex>
					</Flex>
					<Text color={styleObj.color} fontSize={{ base: "16px" }}>
						{percent}&#37;
					</Text>
				</Flex>
			</Flex>
			{/* <Flex
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
						&nbsp; Specialist
					</Box>
				</Text>
				<Button onClick={onChangeBtnClick}>Change</Button>
			</Flex> */}
		</Flex>
	);
};

export default ProfileWidget;
