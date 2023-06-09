import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";

/**
 * A <CommissionsPagination> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<CommissionsPagination></CommissionsPagination>` TODO: Fix example
 */
const CommissionsPagination = ({ hasNext, currentPage, setCurrentPage }) => {
	return (
		<Flex
			gap={6}
			mt="20px"
			mb={{ base: "30px", "2xl": "0px" }}
			fontSize={{ base: "14px", "2xl": "18px" }}
		>
			<Flex
				cursor="pointer"
				onClick={() => {
					setCurrentPage(
						currentPage + 1 !== 1 ? currentPage - 1 : currentPage
					);
				}}
			>
				<Icon
					name="chevron-left"
					size={{ base: "15px", "2xl": "20px" }}
					color={currentPage + 1 === 1 ? "hint" : "dark"}
				/>
			</Flex>
			<Text userSelect="none">{currentPage + 1}</Text>
			<Flex
				cursor="pointer"
				onClick={() => {
					setCurrentPage(hasNext ? currentPage + 1 : currentPage);
				}}
			>
				<Icon
					name="chevron-right"
					width={{ base: "15px", "2xl": "20px" }}
					color={hasNext ? "dark" : "hint"}
				/>
			</Flex>
		</Flex>
	);
};

export default CommissionsPagination;
