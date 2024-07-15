import {
	Modal as ChakraModal,
	ModalProps as ChakraModalProps,
	ModalBody,
	ModalContent,
	ModalOverlay,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { ModalHeader } from ".";

interface ModalProps extends Omit<ChakraModalProps, "children"> {
	id?: string;
	size?: ChakraModalProps["size"];
	children: ReactNode;
	title: string;
	isOpen: boolean;
	onClose: () => void;
	finalFocusRef?: ChakraModalProps["finalFocusRef"];
	isCentered?: boolean;
	motionPreset?: ChakraModalProps["motionPreset"];
}

/**
 * A Modal component that uses Chakra UI's Modal components.
 * @component
 * @param {ModalProps} props - Properties passed to the component.
 * @param {string} [props.id] - The ID of the modal.
 * @param {string} [props.size] - The size of the modal. Can be 'xs', 'sm', 'md', 'lg', or a custom size string.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal.
 * @param {string} props.title - The title of the modal header.
 * @param {boolean} props.isOpen - Boolean indicating whether the modal is open.
 * @param {Function} props.onClose - Function to be called when the modal is closed.
 * @param {React.RefObject<HTMLElement>} [props.finalFocusRef] - The element to receive focus when the modal closes.
 * @param {boolean} [props.isCentered] - Boolean indicating whether the modal should be centered.
 * @param {string} [props.motionPreset] - The motion preset for modal animation.
 * @param {...object} rest - Additional properties passed to the Chakra UI Modal component.
 * @example
 * <Modal
 *   id="myModal"
 *   size="md"
 *   title="Modal Title"
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   isCentered={true}
 * >
 *   <p>Modal Content</p>
 * </Modal>
 */
const Modal = ({
	id,
	size,
	children,
	title,
	isOpen,
	onClose,
	finalFocusRef,
	isCentered = true,
	motionPreset = "slideInBottom",
	...rest
}: ModalProps): JSX.Element => {
	return (
		<ChakraModal
			{...{
				id,
				size,
				isOpen,
				onClose,
				motionPreset,
				isCentered,
				finalFocusRef,
			}}
			{...rest}
		>
			<ModalOverlay />
			<ModalContent py="4">
				<ModalHeader {...{ title, onClose }} />
				<ModalBody>{children}</ModalBody>
			</ModalContent>
		</ChakraModal>
	);
};

export default Modal;
