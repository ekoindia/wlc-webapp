import { Box, Center, Heading } from "@chakra-ui/react";
import { Button } from "components";
import React from "react";

/**
 * An ErrorBoundary component to catch JavaScript errors anywhere
 * in their child component tree, log those errors, and display
 * a fallback UI.
 * @see https://reactjs.org/docs/error-boundaries.html
 */
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);

		// Define a state variable to track whether is an error or not
		this.state = {
			hasError: false,
			ignoreError: props.ignoreError || false,
		};
	}

	static getDerivedStateFromError(/* error */) {
		// Update state so the next render will show the fallback UI
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
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
					>
						<Heading size="lg" mb={6}>
							Oops, something went wrong!
						</Heading>
						<Button
							onClick={() => this.setState({ hasError: false })}
						>
							Try again?
						</Button>
					</Box>
				</Center>
			);
		}

		// Return children components in case of no error
		return this.props.children;
	}
}

export default ErrorBoundary;
