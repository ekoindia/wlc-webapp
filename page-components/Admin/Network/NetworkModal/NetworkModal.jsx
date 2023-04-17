import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useDisclosure,
} from "@chakra-ui/react";
import { Button } from "components/Button";

/**
 * A <NetworkModal> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkModal></NetworkModal>`
 */
const NetworkModal = ({ className = "", ...props }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Button onClick={onOpen}>Open Modal</Button>

			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalOverlay />
				<ModalContent
					width={{ base: "100%", md: "465px" }}
					height="auto"
				>
					<ModalHeader>Mark Inactive</ModalHeader>
					<ModalCloseButton color="#D2D2D2" size="lg" />
					<ModalBody>
						<Text>Reason for marking inactive</Text>
						<Textarea
							width="100%"
							h={{ base: "200px", md: "250px" }}
							borderRadius={20}
							resize="none"
							maxLength={400}
							fontSize={{ base: "14px", md: "16px" }}
						/>
					</ModalBody>
					<ModalFooter
						justifyContent="center"
						paddingBottom={{ base: 4, md: 8 }}
					>
						<Button
							h={{ base: "44px", md: "56px" }}
							width="100%"
							fontSize={{ base: "14px", md: "16px" }}
							onClick={onClose}
						>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default NetworkModal;
