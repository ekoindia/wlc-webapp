import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
} from "@chakra-ui/react";
import { Button } from "components";

const CommonModal = ({
	isOpen,
	onClose,
	title,
	children,
	onSubmit,
	submitText,
	disabled,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>{children}</ModalBody>
				<ModalFooter>
					<Button onClick={onSubmit} isDisabled={disabled} w="100%">
						{disabled ? <Spinner /> : submitText}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CommonModal;
