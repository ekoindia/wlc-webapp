import { Th as ChakraTh, Flex, Tooltip } from "@chakra-ui/react";
import { Fragment } from "react";

/**
 * A Table Header component for the Transaction History Table
 * @param 	{object}	prop	Properties passed to the component
 * @param	{Array}	prop.columns	Columns passed to the component.
 * @param	{boolean}	prop.isExpandable	Indicates if rows of the table can be expanded. It adds an extra column for the expand button.
 */
const Th = ({ columns, isExpandable }) => {
	const main = isExpandable
		? [
				{ label: "" }, // Extra column for expand button
				...columns,
			]
		: columns;

	return main.map((item, index) => {
		let labelContent = item.label;
		const isMultiLine = /\n/.test(item.label);
		if (isMultiLine) {
			const parts = item.label.split("\n");
			labelContent = (
				<Flex textAlign="center">
					{parts.map((part, index) => (
						<Fragment key={index}>
							{part}
							{index !== parts.length - 1 ? (
								index < 2 ? (
									<br />
								) : (
									" "
								)
							) : null}
						</Fragment>
					))}
				</Flex>
			);
		}
		return (
			<ChakraTh
				key={index}
				p={{
					base: isMultiLine ? "2px .5em" : "4px .5em",
					xl: isMultiLine ? "4px 1em" : "8px 1em",
				}}
				w={item.width || "auto"}
				fontSize={{ base: "xxs", lg: "xs" }}
				cursor="default"
			>
				<Tooltip
					label={item?.desc}
					placement="bottom"
					gutter="18"
					hasArrow
				>
					<Flex align="center" justify="center">
						{labelContent}
						{/* {item.label} */}
						{/* {item.sorting && <Icon name="sort" size="8px" />} */}
					</Flex>
				</Tooltip>
			</ChakraTh>
		);
	});
};

export default Th;
