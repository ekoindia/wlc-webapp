import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";

interface ModalHeaderProps {
	title: string;
	onClose: () => void;
}

/**
 * Custom ModalHeader component for the modal.
 * @component
 * @param {ModalHeaderProps} props - Props for the ModalHeader component.
 * @returns {JSX.Element} The rendered ModalHeader component.
 * @example
 * <ModalHeader title="Modal Title" onClose={handleClose} />
 */
const ModalHeader = ({ title, onClose }: ModalHeaderProps): JSX.Element => {
	return (
		<Flex
			w="100%"
			minH="56px"
			align="center"
			justify="space-between"
			px="5"
		>
			<Text fontSize="lg" fontWeight="semibold">
				{title}
			</Text>
			<Flex direction="row-reverse" onClick={onClose} w="20%">
				<Icon
					size="xs"
					name="close"
					color="light"
					_hover={{ color: "error" }}
					_active={{ color: "error" }}
				/>
			</Flex>
		</Flex>
	);
};

export default ModalHeader;
