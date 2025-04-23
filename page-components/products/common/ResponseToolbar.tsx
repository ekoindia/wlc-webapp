import { Flex, useToast } from "@chakra-ui/react";
import { Button } from "components";
import { ReactNode } from "react";

interface ResponseToolbarProps<T> {
	/**
	 * Function to handle going back to previous page
	 */
	onBack: () => void;

	/**
	 * Function to handle resetting the form state
	 */
	onReset: () => void;

	/**
	 * Data object to copy as JSON when Copy JSON button is clicked
	 */
	data?: T;

	/**
	 * Text to show on the reset button
	 * @default "Verify Another"
	 */
	resetButtonText?: string;

	/**
	 * Optional children to render between Back button and action buttons
	 */
	children?: ReactNode;
}

/**
 * A reusable toolbar for API response cards with Back, Copy JSON, and Reset actions
 * @param root0
 * @param root0.onBack
 * @param root0.onReset
 * @param root0.data
 * @param root0.resetButtonText
 * @param root0.children
 * @template T - Type of data to be copied as JSON
 */
const ResponseToolbar = <T extends Record<string, any>>({
	onBack,
	onReset,
	data,
	resetButtonText = "Verify Another",
	children,
}: ResponseToolbarProps<T>): JSX.Element => {
	const toast = useToast();

	/**
	 * Copies the response data as formatted JSON to clipboard
	 */
	const handleCopyJson = (): void => {
		if (data) {
			navigator.clipboard
				.writeText(JSON.stringify(data, null, 2))
				.then(() => {
					toast({
						title: "Copied to clipboard",
						description: "JSON data has been copied to clipboard",
						status: "success",
						duration: 3000,
						isClosable: true,
						position: "bottom-right",
					});
				})
				.catch((error) => {
					console.error("Failed to copy: ", error);
					toast({
						title: "Copy failed",
						description: "Could not copy data to clipboard",
						status: "error",
						duration: 3000,
						isClosable: true,
						position: "bottom-right",
					});
				});
		}
	};

	return (
		<Flex
			mt={6}
			pt={4}
			justifyContent="space-between"
			borderTop="1px"
			borderTopColor="gray.200"
			flexWrap="wrap"
			gap={2}
		>
			<Button variant="outline" icon="arrow-back" onClick={onBack}>
				Back
			</Button>

			{children}

			<Flex gap={2}>
				{data ? (
					<Button
						variant="outline"
						icon="content-copy"
						onClick={handleCopyJson}
					>
						Copy JSON
					</Button>
				) : null}
				<Button
					variant="outline"
					icon="refresh"
					iconPosition="right"
					onClick={onReset}
				>
					{resetButtonText}
				</Button>
			</Flex>
		</Flex>
	);
};

ResponseToolbar.displayName = "ResponseToolbar";

export default ResponseToolbar;
