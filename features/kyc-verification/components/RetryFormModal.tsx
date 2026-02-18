/**
 * RetryFormModal - Modal component for retrying failed KYC verifications.
 * Renders ServiceFormPage in a modal with callback support for results.
 * Preserves successful results while allowing user to edit and retry failed ones.
 */

import {
	Modal as ChakraModal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useBreakpointValue,
} from "@chakra-ui/react";
import type { VerificationResult, VerificationService } from "../types";
import { ServiceFormPageModal } from "./ServiceFormPageModal";

interface RetryFormModalProps {
	/** Whether the modal is open */
	isOpen: boolean;
	/** Callback when modal is closed */
	onClose: () => void;
	/** Services that failed and need to be retried */
	failedServices: VerificationService[];
	/** Original form data to prefill the form */
	formData: Record<string, unknown>;
	/** Callback when retry verification completes */
	onRetryComplete: (_results: VerificationResult[]) => void;
	/** Callback when form data is edited (to track changes across modal open/close cycles) */
	onFormDataChange?: (_formData: Record<string, unknown>) => void;
	/** Base path for navigation if needed */
	basePath?: string;
}

/**
 * Modal component for retrying failed KYC verifications.
 * Displays ServiceFormPage in a modal context with retry-specific handling.
 * @param {RetryFormModalProps} props - Component props
 * @returns {JSX.Element} Rendered retry modal with form
 */
export const RetryFormModal = ({
	isOpen,
	onClose,
	failedServices,
	formData,
	onRetryComplete,
	onFormDataChange,
	basePath = "/products/kyc-verification",
}: RetryFormModalProps): JSX.Element => {
	const modalSize = useBreakpointValue({ base: "full", md: "xl" });

	// Get service codes from failed services
	const serviceCodes = failedServices.map((s) => s.serviceCode);

	return (
		<ChakraModal
			isOpen={isOpen}
			onClose={onClose}
			size={modalSize}
			scrollBehavior="inside"
			closeOnOverlayClick={false}
		>
			<ModalOverlay />
			<ModalContent
				maxH={{ base: "100vh", md: "90vh" }}
				my={{ base: 0, md: 4 }}
			>
				<ModalHeader
					borderBottom="1px"
					borderColor="divider"
					fontSize="lg"
					fontWeight="semibold"
					py={4}
				>
					{failedServices.length === 1
						? `Retry ${failedServices[0].name}`
						: `Retry ${failedServices.length} Failed Services`}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody p={0} overflow="auto">
					<ServiceFormPageModal
						serviceCodes={serviceCodes}
						initialFormData={formData}
						isRetryMode={true}
						onSubmitComplete={onRetryComplete}
						onCancel={onClose}
						onFormDataChange={onFormDataChange}
						basePath={basePath}
					/>
				</ModalBody>
			</ModalContent>
		</ChakraModal>
	);
};

export default RetryFormModal;
