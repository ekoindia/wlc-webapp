import { Flex, Th as ChakraTh } from "@chakra-ui/react";
import { Icon } from "..";

/**
 * A Th component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Th></Th>` TODO: Fix example
 */
const Th = ({ renderer, visibleColumns, rowExpansion }) => {
	const main = rowExpansion
		? [
				{ field: "", show: "ExpandButton" },
				...(renderer?.slice(0, visibleColumns) ?? []),
		  ]
		: renderer;
	// const _extra = renderer?.slice(visibleColumns);
	return main.map((item, index) => (
		<ChakraTh
			key={index}
			p={{ base: ".5em", xl: "1em" }}
			fontSize={{ base: "10px", xl: "11px", "2xl": "16px" }}
		>
			<Flex gap="2" align="center">
				{item.field}
				{item.sorting && <Icon name="sort" size="8px" />}
			</Flex>
		</ChakraTh>
	));
};

export default Th;
