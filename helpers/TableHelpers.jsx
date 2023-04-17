import { Avatar, Box, Flex } from "@chakra-ui/react";
import { Icon, IconButtons, Tags } from "components";
import { NetworkMenuWrapper } from "page-components/Admin/Network";

export const getNameStyle = (name) => {
	return (
		<Flex align={"center"} gap="0.625rem">
			<Box>
				<Avatar
					bg="accent.DEFAULT"
					color="divider"
					size={{ base: "sm", sm: "sm", md: "xs", lg: "sm" }}
					name={(name || "").charAt(0)}
					// src={item.link}
				/>
			</Box>
			<Box as="span">{name}</Box>
		</Flex>
	);
};
export const getStatusStyle = (status, tableName) => {
	return (
		<Tags
			size={{ base: "sm", md: "xs", lg: "xs", "2xl": "md" }}
			px={"10px"}
			borderRadius={tableName === "Transactions" ? "10" : "28"}
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
					width: "16px",
					height: "16px",
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
export const getModalStyle = (eko_code, account_status) => {
	console.log("eko_code in tablehelpers", eko_code);
	return (
		<>
			{/* <Menus
				type="everted"
				as={IconButton}
				iconName="more-vert"
				minH={{ base: "25px", xl: "25px", "2xl": "30px" }}
				minW={{ base: "25px", xl: "25px", "2xl": "30px" }}
				width={{ base: "25px", xl: "25px", "2xl": "30px" }}
				height={{ base: "25px", xl: "25px", "2xl": "30px" }}
				// iconStyles={{ height: "15px", width: "4px" }}
				onClick={(e) => {
					e.stopPropagation();
				}}
			/> */}
			<NetworkMenuWrapper
				eko_code={eko_code}
				account_status={account_status}
			/>
		</>
	);
};
export const getAccordian = (expandedRow, index) => {
	return (
		<>
			<Box
				bg="primary.DEFAULT"
				width="24px"
				height="24px"
				borderRadius="30px"
				display={"flex"}
				justifyContent={"center"}
				alignItems="center"
				cursor={"pointer"}
			>
				<Box alignItems={"center"}>
					<Icon
						name={expandedRow === index ? "remove" : "add"}
						width="15px"
						color="white"
					/>
				</Box>
			</Box>
		</>
	);
};
export const openGoogleMap = ({ latitude, longitude }) => {
	const lat = parseFloat(latitude);
	const lng = parseFloat(longitude);
	window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");
};

export const getStatus = (debit_credit) => {
	return (
		<Flex
			w="100%"
			h="100%"
			color={debit_credit === "CR" ? "success" : "error"}
		>
			<Icon
				name={
					debit_credit == "DR" ? "arrow-increase" : "arrow-decrease"
				}
				width="14px"
				h="8px"
			/>
		</Flex>
	);
};
