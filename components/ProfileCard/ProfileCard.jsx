import { Avatar, Flex, Text } from "@chakra-ui/react";
import { Icon } from "..";

/**
 * A <ProfileCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<ProfileCard></ProfileCard>`
 */
const ProfileCard = ({ name = "", mobileNumber, img, onClick, ...rest }) => {
	const formatNumber = (number) => {
		if (!number) return null;
		let len = number.length;
		return number.slice(0, len / 2) + " " + number.slice(len / 2);
	};

	return (
		<Flex
			h="90px"
			w="100%"
			padding={{
				base: "15px 10px 19px 15px",
			}}
			mb="2px"
			align="center"
			bg="sidebar.card-bg"
			gap={{ base: "14px", lg: "10px", "2xl": "14px" }}
			onClick={onClick}
			{...rest}
		>
			<Avatar
				w="50px"
				h="50px"
				src={img}
				name={name.charAt(0)}
				outline="3px solid"
				outlineColor="sidebar.icon-bg"
			/>

			<Flex
				direction="column"
				justify="space-between"
				justifyContent="space-between"
				h="100%"
				w="100%"
				lineHeight="18px"
			>
				<Text as="span" fontSize="12px" color="sidebar.font">
					Welcome
					<Text
						color="highlight"
						fontSize="14px"
						textTransform="capitalize"
						whiteSpace="nowrap"
						overflow="hidden"
						textOverflow="ellipsis"
						width="85%"
					>
						{name?.toLowerCase()}
					</Text>
				</Text>
				<Flex
					align="center"
					fontSize="12px"
					columnGap="5px"
					color="white"
				>
					<Icon name="phone-circle-outline" w="18px" h="18px" />
					{formatNumber(mobileNumber)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default ProfileCard;
