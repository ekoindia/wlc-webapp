import {
	Box,
	Flex,
	Heading,
	Image,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { Card } from "components";
import useFileView from "hooks/useFileView";
import { useCallback } from "react";
import { blobToImageSrc } from "utils/fileUtils";

/**
 * Document type mapping for display names
 */
const DOCUMENT_DISPLAY_NAMES = {
	customer_photo: "Customer Photo",
	aadhar_front: "Aadhaar Card Front",
	aadhar_back: "Aadhaar Card Back",
	pan_card: "PAN Card",
} as const;

/**
 * Ordered array of document types to control display order
 */
const DOCUMENT_ORDER: DocumentType[] = [
	"customer_photo",
	"aadhar_front",
	"aadhar_back",
	"pan_card",
];

type DocumentType = keyof typeof DOCUMENT_DISPLAY_NAMES;

/**
 * Interface for document data from API response
 */
interface DocumentData {
	aadhar_front?: string;
	aadhar_back?: string;
	pan_card?: string;
	customer_photo?: string;
}

/**
 * Interface for processed document with display information
 */
interface ProcessedDocument {
	type: DocumentType;
	displayName: string;
	imageSrc: string;
}

interface DocPaneProps {
	/** Document data from API response containing blob data */
	documentData?: DocumentData | null;
	/** Optional classes to pass to this component */
	className?: string;
}

/**
 * A DocPane component that displays document previews when documents are available
 * @param {DocPaneProps} props - Properties passed to the component
 * @returns {JSX.Element | null} The rendered component or null if no documents are present
 * @example
 * ```tsx
 * <DocPane documentData={agentDocuments} />
 * ```
 */
const DocPane = ({ documentData, className }: DocPaneProps) => {
	const { showImage } = useFileView();

	/**
	 * Handles clicking on a document row to show image in popup
	 * @param {string} imageSrc - The image source URL to display
	 * @param {string} displayName - The document display name for context
	 */
	const handleDocumentClick = useCallback(
		(imageSrc: string, displayName: string) => {
			showImage(imageSrc, displayName);
		},
		[showImage]
	);

	/**
	 * Checks if any documents are present in the CSP details
	 * @param {DocumentData | null | undefined} cspDetails - Document data from API response
	 * @returns {boolean} True if at least one document is present
	 */
	const hasDocuments = (
		cspDetails: DocumentData | null | undefined
	): boolean => {
		if (!cspDetails) return false;

		return Object.values(cspDetails).some(
			(value) => value != null && value !== ""
		);
	};

	/**
	 * Processes document data from API response and returns array of available documents in specified order
	 * @param {DocumentData} cspDetails - Document data from API response
	 * @returns {ProcessedDocument[]} Array of processed documents with display information in desired order
	 */
	const processDocuments = (
		cspDetails: DocumentData
	): ProcessedDocument[] => {
		const documents: ProcessedDocument[] = [];

		// Process documents in the specified order
		DOCUMENT_ORDER.forEach((documentType) => {
			const value = cspDetails[documentType];
			if (value) {
				documents.push({
					type: documentType,
					displayName: DOCUMENT_DISPLAY_NAMES[documentType],
					imageSrc: blobToImageSrc(value),
				});
			}
		});

		return documents;
	};

	// Early return if no documents are present
	if (!hasDocuments(documentData)) {
		return null;
	}

	const documents: ProcessedDocument[] = processDocuments(documentData!);

	return (
		<Card className={className}>
			<Heading
				fontSize={{ base: 20, md: 15, lg: 17, xl: 18 }}
				fontWeight="semibold"
				color="light"
				mt="5px"
			>
				Document Center
			</Heading>

			<Flex direction="column">
				<Box h="474px" fontSize={{ base: 16, md: 14, lg: 16 }}>
					<Stack direction="column" divider={<StackDivider />} mt="5">
						{documents.map((document) => (
							<Box
								display="flex"
								alignContent="center"
								justifyContent="space-between"
								key={document.type}
								my="5px"
								onClick={() =>
									handleDocumentClick(
										document.imageSrc,
										document.displayName
									)
								}
								cursor="pointer"
								_hover={{
									backgroundColor: "focusbg",
									borderRadius: "5px",
								}}
								p="8px"
								transition="background-color 0.2s ease"
							>
								<Flex align="center">
									<Image
										src={document.imageSrc}
										alt={`${document.displayName} preview`}
										h={42}
										w={42}
										borderRadius="5"
										objectFit="cover"
										fallbackSrc="/images/seller_logo.jpg"
									/>
									<Box ml="12px">
										<Text>{document.displayName}</Text>
									</Box>
								</Flex>
							</Box>
						))}
					</Stack>
				</Box>
			</Flex>
		</Card>
	);
};

export default DocPane;
