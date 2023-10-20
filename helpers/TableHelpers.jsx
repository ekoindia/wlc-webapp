import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Currency, DateView, IcoButton, Icon, Tags } from "components";
import { NetworkMenuWrapper } from "page-components/Admin/Network";

// convert status to color
const statusChecker = {
	Active: "success",
	Success: "success",
	Inactive: "error",
	Cancel: "error",
	Failed: "error",
	Fail: "error",
	Pending: "orange.500",
	Initiated: "orange.300",
	"Refund pending": "purple.500",
	Other: "light",
};

export const getNameStyle = (name, icon, hue) => {
	if (name?.length > 0) {
		return (
			<Flex align={"center"} gap="0.625rem">
				<Avatar
					size={{ base: "sm" }}
					name={icon ? null : name}
					bg={hue ? `hsl(${hue},80%,95%)` : "primary.DEFAULT"}
					color={hue ? `hsl(${hue},80%,25%)` : "divider"}
					border={hue ? `1px solid hsl(${hue},80%,85%)` : null}
					icon={icon ? <Icon size="16px" name={icon} /> : null}
					sx={{
						"@media print": {
							display: "none !important",
						},
					}}
				/>
				<Box as="span" fontWeight="500">
					{name}
				</Box>
			</Flex>
		);
	}
};

export const getStatusStyle = (status = "", tableName) => {
	if (tableName === "History") {
		const clr = statusChecker[status] || "light";
		if (status?.toLowerCase() !== "success") {
			return (
				<Flex justify="flex-end">
					<Flex
						// align="center"
						// justify="center"
						textAlign="center"
						width="min-content"
						px="6px"
						py="4px"
						border="1px"
						borderRadius="4px"
						borderColor={clr}
						color={clr}
						noOfLines={2}
						whiteSpace="pre-line"
						fontSize="10px"
						lineHeight="1"
						sx={{
							"@media print": {
								borderWidth: 0,
								padding: "0 !important",
								background: "transparent !important",
							},
						}}
					>
						{status}
						{/* <Tags
						size={{ base: "xs", "2xl": "sm" }}
						px="8px"
						borderRadius="4px"
						status={status}
					/> */}
					</Flex>
				</Flex>
			);
		}
		return null;
	}

	return (
		<Flex>
			<Tags borderRadius="full" status={status} />
		</Flex>
	);
};

export const getLocationStyle = (location, lat, long) => {
	return (
		<Flex alignItems={"center"}>
			<IcoButton
				size="xs"
				iconName="near-me"
				theme="accent"
				mr={1}
				onClick={(e) => {
					openGoogleMap(lat, long);
					e.stopPropagation();
				}}
				sx={{
					"@media print": {
						display: "none !important",
					},
				}}
			/>
			<Box>{location}</Box>
		</Flex>
	);
};

export const getArrowStyle = () => {
	return (
		<Icon
			name="arrow-forward"
			color="hint"
			size={{ base: "16px", lg: "20px", "2xl": "24px" }}
			sx={{
				"@media print": {
					display: "none !important",
				},
			}}
		/>
	);
};

export const getModalStyle = (mobile_number, eko_code, account_status) => {
	return (
		<>
			<NetworkMenuWrapper
				{...{ mobile_number, eko_code, account_status }}
			/>
		</>
	);
};

export const getExpandIcoButton = (expandedRow, index) => {
	return (
		<IcoButton
			iconName={expandedRow === index ? "remove" : "expand-add"}
			color="white"
			bg="accent.DEFAULT"
			size="xxs"
			// iconStyle={{ color: "accent.DEFAULT" }}
			// border="2px solid #FE9F00"
			// boxShadow="0px 3px 6px #00000029"
			title={expandedRow === index ? "Shrink" : "Expand"}
			cursor="pointer"
			sx={{
				"@media print": {
					display: "none !important",
				},
			}}
		/>
	);
};

export const getAmountStyle = (amount) => {
	return <Currency amount={amount} preserveFraction={true} />;
};

export const getPaymentStyle = (amount, trx_type, side = "left") => {
	return (
		amount !== undefined && (
			<Flex
				align="center"
				gap="1"
				flexDirection={side === "right" ? "row-reverse" : "row"}
				textAlign="left"
				width="min-content"
			>
				{/* {trx_type && (
					<Icon
						name={trx_type === "DR" ? "expand-add" : "minus"}
						size="xs"
						//color={trx_type === "DR" ? "error" : "success"}
						sx={{
							"@media print": {
								display: "none !important",
							},
						}}
					/>
				)} */}

				{trx_type && (
					<Text as="b" size="sm">
						{trx_type === "DR" ? "-" : "+"}
					</Text>
				)}
				<Currency amount={amount} preserveFraction={true} />
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
				sx={{
					"@media print": {
						display: "none !important",
					},
				}}
			/>
		</Flex>
	);
};

export const getDateView = (dateTime) => {
	return <DateView date={dateTime} />;
};

export const getDateTimeView = (dateTime) => {
	return <DateView date={dateTime} format="dd MMM yyyy hh:mm a" />;
};
