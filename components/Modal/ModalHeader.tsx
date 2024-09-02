import { Flex, Text } from "@chakra-ui/react";
import { IcoButton } from "components";

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
		<Flex align="center" justify="space-between" px="6">
			<Text fontSize="lg" fontWeight="semibold" userSelect="none">
				{title}
			</Text>
			<IcoButton
				size="sm"
				iconName="close"
				iconSize="xs"
				color="light"
				theme="ghost"
				_hover={{ color: "error" }}
				_active={{ color: "error" }}
				onClick={onClose}
			/>
		</Flex>
	);
};

export default ModalHeader;
