import {
	Box,
	Divider,
	Flex,
	Skeleton,
	Td as ChakraTd,
	Text,
	Tr as ChakraTr,
} from "@chakra-ui/react";
import { DisplayMedia } from "constants";
import { Fragment, useState } from "react";
import { prepareTableCell } from ".";
import { Button } from "..";

/**
 * Show the column on screen?
 * @param {number} display_media_id
 * @returns
 */
const showOnScreen = (display_media_id) => {
	display_media_id = display_media_id ?? DisplayMedia.BOTH;
	return (
		display_media_id === DisplayMedia.SCREEN ||
		display_media_id === DisplayMedia.BOTH
	);
};

/**
 * Show the column in print?
 * @param {number} display_media_id
 * @returns
 */
const showInPrint = (display_media_id) => {
	display_media_id = display_media_id ?? DisplayMedia.BOTH;
	return (
		display_media_id === DisplayMedia.PRINT ||
		display_media_id === DisplayMedia.BOTH
	);
};

/**
 * A Tr component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Tr></Tr>` TODO: Fix example
 */
const Tr = ({
	data,
	renderer,
	onRowClick,
	pageNumber,
	tableRowLimit,
	tableName,
	visibleColumns,
	isLoading,
	printExpansion = false,
}) => {
	const [expandedRow, setExpandedRow] = useState(null);

	const visible = visibleColumns > 0;

	const main = visible
		? [
				{ field: "", show: "ExpandButton" },
				...(renderer?.slice(0, visibleColumns) ?? []),
		  ]
		: renderer;

	const extra = visible ? renderer?.slice(visibleColumns) : [];
	// const printExtras =
	// 	tableName === "History"
	// 		? [{ name: "trx_name", field: "Transaction" }]
	// 		: [];

	console.log("visibleColumns", extra);

	const handleRowClick = (index) => {
		if (visible) {
			setExpandedRow(index === expandedRow ? null : index);
		} else if (onRowClick !== undefined) {
			onRowClick(data[index]);
		}
	};

	if (!isLoading) {
		return data?.map((item, index) => {
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
									printExpansion === true
										? "none !important"
										: null,
							},
						}}
					>
						{main?.map((column, rendererIndex) => {
							return (
								<ChakraTd
									p={{ base: ".5em", xl: "1em" }}
									key={`td-${rendererIndex}-${column.field}-${serialNumber}`}
								>
									{prepareTableCell(
										item,
										column,
										index,
										serialNumber,
										tableName,
										expandedRow
									)}
								</ChakraTd>
							);
						})}
					</ChakraTr>
					{/* For Expanded Row */}
					{visible && expandedRow === index && (
						<ChakraTd
							colSpan={main.length}
							bg={index % 2 ? "shade" : "initial"}
							pl={{ base: 0, md: "40px" }}
							pr="10px"
							sx={{
								"@media print": {
									bg: "initial",
									p: 0,
								},
							}}
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
									{extra?.map((column, rendererIndex) => {
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

										// <Fragment
										// 	key={`tdexp-${rendererIndex}-${column.field}-${serialNumber}`}
										// >

										return item[column.name] ? (
											<Flex
												key={`tdexp-${rendererIndex}-${column.field}-${serialNumber}`}
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
												<Text
													textColor="light"
													fontSize="xxs"
												>
													{column.field}
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

										/* {rendererIndex <
												extra.length - 1 && (
												<Divider
													orientation="vertical"
													h="auto"
													display={dispScreen}
													sx={{
														"@media print": {
															display:
																dispPrint,
														},
													}}
												/>
											)} */
									})}
								</Flex>
								{/* "Repeat Transaction" button for History table only, need to update logic in future */}
								{tableName === "History" && (
									<Button
										fontSize="xs"
										size="md"
										disabled
										sx={{
											"@media print": {
												display: "none !important",
											},
										}}
									>
										Repeat Transaction
									</Button>
								)}
							</Flex>
						</ChakraTd>
					)}
				</Fragment>
			);
		});
	} else {
		return Array(5)
			.fill(Math.random())
			.map((item, index) => (
				<ChakraTr key={`${item}-${index}`}>
					{main?.map((column, index) => (
						<ChakraTd
							p={{ base: ".5em", xl: "1em" }}
							key={`${column.field}-${index}`}
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
};

export default Tr;
