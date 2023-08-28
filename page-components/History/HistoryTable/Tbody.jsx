import {
	Box,
	Divider,
	Flex,
	keyframes,
	Skeleton,
	Td as ChakraTd,
	Text,
	Tr as ChakraTr,
} from "@chakra-ui/react";
import { Button } from "components";
import { useMenuContext } from "contexts";
import useHslColor from "hooks/useHslColor";
import { Fragment } from "react";
import { printPage } from "utils";
import { prepareTableCell, showInPrint, showOnScreen } from ".";

const animSlideDown = keyframes`
	from {opacity: 0; transform: scaleY(0); transform-origin:top;}
	to {opacity: 1; transform: none; transform-origin:top;}
`;

const Tbody = ({
	data,
	renderer,
	// onRowClick,
	pageNumber,
	tableRowLimit,
	visibleColumns,
	isLoading,
	printExpansion = false,
	expandedRow,
	setExpandedRow,
}) => {
	const { interactions } = useMenuContext();
	const { trxn_type_prod_map } = interactions;

	const visible = visibleColumns > 0;

	const mainColumns = visible
		? [
				{ label: "", show: "ExpandButton" },
				...(renderer?.slice(0, visibleColumns) ?? []),
		  ]
		: renderer;

	const extraColumns = visible ? renderer?.slice(visibleColumns) : [];
	// const printExtras = [{ name: "trx_name", label: "Transaction" }]

	const handleRowClick = (index) => {
		if (visible) {
			setExpandedRow(index === expandedRow ? null : index);
		}
		// else if (onRowClick !== undefined) {
		// 	onRowClick(data[index]);
		// }
	};

	if (isLoading) {
		return Array(5)
			.fill(Math.random())
			.map((item, index) => (
				<ChakraTr key={`${item}-${index}`}>
					{mainColumns?.map((column, index) => (
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
				mainColumns,
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
					return (
						<ChakraTd
							p={{ base: ".5em", xl: "1em" }}
							key={`td-${rendererIndex}-${column.label}-${serialNumber}`}
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
							{/* Print Receipt button */}
							<Button
								variant="link"
								fontSize="xs"
								size="md"
								icon="print"
								pt="10px"
								color="accent.DEFAULT"
								onClick={() => {
									printPage("Receipt (copy)");
								}}
							>
								Print
							</Button>
						</Flex>
					</Flex>
				</ChakraTd>
			)}
		</Fragment>
	);
};

export default Tbody;
