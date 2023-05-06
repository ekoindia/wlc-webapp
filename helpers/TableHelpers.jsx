import { Avatar, Box, Circle, Flex, Text } from "@chakra-ui/react";
import { Icon, IconButtons, Tags } from "components";
import { NetworkMenuWrapper } from "page-components/Admin/Network";

export const getNameStyle = (name) => {
	return (
		<Flex align={"center"} gap="0.625rem">
			<Avatar
				bg="accent.DEFAULT"
				color="divider"
				size={{ base: "sm", sm: "sm", md: "xs", lg: "sm" }}
				name={(name || "").charAt(0)}
				// src={item.link}
			/>
			<Box as="span">{name}</Box>
		</Flex>
	);
};
export const getStatusStyle = (status, tableName) => {
	return tableName === "History" && status === "Failed" ? (
		<Flex justify="end">
			<Tags
				size={{ base: "sm", md: "xs", lg: "xs", "2xl": "md" }}
				px="10px"
				borderRadius="10"
				status={status}
			/>
		</Flex>
	) : tableName !== "History" ? (
		<Flex>
			<Tags
				size={{ base: "sm", md: "xs", lg: "xs", "2xl": "md" }}
				px="10px"
				borderRadius="28"
				status={status}
			/>
		</Flex>
	) : null;
};
export const getLocationStyle = (location, lat, long) => {
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
	return (
		<>
			<NetworkMenuWrapper
				eko_code={eko_code}
				account_status={account_status}
			/>
		</>
	);
};
export const getAccordianIcon = (expandedRow, index) => {
	return (
		<Flex justify="center" align="center">
			<Circle bg="primary.DEFAULT" size="24px" cursor="pointer">
				<Icon
					name={expandedRow === index ? "remove" : "expand-add"}
					width="12px"
					color="white"
				/>
			</Circle>
		</Flex>
	);
};

export const getAmountStyle = (amount, trx_type) => {
	return (
		amount !== undefined && (
			<Flex align="center" gap="2">
				<Flex align="center" gap="1">
					<Icon name="rupee" h="12px" w="9px" />
					<Text>{amount}</Text>
				</Flex>
				{trx_type && (
					<Icon
						name={
							trx_type === "debit"
								? "arrow-increase"
								: "arrow-decrease"
						}
						h="16px"
						w="14px"
						color={trx_type === "debit" ? "error" : "success"}
					/>
				)}
			</Flex>
		)
	);
};

export const getDescriptionStyle = (description) => {
	return (
		<Text whiteSpace="normal" overflowWrap="break-word">
			{description}
		</Text>
	);
};

export const openGoogleMap = (latitude, longitude) => {
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
