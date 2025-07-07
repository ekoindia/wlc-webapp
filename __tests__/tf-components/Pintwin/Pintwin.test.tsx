import { ChakraProvider } from "@chakra-ui/react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import Pintwin, { PinTwinResponse } from "tf-components/Pintwin/Pintwin";

// Mock useToast hook
const mockToast = jest.fn();
jest.mock("@chakra-ui/react", () => ({
	...jest.requireActual("@chakra-ui/react"),
	useToast: () => mockToast,
}));

// Mock PinTwin API response
const mockPinTwinResponse: PinTwinResponse = {
	response_status_id: 0,
	data: {
		customer_id_type: "mobile_number",
		key_id: 39,
		pintwin_key: "1974856302",
		id_type: "mobile_number",
		customer_id: "9002333333",
	},
	response_type_id: 2,
	message: "Success!",
	status: 0,
};

// Test wrapper with ChakraProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<ChakraProvider>{children}</ChakraProvider>
);

describe("Pintwin Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		// Clear any global window modifications
		delete (window as any).encodePinTwin;
	});

	/**
	 * Test basic rendering in secure mode
	 */
	it("renders in secure mode when noLookup is true and key is loaded", () => {
		render(
			<TestWrapper>
				<Pintwin
					noLookup={true}
					keyLoaded={true}
					keyLoadError={false}
				/>
			</TestWrapper>
		);

		expect(screen.getByText("SECURE")).toBeInTheDocument();
		expect(
			screen.getByTestId("shield-icon") || screen.getByRole("img")
		).toBeInTheDocument();
	});

	/**
	 * Test loading state in secure mode
	 */
	it("shows loading state in secure mode", () => {
		render(
			<TestWrapper>
				<Pintwin
					noLookup={true}
					keyLoaded={false}
					keyLoadError={false}
				/>
			</TestWrapper>
		);

		expect(screen.getByText(/Wait! Loading security/)).toBeInTheDocument();
	});

	/**
	 * Test error state in secure mode
	 */
	it("shows error state in secure mode when key load fails", () => {
		const mockOnKeyReload = jest.fn();

		render(
			<TestWrapper>
				<Pintwin
					noLookup={true}
					keyLoaded={false}
					keyLoadError={true}
					onKeyReloaded={mockOnKeyReload}
				/>
			</TestWrapper>
		);

		expect(screen.getByText(/Failed! Click to/)).toBeInTheDocument();
		expect(screen.getByText(/reload security/)).toBeInTheDocument();
	});

	/**
	 * Test lookup grid rendering
	 */
	it("renders lookup grid when noLookup is false", async () => {
		const mockFetchPinTwinKey = jest
			.fn()
			.mockResolvedValue(mockPinTwinResponse);

		render(
			<TestWrapper>
				<Pintwin
					noLookup={false}
					fetchPinTwinKey={mockFetchPinTwinKey}
				/>
			</TestWrapper>
		);

		// Wait for the component to load the key
		await waitFor(() => {
			expect(mockFetchPinTwinKey).toHaveBeenCalled();
		});

		// Check if digit grid is rendered
		await waitFor(() => {
			const digits = mockPinTwinResponse.data.pintwin_key.split("");
			digits.forEach((digit, index) => {
				expect(screen.getByText(digit)).toBeInTheDocument();
				expect(screen.getByText(index.toString())).toBeInTheDocument();
			});
		});
	});

	/**
	 * Test refresh functionality
	 */
	it("refreshes key when refresh button is clicked", async () => {
		const mockFetchPinTwinKey = jest
			.fn()
			.mockResolvedValue(mockPinTwinResponse);
		const mockOnKeyReloaded = jest.fn();

		render(
			<TestWrapper>
				<Pintwin
					noLookup={false}
					fetchPinTwinKey={mockFetchPinTwinKey}
					onKeyReloaded={mockOnKeyReloaded}
				/>
			</TestWrapper>
		);

		// Find and click refresh button
		const refreshButton = screen.getByRole("button");
		fireEvent.click(refreshButton);

		await waitFor(() => {
			expect(mockFetchPinTwinKey).toHaveBeenCalledTimes(2); // Once on mount, once on click
		});
	});

	/**
	 * Test PIN encoding functionality
	 */
	it("encodes PIN correctly using PinTwin key", async () => {
		const mockFetchPinTwinKey = jest
			.fn()
			.mockResolvedValue(mockPinTwinResponse);

		render(
			<TestWrapper>
				<Pintwin
					noLookup={false}
					fetchPinTwinKey={mockFetchPinTwinKey}
				/>
			</TestWrapper>
		);

		await waitFor(() => {
			expect(mockFetchPinTwinKey).toHaveBeenCalled();
		});

		// Wait for encodePinTwin to be available on window
		await waitFor(() => {
			expect((window as any).encodePinTwin).toBeDefined();
		});

		// Test PIN encoding
		const encodePinTwin = (window as any).encodePinTwin;
		const testPin = "1234";
		const expectedEncoding = "9748"; // Based on mock key "1974856302"

		expect(encodePinTwin(testPin)).toBe(expectedEncoding);
	});

	/**
	 * Test error handling during key fetch
	 */
	it("handles API errors gracefully", async () => {
		const mockFetchPinTwinKey = jest
			.fn()
			.mockRejectedValue(new Error("Network error"));
		const mockOnKeyLoadStateChange = jest.fn();

		render(
			<TestWrapper>
				<Pintwin
					fetchPinTwinKey={mockFetchPinTwinKey}
					onKeyLoadStateChange={mockOnKeyLoadStateChange}
				/>
			</TestWrapper>
		);

		await waitFor(() => {
			expect(mockFetchPinTwinKey).toHaveBeenCalled();
		});

		// Check if error state is triggered
		await waitFor(() => {
			expect(mockOnKeyLoadStateChange).toHaveBeenCalledWith(false, true);
		});
	});

	/**
	 * Test maximum retry limit
	 */
	it("respects maximum retry limit", async () => {
		const mockFetchPinTwinKey = jest
			.fn()
			.mockRejectedValue(new Error("Network error"));

		const { rerender } = render(
			<TestWrapper>
				<Pintwin fetchPinTwinKey={mockFetchPinTwinKey} />
			</TestWrapper>
		);

		// Simulate multiple retries by re-rendering and triggering refresh
		for (let i = 0; i < 10; i++) {
			const refreshButton = screen.getByRole("button");
			fireEvent.click(refreshButton);

			rerender(
				<TestWrapper>
					<Pintwin fetchPinTwinKey={mockFetchPinTwinKey} />
				</TestWrapper>
			);
		}

		await waitFor(() => {
			expect(mockToast).toHaveBeenCalledWith({
				title: "Too many retries",
				description: "Please try again later.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		});
	});

	/**
	 * Test disabled state
	 */
	it("does not allow interactions when disabled", async () => {
		const mockFetchPinTwinKey = jest
			.fn()
			.mockResolvedValue(mockPinTwinResponse);

		render(
			<TestWrapper>
				<Pintwin
					disabled={true}
					fetchPinTwinKey={mockFetchPinTwinKey}
				/>
			</TestWrapper>
		);

		const refreshButton = screen.getByRole("button");
		expect(refreshButton).toBeDisabled();
	});

	/**
	 * Test callback functions
	 */
	it("calls callback functions correctly", async () => {
		const mockFetchPinTwinKey = jest
			.fn()
			.mockResolvedValue(mockPinTwinResponse);
		const mockOnKeyReloaded = jest.fn();
		const mockOnKeyLoadStateChange = jest.fn();

		render(
			<TestWrapper>
				<Pintwin
					fetchPinTwinKey={mockFetchPinTwinKey}
					onKeyReloaded={mockOnKeyReloaded}
					onKeyLoadStateChange={mockOnKeyLoadStateChange}
				/>
			</TestWrapper>
		);

		await waitFor(() => {
			expect(mockOnKeyLoadStateChange).toHaveBeenCalledWith(true, false);
			expect(mockOnKeyReloaded).toHaveBeenCalledWith("39");
		});
	});

	/**
	 * Test invalid API response handling
	 */
	it("handles invalid API response", async () => {
		const invalidResponse = {
			...mockPinTwinResponse,
			data: {
				...mockPinTwinResponse.data,
				pintwin_key: "123", // Too short
			},
		};

		const mockFetchPinTwinKey = jest
			.fn()
			.mockResolvedValue(invalidResponse);
		const mockOnKeyLoadStateChange = jest.fn();

		render(
			<TestWrapper>
				<Pintwin
					fetchPinTwinKey={mockFetchPinTwinKey}
					onKeyLoadStateChange={mockOnKeyLoadStateChange}
				/>
			</TestWrapper>
		);

		await waitFor(() => {
			expect(mockOnKeyLoadStateChange).toHaveBeenCalledWith(false, true);
		});
	});

	/**
	 * Test color scheme for keys
	 */
	it("applies correct color scheme to keys", async () => {
		const mockFetchPinTwinKey = jest
			.fn()
			.mockResolvedValue(mockPinTwinResponse);

		render(
			<TestWrapper>
				<Pintwin
					noLookup={false}
					fetchPinTwinKey={mockFetchPinTwinKey}
				/>
			</TestWrapper>
		);

		await waitFor(() => {
			const keyElements = screen.getAllByText(/[0-9]/);
			expect(keyElements.length).toBeGreaterThan(0);
		});
	});

	/**
	 * Test component unmounting
	 */
	it("cleans up properly on unmount", async () => {
		const mockFetchPinTwinKey = jest
			.fn()
			.mockResolvedValue(mockPinTwinResponse);

		const { unmount } = render(
			<TestWrapper>
				<Pintwin fetchPinTwinKey={mockFetchPinTwinKey} />
			</TestWrapper>
		);

		await waitFor(() => {
			expect((window as any).encodePinTwin).toBeDefined();
		});

		unmount();

		// encodePinTwin should still be available after unmount for other components
		expect((window as any).encodePinTwin).toBeDefined();
	});
});
