import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import { Button } from "components";

const CommonModal = ({
	isOpen,
	onClose,
	title,
	children,
	onSubmit,
	submitText,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>{children}</ModalBody>
				<ModalFooter>
					<Button onClick={onSubmit} w="100%">
						{submitText}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CommonModal;
