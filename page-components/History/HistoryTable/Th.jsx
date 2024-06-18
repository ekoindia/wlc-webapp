import { Flex, Th as ChakraTh } from "@chakra-ui/react";
import { Fragment } from "react";

/**
 * A Th component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @param prop.renderer
 * @param prop.visibleColumns
 * @example	`<Th></Th>` TODO: Fix example
 */
const Th = ({ renderer, visibleColumns }) => {
	const visible = visibleColumns > 0;
	const main = visible
		? [
				{ label: "", show: "ExpandButton" },
				...(renderer?.slice(0, visibleColumns) ?? []),
			]
		: renderer;

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
				fontSize={{ base: "xxs", lg: "xs" }}
				cursor="default"
			>
				<Flex gap="2" align="center">
					{labelContent}
					{/* {item.label} */}
					{/* {item.sorting && <Icon name="sort" size="8px" />} */}
				</Flex>
			</ChakraTh>
		);
	});
};

export default Th;
