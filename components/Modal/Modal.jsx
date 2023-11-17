import {
	Modal as ChakraModal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
} from "@chakra-ui/react";
import { Button } from "components";

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	onSubmit,
	submitText,
	disabled,
}) => {
	return (
		<ChakraModal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>{children}</ModalBody>
				{onSubmit && (
					<ModalFooter>
						<Button
							onClick={onSubmit}
							isDisabled={disabled}
							w="100%"
						>
							{disabled ? <Spinner /> : submitText}
						</Button>
					</ModalFooter>
				)}
			</ModalContent>
		</ChakraModal>
	);
};

export default Modal;
