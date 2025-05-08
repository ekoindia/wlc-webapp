import { Box, Center, Code, Heading, HStack, Text } from "@chakra-ui/react";
import { Button } from "components";
// import { useUser } from "contexts";
// import { useRaiseIssue } from "hooks";
import React from "react";

/**
 * An ErrorBoundary component to catch JavaScript errors anywhere
 * in their child component tree, log those errors, and display
 * a fallback UI.
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);

		// Define a state variable to track whether is an error or not
		this.state = {
			hasError: false,
			ignoreError: props.ignoreError || false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(/* error */) {
		// Update state so the next render will show the fallback UI
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// Store error details in state for display
		this.setState({
			error,
			errorInfo,
		});

		// Use your own error logging service here
		console.error("[ErrorBoundary]", {
			ignoreError: this.state.ignoreError,
			error,
			errorInfo,
		});
	}

	render() {
		// Check if the error is thrown
		if (this.state.hasError && !this.state.ignoreError) {
			// You can render any custom fallback UI
			return (
				<Center h="100vh" w="100%">
					<Box
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						maxWidth="800px"
						width="90%"
					>
						<Heading size="lg" mb={6}>
							Oops, something went wrong!
						</Heading>
						<ErrorActions
							error={this.state.error}
							errorInfo={this.state.errorInfo}
							onReset={() => this.setState({ hasError: false })}
						/>

						<ErrorDetails
							error={this.state.error}
							errorInfo={this.state.errorInfo}
						/>
					</Box>
				</Center>
			);
		}

		// Return children components in case of no error
		return this.props.children;
	}
}

/**
 * Action buttons for the error boundary fallback UI
 * @component
 * @param {object} props - Component props
//  * @param {Error} props.error - The error that was caught
//  * @param {object} props.errorInfo - The error info with component stack
 * @param {Function} props.onReset - Function to reset the error boundary state
 * @returns {JSX.Element} - Action buttons for the error UI
 */
const ErrorActions = ({ /* error, errorInfo, */ onReset }) => {
	// const { isLoggedIn } = useUser();
	// const { showRaiseIssueDialog } = useRaiseIssue();

	// const handleRaiseIssue = () => {
	// 	showRaiseIssueDialog(
	// 		{
	// 			customIssueType: "Application Error",
	// 			customIssueDetails: {
	// 				desc: "Please provide additional details about what you were doing when this error occurred.",
	// 				category: "Technical Issues",
	// 				sub_category: "Application Error",
	// 				screenshot: 0, // Optional
	// 			},
	// 			origin: "Error-Boundary",
	// 		},
	// 		(result) => {
	// 			// Optional handling of the result
	// 			console.log("Issue reported:", result);
	// 		}
	// 	);
	// };

	return (
		<HStack spacing={4} mb={6}>
			<Button size="lg" onClick={onReset}>
				Try again?
			</Button>

			{/* {isLoggedIn ? (
				<Button
					size="lg"
					variant="outline"
					colorScheme="red"
					onClick={handleRaiseIssue}
				>
					Raise Issue
				</Button>
			) : null} */}
		</HStack>
	);
};

/**
 * Displays detailed error information in a collapsible section
 * @component
 * @param {object} props - Component props
 * @param {Error} props.error - The error that was caught
 * @param {object} props.errorInfo - The error info with component stack
 * @returns {JSX.Element} - Collapsible error details UI
 */
const ErrorDetails = ({ error, errorInfo }) => {
	return (
		<Box
			as="details"
			w="100%"
			border="1px solid"
			borderColor="gray.300"
			borderRadius="md"
			p={2}
			mt={4}
			bg="gray.50"
		>
			<Box as="summary" fontWeight="medium" cursor="pointer" py={2}>
				Error Details
			</Box>
			<Box
				p={4}
				maxHeight="300px"
				overflowY="auto"
				overflowX="auto"
				css={{
					"&::-webkit-scrollbar": {
						width: "8px",
						height: "8px",
					},
					"&::-webkit-scrollbar-track": {
						backgroundColor: "#f1f1f1",
						borderRadius: "4px",
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "#cbd5e0",
						borderRadius: "4px",
					},
					"&::-webkit-scrollbar-thumb:hover": {
						backgroundColor: "#a0aec0",
					},
				}}
			>
				{error && (
					<Box mb={4}>
						<Text fontWeight="bold">Error:</Text>
						<Code display="block" p={2} whiteSpace="pre-wrap">
							{error.toString()}
						</Code>
					</Box>
				)}

				{errorInfo?.componentStack && (
					<Box>
						<Text fontWeight="bold">Trace:</Text>
						<Code display="block" p={2} whiteSpace="pre-wrap">
							{errorInfo.componentStack}
						</Code>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default ErrorBoundary;
