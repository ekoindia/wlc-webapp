import {
	Avatar,
	AvatarBadge,
	Box,
	Flex,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { Currency, DateView, IcoButton, Icon, Share } from "components";
import { NetworkMenuWrapper } from "page-components/Admin/Network";
import { capitalize, limitText, nullRemover, numberRemover } from "utils";

// convert status text to color
const statusTextColor = {
	active: "success",
	success: "success",
	closed: "success",
	resolved: "success",
	open: "error",
	inactive: "error",
	cancel: "error",
	failed: "error",
	fail: "error",
	escalated: "orange.500",
	pending: "orange.500",
	initiated: "orange.300",
	"on hold": "orange.300",
	wip: "purple.500",
	"refund pending": "purple.500",
	other: "light",
};

// Convert response_status_id to a color, but only for critical statuses
const statusIdColor = {
	0: "", // SUCCESS - Transparent
	1: "error", // FAILURE
	2: "#FBC02D", // INITIATED
	3: "#9C27B0", // REFUND_INITIATED
	5: "#8D6E63", // HOLD
	8: "success", // SCHEDULED
	9: "error", // SCHEDULED_EXPIRED
};

export const getAvatar = (name = "", icon, hue) => {
	const _name = numberRemover(name);

	const needDefaultIcon = _name?.length < 1;

	let _icon = icon;

	if (needDefaultIcon && !icon) {
		name = null;
		_icon = "person";
	}

	return (
		<Avatar
			size={{ base: "sm" }}
			name={name}
			bg={hue ? `hsl(${hue},80%,95%)` : "primary.DEFAULT"}
			color={hue ? `hsl(${hue},80%,25%)` : "divider"}
			border={hue ? `1px solid hsl(${hue},80%,85%)` : null}
			icon={_icon ? <Icon size="15px" name={_icon} /> : null}
			sx={{
				"@media print": {
					display: "none !important",
				},
			}}
		/>
	);
};

export const getNameStyle = (name = "", icon, hue) => {
	const _name = numberRemover(name);

	const needDefaultIcon = _name?.length < 1;

	if (needDefaultIcon) {
		icon = "person";
	}

	return (
		<Flex align="center" gap="0.625rem">
			<Avatar
				size={{ base: "sm" }}
				name={icon ? null : name}
				bg={hue ? `hsl(${hue},80%,95%)` : "primary.DEFAULT"}
				color={hue ? `hsl(${hue},80%,25%)` : "divider"}
				border={hue ? `1px solid hsl(${hue},80%,85%)` : null}
				icon={icon ? <Icon size="15px" name={icon} /> : null}
				sx={{
					"@media print": {
						display: "none !important",
					},
				}}
			/>
			<Box as="span" fontWeight="500">
				{capitalize(needDefaultIcon ? null : _name)}
			</Box>
		</Flex>
	);
};

/**
 * Get status icon based on response_status_id
 * @param {number} response_status_id - The response status ID
 * @returns {string} Icon name corresponding to the response status
 */
const getStatusIcon = (response_status_id) => {
	switch (response_status_id) {
		case 1: // FAILURE
			return "close";
		// case 2: // INITIATED
		// /*breaks through*/
		// case 3: // REFUND_INITIATED
		// /*breaks through*/
		// case 5: // HOLD
		// 	return "disc";
		case 8: // SCHEDULED
			return "alarm";
		case 9: // SCHEDULED_EXPIRED
			return "alarm-off";
		default:
			return "";
	}
};

export const getTrxnSummaryStyle = (item, icon, hue) => {
	if (!item) return "";

	const name = item?.tx_name ?? "";
	const _name = numberRemover(name);

	const needDefaultIcon = _name?.length < 1;
	if (needDefaultIcon) {
		icon = "person";
	}

	const statusIcon = getStatusIcon(item?.response_status_id);
	const statusColor = statusIdColor[item?.response_status_id] ?? "gray";

	return (
		<Flex align="center" gap="0.625rem">
			<Tooltip label={item?.status} placement="right" hasArrow>
				<Avatar
					size={{ base: "sm" }}
					name={icon ? null : name}
					bg={hue ? `hsl(${hue},80%,95%)` : "primary.DEFAULT"}
					color={hue ? `hsl(${hue},80%,25%)` : "divider"}
					border={hue ? `1px solid hsl(${hue},80%,85%)` : null}
					icon={icon ? <Icon size="15px" name={icon} /> : null}
					sx={{
						"@media print": {
							display: "none !important",
						},
					}}
				>
					{statusColor ? (
						<AvatarBadge
							boxSize="20px"
							bg={statusColor}
							// p="8px"
							color="white"
						>
							{statusIcon ? (
								<Icon name={statusIcon} size="8px" />
							) : null}
						</AvatarBadge>
					) : null}
				</Avatar>
			</Tooltip>
			<Flex direction="column">
				<Text fontWeight="500">
					{capitalize(needDefaultIcon ? null : _name)}
				</Text>
				{item?.description ? (
					<Text
						color="light"
						fontSize="0.8em"
						whiteSpace="normal"
						overflowWrap="break-word"
						noOfLines={2}
					>
						{item?.description}
					</Text>
				) : null}
			</Flex>
		</Flex>
	);
};

export const getStatusStyle = (status = "", tableName) => {
	const _status = status?.toLowerCase();
	const clr = statusTextColor[_status] || "light";
	if (tableName === "History") {
		if (_status !== "success") {
			return (
				<Flex justify="center">
					<Flex
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
					</Flex>
				</Flex>
			);
		}
		return null;
	} else {
		const _needToolTip = status?.length > 25;

		return (
			<Tooltip
				hasArrow
				label={_needToolTip ? status : null}
				fontSize="xs"
				bg="primary.DEFAULT"
				color="white"
			>
				<Flex
					textAlign="center"
					maxW="min-content"
					p="4px 8px"
					border="1px"
					borderRadius="4px"
					borderColor={clr}
					color={clr}
					noOfLines={3}
					whiteSpace="pre-line"
					fontSize="11px"
					lineHeight="1"
					bg="white"
				>
					{status}
				</Flex>
			</Tooltip>
		);
	}
};

export const getLocationStyle = (location) => {
	if (!location) return;

	const [latitude, longitude] = location
		?.split(",")
		?.map((coord) => coord.trim());

	const isLocationAvailable = !!(+latitude && +longitude);

	return isLocationAvailable ? (
		<IcoButton
			size="xs"
			iconName="near-me"
			theme="accent"
			mr={1}
			onClick={(e) => {
				e.stopPropagation();
				openGoogleMap(latitude, longitude);
			}}
			sx={{
				"@media print": {
					display: "none !important",
				},
			}}
		/>
	) : null;
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

export const getModalStyle = (
	mobile_number,
	eko_code,
	account_status_id,
	agent_type
) => {
	return (
		<NetworkMenuWrapper
			{...{
				mobile_number,
				eko_code,
				account_status_id,
				agent_type,
			}}
		/>
	);
};

export const getExpandIcoButton = (expandedRow, index, center) => {
	return (
		<Icon
			size="16px"
			p="4px"
			bg="accent.DEFAULT"
			borderRadius="50%"
			color="white"
			name={expandedRow === index ? "remove" : "expand-add"}
			title={expandedRow === index ? "Shrink Row" : "Expand Row"}
			margin={center ? "0 auto" : "0"}
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

export const getPaymentStyle = (amount, trx_type /*, side = "left" */) => {
	// TODO: Use `compute` property in historyParameterMetadata to calculate negative numbers for debited amount and use normal <Currency> component mapped to parameter_type_id = 9 & 10 (or, use getAmountStyle function). Then, remove this function.
	return amount ? (
		<Currency
			amount={trx_type === "DR" ? -amount : amount}
			preserveFraction={false}
		/>
	) : null;
	// return (
	// 	amount !== undefined && (
	// 		<Flex
	// 			align="center"
	// 			gap="1"
	// 			flexDirection={side === "right" ? "row-reverse" : "row"}
	// 			textAlign="left"
	// 			width="min-content"
	// 		>
	// 			{/* {trx_type && (
	// 				<Icon
	// 					name={trx_type === "DR" ? "expand-add" : "minus"}
	// 					size="xs"
	// 					//color={trx_type === "DR" ? "error" : "success"}
	// 					sx={{
	// 						"@media print": {
	// 							display: "none !important",
	// 						},
	// 					}}
	// 				/>
	// 			)} */}

	// 			{trx_type && (
	// 				<Text as="b" size="sm">
	// 					{trx_type === "DR" ? "-" : "+"}
	// 				</Text>
	// 			)}
	// 			<Currency amount={amount} preserveFraction={true} />
	// 		</Flex>
	// 	)
	// );
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
	return (
		<Flex
			direction="column"
			align="center"
			sx={{
				"@media print": {
					flexDirection: "row",
					gap: "0.4em",
				},
			}}
		>
			<DateView date={dateTime} format="d-MMM-yyyy" />
			<DateView date={dateTime} format="h:mm a" />
		</Flex>
	);
};

export const getShareMobileButton = (mobile, meta) => {
	return (
		<Share
			mobile={mobile}
			title={meta?.title}
			url={meta?.url}
			text={meta?.text}
			size="xs"
		/>
	);
};

export const getAddressWithTooltip = (address) => {
	// Handle cases where address might be null or undefined
	if (!address) return null;

	// Clean the address using nullRemover to handle "null" text
	const cleanAddress = nullRemover(address);
	if (!cleanAddress) return null;

	// Check if we need a tooltip (text longer than 25 chars)
	const _needToolTip = cleanAddress.length > 25;
	const _finalText = _needToolTip
		? limitText(cleanAddress, 25)
		: cleanAddress;

	return (
		<Flex align="center">
			<Tooltip
				hasArrow
				label={_needToolTip ? cleanAddress : null}
				fontSize="xs"
				bg="primary.DEFAULT"
				color="white"
			>
				<Text>{capitalize(_finalText)}</Text>
			</Tooltip>
		</Flex>
	);
};
