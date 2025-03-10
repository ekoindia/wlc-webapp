import {
	Box,
	Td as ChakraTd,
	Tr as ChakraTr,
	Divider,
	Flex,
	keyframes,
	Skeleton,
	Text,
} from "@chakra-ui/react";
import { Button, Share } from "components";
import { useMenuContext, useOrgDetailContext } from "contexts";
import { useFeatureFlag, useRaiseIssue } from "hooks";
import useHslColor from "hooks/useHslColor";
import { Fragment, useEffect, useState } from "react";
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

const Tbody = ({
	data,
	mainColumns,
	extraColumns,
	// onRowClick,
	pageNumber,
	tableRowLimit,
	isLoading,
	printExpansion = false,
	expandedRow,
	setExpandedRow,
}) => {
	const { interactions } = useMenuContext();
	const { trxn_type_prod_map } = interactions;
	const [isExpandable, setIsExpandable] = useState(false); // Is the row expandable (i.e, has extra columns)
	const [columns, setColumns] = useState([]); // Fields to show in the table columns

	/**
	 * Set columns to show in the table.
	 * Also, Set isExpandable to true if there are extra columns.
	 * Also, add an extra column to the mainColumns for the expand button.
	 */
	useEffect(() => {
		setIsExpandable(extraColumns?.length > 0);

		// Set the columns to show in the table
		setColumns(
			extraColumns?.length > 0
				? [
						{
							label: "",
							show: "ExpandButton",
							width: "35px",
						},
						...mainColumns,
					]
				: mainColumns
		);
	}, [mainColumns, extraColumns]);

	const handleRowClick = (index) => {
		if (isExpandable) {
			setExpandedRow(index === expandedRow ? null : index);
		}
		// else if (onRowClick !== undefined) {
		// 	onRowClick(data[index]);
		// }
	};

	// Show the skeleton loader if data is loading...
	if (isLoading) {
		return Array(5)
			.fill(Math.random())
			.map((item, index) => (
				<ChakraTr key={`${item}-${index}`}>
					{columns?.map((column, index) => (
						<ChakraTd
							p={{ base: ".5em", xl: "1em" }}
							key={`${column.label}-${index}`}
						>
							<Skeleton
								h="1em"
								// w={`${Math.floor(Math.random() * 100)}%`}
								w="60%"
							/>
						</ChakraTd>
					))}
				</ChakraTr>
			));
	}

	return data?.map((item, index) => (
		<Trow
			key={index}
			{...{
				item,
				index,
				mainColumns: columns,
				extraColumns,
				handleRowClick,
				pageNumber,
				tableRowLimit,
				printExpansion,
				expandedRow,
				trxn_type_prod_map,
			}}
		/>
	));
};

/**
 * A Tbody component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @param prop.item
 * @param prop.index
 * @param prop.mainColumns
 * @param prop.extraColumns
 * @param prop.handleRowClick
 * @param prop.pageNumber
 * @param prop.tableRowLimit
 * @param prop.printExpansion
 * @param prop.expandedRow
 * @param prop.trxn_type_prod_map
 * @example	`<Tbody></Tbody>` TODO: Fix example
 */
const Trow = ({
	item,
	index,
	mainColumns,
	extraColumns,
	handleRowClick,
	pageNumber,
	tableRowLimit,
	printExpansion = false,
	expandedRow,
	trxn_type_prod_map,
}) => {
	const txicon = trxn_type_prod_map?.[item.tx_typeid]?.icon || null;
	const { h } = useHslColor(item.tx_name);
	const { orgDetail } = useOrgDetailContext();
	const [isRaiseIssueAllowed] = useFeatureFlag("RAISE_ISSUE");
	const { showRaiseIssueDialog } = useRaiseIssue();

	const serialNumber =
		index + pageNumber * tableRowLimit - (tableRowLimit - 1);

	return (
		<Fragment key={`tr${serialNumber}`}>
			<ChakraTr
				onClick={() => handleRowClick(index)}
				fontSize={{ base: "10px", xl: "12px", "2xl": "16px" }}
				sx={{
					"@media print": {
						display:
							printExpansion === true ? "none !important" : null,
					},
				}}
			>
				{mainColumns?.map((column, rendererIndex) => {
					const bg =
						index % 2
							? column?.alternateBg || "initial"
							: column?.bg || "initial";
					return (
						<ChakraTd
							p={{ base: "0.2em 0.4em", xl: "0.6em 1em" }}
							w={column.width || "auto"}
							key={`td-${rendererIndex}-${column.label}-${serialNumber}`}
							_notFirst={{
								borderLeft: "1px solid #dadada",
							}}
							bg={bg}
							isNumeric={
								column?.parameter_type_id === 9 ? true : false
							}
							textAlign={
								column?.parameter_type_id === 9
									? "right"
									: "left"
							}
						>
							{prepareTableCell(
								item,
								column,
								index,
								serialNumber,
								expandedRow,
								txicon,
								h
							)}
						</ChakraTd>
					);
				})}
			</ChakraTr>
			{/* For Expanded Row */}
			{expandedRow === index && (
				<ChakraTd
					colSpan={mainColumns.length}
					// bg="focusbg"
					bg={index % 2 ? "shade" : "initial"}
					pl={{ base: 0, md: "40px" }}
					pr="10px"
					sx={{
						"@media print": {
							bg: "initial",
							p: 0,
						},
					}}
					animation={`${animSlideDown} ease-out 0.2s forwards`}
				>
					<Divider
						sx={{
							"@media print": {
								display: "none !important",
							},
						}}
					/>
					<Text
						fontWeight="semibold"
						fontSize="xs"
						textColor="light"
						my="2"
						sx={{
							"@media print": {
								display: "none !important",
							},
						}}
					>
						Other Details
					</Text>
					<Flex w="100%" justify="space-between" gap="3">
						<Flex
							key={index}
							justify="flex-start"
							w="100%"
							wrap="wrap"
							fontSize={{
								base: "10px",
								xl: "12px",
							}}
							gap="24px"
							overflow="hidden"
							sx={{
								"@media print": {
									mb: "12px",
								},
							}}
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
										key={`tdexp-${rendererIndex}-${column.label}-${serialNumber}`}
										position="relative"
										direction="column"
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
											backgroundColor="gray.300"
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
											fontWeight="semibold"
											fontSize="xs"
										>
											{prepareTableCell(
												item,
												column,
												index
											)}
										</Text>
									</Flex>
								) : null;
							})}
						</Flex>

						<Flex
							direction="column"
							align="flex-start"
							gap={3}
							sx={{
								"@media print": {
									display: "none !important",
								},
							}}
						>
							{/* "Repeat Transaction" button */}
							{/* <Button fontSize="xs" size="md" disabled>
										Repeat Transaction
									</Button> */}
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
							{/* Print Receipt button */}
							<Button
								variant="link"
								fontSize="xs"
								size="md"
								icon="print"
								color="accent.DEFAULT"
								onClick={() => {
									printPage("Receipt (Copy)");
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
								iconProps={{ size: "22px" }}
							/>
						</Flex>
					</Flex>
				</ChakraTd>
			)}
		</Fragment>
	);
};

export default Tbody;
