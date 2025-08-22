import {
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import { Button } from "components";

interface ConfirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	isLoading?: boolean;
}

export const ConfirmDialog = ({
	isOpen,
	onClose,
	onConfirm,
	title = "Confirm Action",
	message = "Are you sure you want to proceed?",
	confirmText = "Confirm",
	cancelText = "Cancel",
	isLoading = false,
}: ConfirmDialogProps): JSX.Element => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					<Text>{message}</Text>
				</ModalBody>

				<ModalFooter>
					<HStack spacing={3}>
						<Button
							variant="ghost"
							onClick={onClose}
							disabled={isLoading}
						>
							{cancelText}
						</Button>
						<Button
							variant="primary"
							colorScheme="red"
							onClick={onConfirm}
							loading={isLoading}
							disabled={isLoading}
						>
							{confirmText}
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
