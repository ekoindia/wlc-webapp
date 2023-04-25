import { Center, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";

/**
 * A <HistoryPagination> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<HistoryPagination></HistoryPagination>` TODO: Fix example
 */
const HistoryPagination = ({ hasNext, currentPage, setCurrentPage }) => {
	return (
		<Flex
			gap={6}
			mt="20px"
			mb={{ base: "30px", "2xl": "0px" }}
			fontSize={{ md: "14px", "2xl": "18px" }}
		>
			<Flex
				cursor="pointer"
				onClick={() => {
					setCurrentPage(
						currentPage + 1 !== 1 ? currentPage - 1 : currentPage
					);
				}}
			>
				<Center
					height="100%"
					width={{ md: "15px", "2xl": "20px" }}
					color={currentPage + 1 === 1 ? "hint" : "dark"}
				>
					<Icon name="chevron-left" width="100%" />
				</Center>
			</Flex>
			<Text userSelect="none">{currentPage + 1}</Text>
			<Flex
				cursor="pointer"
				onClick={() => {
					setCurrentPage(hasNext ? currentPage + 1 : currentPage);
				}}
			>
				<Center
					height="100%"
					width={{ md: "15px", "2xl": "20px" }}
					color={hasNext ? "dark" : "hint"}
				>
					<Icon name="chevron-right" width="100%" />
				</Center>
			</Flex>
		</Flex>
	);
};

export default HistoryPagination;
