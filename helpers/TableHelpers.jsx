import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Currency, DateView, IcoButton, Icon, Tags } from "components";
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
			<IcoButton
				size="xs"
				iconName="near-me"
				theme="primary"
				ml={1}
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
		<Icon
			name="arrow-forward"
			color="hint"
			size={{ base: "16px", lg: "20px", "2xl": "24px" }}
		/>
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
export const getExpandIcoButton = (expandedRow, index) => {
	return (
		<IcoButton
			iconName={expandedRow === index ? "remove" : "expand-add"}
			bg="white"
			size="xs"
			iconStyle={{ color: "primary.DEFAULT" }}
			border="2px solid #FE9F00"
			boxShadow="0px 3px 6px #00000029"
			title={expandedRow === index ? "Shrink" : "Expand"}
			cursor="pointer"
		/>
	);
};

export const getAmountStyle = (amount) => {
	return <Currency amount={amount} preserveFraction={true} />;
};

export const getPaymentStyle = (amount, trx_type) => {
	return (
		amount !== undefined && (
			<Flex align="center" gap="2">
				<Currency amount={amount} preserveFraction={true} />
				{trx_type && (
					<Icon
						name={
							trx_type === "DR"
								? "arrow-increase"
								: "arrow-decrease"
						}
						size="16px"
						color={trx_type === "DR" ? "error" : "success"}
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
				size="14px"
				// h="8px"
			/>
		</Flex>
	);
};

export const getDateView = (dateTime) => {
	return <DateView date={dateTime} />;
};
