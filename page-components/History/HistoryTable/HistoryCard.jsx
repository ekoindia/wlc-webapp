import { Avatar, Box, Flex, keyframes, Text } from "@chakra-ui/react";
import { Button, Icon, Share } from "components";
import { useAppSource, useMenuContext, useOrgDetailContext } from "contexts";
import { getPaymentStyle, getStatusStyle } from "helpers/TableHelpers";
import { useFeatureFlag, useRaiseIssue } from "hooks";
import useHslColor from "hooks/useHslColor";
import { formatDateTime } from "libs";
import { printPage } from "utils";
import {
	generateShareMessage,
	prepareTableCell,
	showInPrint,
	showOnScreen,
} from ".";

const animSlideDown = keyframes`
	from {opacity: 0; transform: scaleY(0); transform-origin:top;}
	to {opacity: 1; transform: none; transform-origin:top;}
`;

/**
 * A <HistoryCard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<HistoryCard></HistoryCard>` TODO: Fix example
 */
const HistoryCard = ({
	item,
	renderer,
	expanded,
	toggleExpand,
	visibleColumns,
}) => {
	const { interactions } = useMenuContext();
	const { trxn_type_prod_map } = interactions;
	const txicon = trxn_type_prod_map?.[item.tx_typeid]?.icon || null;
	const { h } = useHslColor(item.tx_name);
	const { isAndroid } = useAppSource();
	const { orgDetail } = useOrgDetailContext();

	const isRaiseIssueAllowed = useFeatureFlag("RAISE_ISSUE");
	const { showRaiseIssueDialog } = useRaiseIssue();

	const visible = visibleColumns > 0;
	const extraColumns = visible ? renderer?.slice(visibleColumns) : [];

	return (
		<>
			<Flex
				align="center"
				sx={{
					"@media print": {
						display: "none !important",
					},
				}}
			>
				<Avatar
					size="sm"
					name={txicon ? null : item.tx_name}
					mr="8px"
					border={`1px solid hsl(${h},80%,85%)`}
					bg={`hsl(${h},80%,95%)`}
					color={`hsl(${h},80%,25%)`}
					icon={<Icon size="16px" name={txicon} />}
				/>
				<Flex direction="column" flexGrow={1}>
					<Box fontSize="0.6em" color="light">
						{formatDateTime(item.datetime)}
					</Box>
					<Box
						color="primary.DEFAULT"
						fontWeight="semibold"
						fontSize="sm"
					>
						{item.tx_name}
					</Box>
					<Box fontWeight="medium" fontSize="xs">
						{getPaymentStyle(item.amount, item.trx_type)}
					</Box>
				</Flex>
				<Box color="primary.DEFAULT" fontSize={{ base: "md" }}>
					{getStatusStyle(item.status, "History")}
				</Box>
			</Flex>
			<Flex
				direction="column"
				fontSize={{ base: "xs" }}
				pl="42px"
				sx={{
					"@media print": {
						display: "none !important",
					},
				}}
			>
				<Flex gap="2" align="center">
					<Box as="span" color="light" fontSize="10px">
						TID:
					</Box>
					<Box as="span" color="dark">
						{item.tid}
					</Box>
				</Flex>
			</Flex>
			{expanded ? (
				<Flex
					direction="column"
					w="100%"
					fontSize="sm"
					// border="none"
					// pl="42px"
					mt="10px"
					pt="10px"
					width="100%"
					borderTop="1px solid"
					borderColor="gray.100"
					sx={{
						"@media print": {
							borderTop: "0",
							mt: "0",
							pt: "0",
						},
					}}
					animation={`${animSlideDown} ease-out 0.2s forwards`}
				>
					<Flex
						direction="row"
						wrap="wrap"
						w="100%"
						gap="24px"
						overflow="hidden"
					>
						{extraColumns?.map((column, rendererIndex) => {
							// Show the value on screen?
							const dispScreen = showOnScreen(
								column.display_media_id
							)
								? "inline-flex"
								: "none";

							// Show the value in print?
							const dispPrint = showInPrint(
								column.display_media_id
							)
								? "inline-flex"
								: "none";

							return item[column.name] ? (
								<Flex
									direction="column"
									position="relative"
									align="flex-start"
									key={`tdexpsm-${rendererIndex}-${column.label}`}
									// gap={2}
									// py="6px"
									display={dispScreen}
									sx={{
										"@media print": {
											display: dispPrint,
										},
									}}
									overflow="visible"
								>
									<Box
										position="absolute"
										display="block"
										height="100%"
										width="1px"
										backgroundColor="gray.200"
										// left="-12px"
										left="-12px"
										top="0"
										bottom="0"
										zIndex="999"
									></Box>
									<Text color="light" fontSize="10px">
										{column.label}
									</Text>
									<Text
										color="dark"
										fontWeight="semibold"
										fontSize="xs"
									>
										{prepareTableCell(item, column)}
									</Text>
								</Flex>
							) : null;
						})}
					</Flex>
					<Flex
						direction="row-reverse"
						w="100%"
						mt="10px"
						gap={3}
						sx={{
							"@media print": {
								display: "none !important",
							},
						}}
					>
						{/* Repeat button */}
						{/* <Button
							// w="80px"
							h="32px"
							fontSize="sm"
							ml="10px"
							disabled
						>
							Repeat
						</Button> */}

						{/* Print Receipt button */}
						<Button
							variant="link"
							fontSize="xs"
							size="md"
							icon="print"
							color="accent.DEFAULT"
							onClick={() => {
								printPage("Receipt (Copy)", isAndroid);
							}}
						>
							Print
						</Button>
						{/* Share button */}
						<Share
							title={`${orgDetail.app_name} | Transaction Receipt (Copy)`}
							text={generateShareMessage(extraColumns, item)}
							variant="link"
							size="md"
							color="accent.DEFAULT"
							labelProps={{ fontSize: "xs" }}
						/>
						{/* Raise Query */}
						{isRaiseIssueAllowed ? (
							<Button
								variant="link"
								fontSize="xs"
								size="md"
								icon="feedback"
								color="accent.DEFAULT"
								iconStyle={{
									size: "20px",
									mr: "3px",
								}}
								onClick={() => {
									// console.log("Raise Issue:::::", item);
									showRaiseIssueDialog({
										origin: "History",
										tid: item.tid,
										tx_typeid: item.tx_typeid,
										status: item.status_id || 0,
										transaction_time: item.datetime,
										// logo:
										metadata: {
											transaction_detail: item,
											// parameters_formatted:
											pre_msg_template:
												"Transaction History Details",
											post_msg_template: "",
										},
									});
								}}
							>
								Report Issue
							</Button>
						) : null}
					</Flex>
				</Flex>
			) : null}
			<Flex pl="42px" direction="row">
				<Text
					fontWeight="semibold"
					textColor="accent.DEFAULT"
					fontSize={{ base: "sm" }}
					mt="10px"
					sx={{
						"@media print": {
							display: "none !important",
						},
					}}
					onClick={() => toggleExpand()}
				>
					...{expanded ? "Show Less" : "Show More"}
				</Text>
			</Flex>
		</>
	);
};

export default HistoryCard;
