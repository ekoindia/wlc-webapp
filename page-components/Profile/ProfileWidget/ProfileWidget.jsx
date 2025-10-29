import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { useOrgDetailContext, useUser } from "contexts";
import { useUserTypes } from "hooks";
import { useEffect, useState } from "react";

const profile_percent_parameter_list = [
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

const thresholds = [40, 60];

/**
 * Returns a style object based on the given percent.
 * @param {number} percent - The percent to base the style on.
 * @returns {object} The style object.
 */
const getStyle = (percent) => {
	if (percent >= thresholds[1]) {
		return { clr: "success", boxShadow: "0px 0px 6px #00C34140" };
	} else if (percent >= thresholds[0] && percent <= thresholds[1]) {
		return { clr: "highlight", boxShadow: "0px 0px 6px #FFD93B40" };
	} else if (percent <= thresholds[0]) {
		return { clr: "error", boxShadow: "0px 0px 6px #FF408140" };
	} else {
		return { clr: "none", boxShadow: "none" };
	}
};

/**
 * Formats the given array of objects into a comma-separated string of numbers.
 * @param {Array<{ number: string, verified: number }>} numberList - The array of objects to format. Each object should have a 'number' property.
 * @returns {string} A string of numbers separated by commas. If the input is not an array, an empty string is returned.
 */
const formatToCommaSeparated = (numberList) => {
	if (!Array.isArray(numberList)) return "";
	return numberList.map((item) => item.number).join(", ");
};

/**
 * A ProfileWidget page-component
 */
const ProfileWidget = () => {
	const { userData, userType, userTypeLabel } = useUser();
	const [percent, setPercent] = useState(0);
	const data = userData.userDetails;

	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail ?? {};
	const { login_meta } = metadata ?? {};
	const isMobileMappedUserId = login_meta?.mobile_mapped_user_id === 1;
	const userIdLabel = login_meta?.user_id_label ?? "User ID";

	const { getUserCodeLabel } = useUserTypes();
	const userCodeLabel = getUserCodeLabel(userType);

	const _alternateMobile = formatToCommaSeparated(data?.alternate_mobiles);

	useEffect(() => {
		const { shopDetails, personalDetails } = userData;
		const percentageData = { ...shopDetails, ...personalDetails };

		const count = profile_percent_parameter_list.filter(
			(item) => percentageData[item] !== ""
		).length;
		const percentage = Math.floor(
			(count / profile_percent_parameter_list.length) * 100
		);

		setPercent(percentage);
	}, [userData]);

	const { clr, boxShadow } = getStyle(percent);

	if (!data) {
		return null;
	}

	return (
		<Box
			border="1px solid var(--chakra-colors-hint)"
			borderRadius="10px"
			bgGradient="linear(to-b, primary.light, primary.dark)"
			mx={{ base: 3, md: "0" }}
		>
			<Flex
				direction="column"
				color="white"
				h={{
					base: "auto",
					md: "320px",
					"2xl": "360px",
				}}
				borderRadius="10px"
				background="url('./bg.svg')"
				backgroundRepeat="no-repeat"
				backgroundSize="cover"
				backgroundPosition="bottom"
				p="5"
				boxShadow="basic"
				rowGap="14"
			>
				<Flex align="flex-start" gap={4}>
					<Avatar
						size={{ base: "md", md: "lg" }}
						name={data.name ? data.name[0] : ""}
						src={data.pic}
					/>
					<Flex direction="column" rowGap="1">
						<Text
							fontSize={{ base: "18px", md: "22px" }}
							color="highlight"
							noOfLines={2}
						>
							{data.name}
						</Text>
						<Flex gap="2" fontSize="14px">
							<strong>{userTypeLabel}</strong>
						</Flex>
						{isMobileMappedUserId ? (
							<Flex gap="2" fontSize="14px">
								<Text>
									{userIdLabel}:{" "}
									<strong>{data.user_id}</strong>
								</Text>
							</Flex>
						) : null}
						<Flex gap="2" fontSize="14px">
							<Text>
								{userCodeLabel}: <strong>{data.code}</strong>
							</Text>
						</Flex>
						<Flex align="center" gap="2" mt="2">
							<Icon
								name="phone-circle-outline"
								size="24px"
								color="highlight"
							/>

							<Text>
								{data?.mobile}
								{_alternateMobile && `, ${_alternateMobile}`}
							</Text>
						</Flex>
					</Flex>
					{/* <Flex align="flex-start" height="full">
						<IcoButton
							onClick={onEditClick}
							iconName="mode-edit"
							// iconStyle={{ size: "12px" }}
							size="sm"
							theme="accent"
							_hover={{ bg: "accent.dark" }}
						/>
					</Flex> */}
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
								bg={clr}
								borderRadius="30px"
								boxShadow={boxShadow}
							></Flex>
						</Flex>
						<Text color={clr} fontSize={{ base: "16px" }}>
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
		</Box>
	);
};

export default ProfileWidget;
