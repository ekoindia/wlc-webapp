import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "..";

/**
 * A custom Tag component to help multiselect component to render selected options as closable tag
 * @param {*} param0
 * @returns
 */
const Tag = ({ key, value, label, onDelete }) => {
	return (
		<Flex
			gap={4}
			key={key}
			bg="#EEF1FF"
			maxW="fit-content"
			align="center"
			justify="center"
			p="4px 12px"
			borderRadius="5px"
		>
			<Text fontSize="xs" textColor="light" whiteSpace="nowrap">
				{label}
			</Text>
			<Icon
				name="close"
				size="8px"
				color="primary.dark"
				onClick={(event) => {
					onDelete(value);
					event.stopPropagation();
				}}
			/>
		</Flex>
	);
};

export default Tag;
