import {
	Divider,
	Flex,
	Td as ChakraTd,
	Text,
	Tr as ChakraTr,
} from "@chakra-ui/react";
import { useState } from "react";
import { prepareTableCell } from ".";

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
	pageLimit,
	tableName,
	visibleColumns,
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

	const handleRowClick = (index) => {
		if (visible) {
			setExpandedRow(index === expandedRow ? null : index);
		} else if (onRowClick !== undefined) {
			onRowClick(data[index]);
		}
	};

	return data?.map((item, index) => {
		const serialNumber = index + pageNumber * pageLimit - (pageLimit - 1);
		return (
			<>
				<ChakraTr
					onClick={() => handleRowClick(index)}
					fontSize={{ base: "10px", xl: "12px", "2xl": "16px" }}
				>
					{main?.map((column, rendererIndex) => {
						return (
							<ChakraTd
								p={{ base: ".5em", xl: "1em" }}
								key={`${rendererIndex}-${column.field}-${serialNumber}`}
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
					>
						<Divider />
						<Text
							fontWeight="medium"
							fontSize="xs"
							textColor="light"
							my="2"
						>
							Other Details
						</Text>
						<Flex
							key={index}
							justify="flex-start"
							w="100%"
							wrap="wrap"
							fontSize={{
								base: "10px",
								xl: "12px",
							}}
							gap="8"
						>
							{extra?.map((column, rendererIndex) =>
								item[column.name] ? (
									<>
										<Flex direction="column">
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
													// serialNumber,
													// tableName,
													// expandedRow
												)}
											</Text>
										</Flex>
										{rendererIndex < extra.length - 1 && (
											<Divider
												orientation="vertical"
												h="auto"
											/>
										)}
									</>
								) : null
							)}
						</Flex>
					</ChakraTd>
				)}
			</>
		);
	});
};

export default Tr;
