import { Avatar, Box, Flex, IconButton } from "@chakra-ui/react";
import { Icon, IconButtons, Menus, Tags } from "components";

export const getNameStyle = (name) => {
	return (
		<Flex align={"center"} gap="0.625rem">
			<Box>
				<Avatar
					bg="accent.DEFAULT"
					color="divider"
					size={{ base: "sm", sm: "sm", md: "xs", lg: "sm" }}
					name={name[0]}
					// src={item.link}
				/>
			</Box>
			<Box as="span">{name}</Box>
		</Flex>
	);
};
export const getStatusStyle = (status) => {
	return (
		<Tags
			size={{ base: "sm", md: "xs", lg: "xs", "2xl": "md" }}
			px={"10px"}
			status={status}
		/>
	);
};
export const getLocationStyle = (
	location,
	lat = 23.1967657,
	long = 77.4270079
) => {
	return (
		<Flex alignItems={"center"}>
			<Box>{location}</Box>
			<IconButtons
				iconSize={"xs"}
				iconName="near-me"
				iconStyle={{
					width: "12px",
					height: "12px",
				}}
				onClick={(e) => {
					openGoogleMap(lat, long);
					e.stopPropagation();
				}}
			/>
		</Flex>
	);
};
export const getArrowStyle = () => {
	return (
		<Box
			color="hint"
			width={{ md: "16px", lg: "20px", "2xl": "24px" }}
			height={{ md: "16px", lg: "20px", "2xl": "24px" }}
		>
			<Icon name="arrow-forward" width="100%" />
		</Box>
	);
};
export const getModalStyle = (data) => {
	return (
		<>
			<Menus
				type="everted"
				as={IconButton}
				iconName="more-vert"
				minH={{ base: "25px", xl: "25px", "2xl": "30px" }}
				minW={{ base: "25px", xl: "25px", "2xl": "30px" }}
				width={{ base: "25px", xl: "25px", "2xl": "30px" }}
				height={{ base: "25px", xl: "25px", "2xl": "30px" }}
				iconStyles={{ height: "15px", width: "4px" }}
				onClick={(e) => {
					e.stopPropagation();
				}}
			/>
		</>
	);
};
export const openGoogleMap = ({ latitude, longitude }) => {
	const lat = parseFloat(latitude);
	const lng = parseFloat(longitude);
	window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");
};
