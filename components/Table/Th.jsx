import { Flex, Th as ChakraTh } from "@chakra-ui/react";

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
				{ label: "", show: "ExpandButton" },
				...(renderer?.slice(0, visibleColumns) ?? []),
		  ]
		: renderer;

	return main.map((item, index) => (
		<ChakraTh
			key={index}
			p={{ base: ".5em", xl: "1em" }}
			fontSize={{ base: "xxs", lg: "xs" }}
		>
			<Flex gap="2" align="center">
				{item.label}
				{/* {item.sorting && <Icon name="sort" size="8px" />} */}
			</Flex>
		</ChakraTh>
	));
};

export default Th;
