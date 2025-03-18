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

// convert status to color
const statusChecker = {
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

/**
 * Get status color based on the response_status_id
 * @param {number} response_status_id - The response status ID
 * @returns {string} Color corresponding to the response status
 */
const getStatusColor = (response_status_id) => {
	switch (response_status_id) {
		case 0: // SUCCESS
			return "";
		case 1: // FAILURE
			return "error";
		case 2: // INITIATED
			return "#FBC02D";
		case 3: // REFUND_INITIATED
			return "#9C27B0";
		case 5: // HOLD
			return "#8D6E63";
		case 8: // SCHEDULED
			return "success";
		case 9: // SCHEDULED_EXPIRED
			return "error";
		default:
			return "gray";
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
	const statusColor = getStatusColor(item?.response_status_id);

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
							boxSize="1.45em"
							bg={statusColor}
							p="3px"
							color="white"
						>
							{statusIcon ? (
								<Icon name={statusIcon} size="0.6em" />
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
	const clr = statusChecker[_status] || "light";
	if (tableName === "History") {
		const clr = statusChecker[_status] || "light";
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

export const getLocationStyle = (location, lat, long) => {
	let _showIcoButton = false;

	let _nullRemovedText = nullRemover(location);

	const _needToolTip = _nullRemovedText?.length > 25;

	let _limitedText = "";

	if (lat != null || long != null || lat != undefined || long != undefined) {
		_showIcoButton = true;

		if (!_nullRemovedText) {
			_nullRemovedText = "View on Map";
		}
	}

	if (_needToolTip) {
		_limitedText = limitText(_nullRemovedText, 25);
	}

	const _finalText = _needToolTip ? _limitedText : _nullRemovedText;

	return (
		<Flex align="center">
			{_showIcoButton && (
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
			)}

			<Tooltip
				hasArrow
				label={_needToolTip ? _nullRemovedText : null}
				fontSize="xs"
				bg="primary.DEFAULT"
				color="white"
			>
				<Text>{capitalize(_finalText)}</Text>
			</Tooltip>
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

export const getExpandIcoButton = (expandedRow, index) => {
	return (
		<IcoButton
			iconName={expandedRow === index ? "remove" : "expand-add"}
			color="white"
			bg="accent.DEFAULT"
			size="xxs"
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
		<Flex direction="column" align="center">
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
