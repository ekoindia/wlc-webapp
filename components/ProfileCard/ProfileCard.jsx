import { Avatar, Flex, Text } from "@chakra-ui/react";
import { Icon } from "..";

/**
 * A <ProfileCard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @param prop.name
 * @param prop.mobileNumber
 * @param prop.img
 * @param prop.onClick
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
			bg="status.bgLight" // ORIG_THEME: sidebar.card-bg
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
				outlineColor="status.wmLight" // ORIG_THEME: sidebar.icon-bg
			/>

			<Flex
				direction="column"
				justify="space-between"
				justifyContent="space-between"
				h="100%"
				w="100%"
				lineHeight="18px"
			>
				<Text as="span" fontSize="12px" color="status.wm">
					{/* ORIG_THEME: sidebar.font */}
					Welcome
					<Text
						color="status.title" // ORIG_THEME: highlight
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
					color="status.text" // ORIG_THEME: white
				>
					<Icon name="phone-circle-outline" size="16px" />
					{formatNumber(mobileNumber)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default ProfileCard;
