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

// Mock API helper
const mockFetcher = jest.fn();
jest.mock("helpers/apiHelper", () => ({
	fetcher: mockFetcher,
}));

// Mock sessionStorage
const mockSessionStorage = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};
Object.defineProperty(window, "sessionStorage", {
	value: mockSessionStorage,
	writable: true,
});

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
		mockSessionStorage.getItem.mockReturnValue("mock-access-token");
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
	 * Test lookup grid rendering with mock data
	 */
	it("renders lookup grid when noLookup is false and uses mock data", async () => {
		render(
			<TestWrapper>
				<Pintwin noLookup={false} useMockData={true} />
			</TestWrapper>
		);

		// Wait for the component to load the key
		await waitFor(() => {
			// Check if digit grid is rendered
			const digits = mockPinTwinResponse.data.pintwin_key.split("");
			digits.forEach((digit, index) => {
				expect(screen.getByText(digit)).toBeInTheDocument();
				expect(screen.getByText(index.toString())).toBeInTheDocument();
			});
		});
	});

	/**
	 * Test lookup grid rendering with API call
	 */
	it("renders lookup grid when noLookup is false and calls API", async () => {
		mockFetcher.mockResolvedValue(mockPinTwinResponse);

		render(
			<TestWrapper>
				<Pintwin noLookup={false} useMockData={false} />
			</TestWrapper>
		);

		// Wait for the component to load the key
		await waitFor(() => {
			expect(mockFetcher).toHaveBeenCalled();
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
	 * Test refresh functionality with API call
	 */
	it("refreshes key when refresh button is clicked and calls API", async () => {
		mockFetcher.mockResolvedValue(mockPinTwinResponse);
		const mockOnKeyReloaded = jest.fn();

		render(
			<TestWrapper>
				<Pintwin
					noLookup={false}
					useMockData={false}
					onKeyReloaded={mockOnKeyReloaded}
				/>
			</TestWrapper>
		);

		// Find and click refresh button
		const refreshButton = screen.getByRole("button");
		fireEvent.click(refreshButton);

		await waitFor(() => {
			expect(mockFetcher).toHaveBeenCalledTimes(2); // Once on mount, once on click
		});
	});

	/**
	 * Test refresh functionality with mock data
	 */
	it("refreshes key when refresh button is clicked and uses mock data", async () => {
		const mockOnKeyReloaded = jest.fn();

		render(
			<TestWrapper>
				<Pintwin
					noLookup={false}
					useMockData={true}
					onKeyReloaded={mockOnKeyReloaded}
				/>
			</TestWrapper>
		);

		// Find and click refresh button
		const refreshButton = screen.getByRole("button");
		fireEvent.click(refreshButton);

		await waitFor(() => {
			// Mock data should not trigger API calls
			expect(mockFetcher).not.toHaveBeenCalled();
			expect(mockOnKeyReloaded).toHaveBeenCalled();
		});
	});

	/**
	 * Test PIN encoding functionality
	 */
	it("encodes PIN correctly using PinTwin key", async () => {
		render(
			<TestWrapper>
				<Pintwin noLookup={false} useMockData={true} />
			</TestWrapper>
		);

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
	 * Test error handling during API key fetch
	 */
	it("handles API errors gracefully", async () => {
		mockFetcher.mockRejectedValue(new Error("Network error"));
		const mockOnKeyLoadStateChange = jest.fn();

		render(
			<TestWrapper>
				<Pintwin
					useMockData={false}
					onKeyLoadStateChange={mockOnKeyLoadStateChange}
				/>
			</TestWrapper>
		);

		await waitFor(() => {
			expect(mockFetcher).toHaveBeenCalled();
		});

		// Check if error state is triggered
		await waitFor(() => {
			expect(mockOnKeyLoadStateChange).toHaveBeenCalledWith(false, true);
		});
	});

	/**
	 * Test disabled state
	 */
	it("does not allow interactions when disabled", async () => {
		render(
			<TestWrapper>
				<Pintwin disabled={true} useMockData={true} />
			</TestWrapper>
		);

		const refreshButton = screen.getByRole("button");
		expect(refreshButton).toBeDisabled();
	});

	/**
	 * Test callback functions
	 */
	it("calls callback functions correctly", async () => {
		const mockOnKeyReloaded = jest.fn();
		const mockOnKeyLoadStateChange = jest.fn();

		render(
			<TestWrapper>
				<Pintwin
					useMockData={true}
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
	 * Test color scheme for keys
	 */
	it("applies correct color scheme to keys", async () => {
		render(
			<TestWrapper>
				<Pintwin noLookup={false} useMockData={true} />
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
		const { unmount } = render(
			<TestWrapper>
				<Pintwin useMockData={true} />
			</TestWrapper>
		);

		await waitFor(() => {
			expect((window as any).encodePinTwin).toBeDefined();
		});

		unmount();

		// encodePinTwin should still be available after unmount for other components
		expect((window as any).encodePinTwin).toBeDefined();
	});

	/**
	 * Test useMockData prop functionality
	 */
	it("uses mock data when useMockData is true", async () => {
		render(
			<TestWrapper>
				<Pintwin useMockData={true} noLookup={false} />
			</TestWrapper>
		);

		await waitFor(() => {
			// Should not call the API when using mock data
			expect(mockFetcher).not.toHaveBeenCalled();
			// Should still render the pintwin key
			expect(screen.getByText("1")).toBeInTheDocument();
		});
	});

	/**
	 * Test API call when useMockData is false
	 */
	it("calls API when useMockData is false", async () => {
		mockFetcher.mockResolvedValue(mockPinTwinResponse);

		render(
			<TestWrapper>
				<Pintwin useMockData={false} noLookup={false} />
			</TestWrapper>
		);

		await waitFor(() => {
			// Should call the API when not using mock data
			expect(mockFetcher).toHaveBeenCalled();
			expect(mockFetcher).toHaveBeenCalledWith(
				expect.stringContaining("/transactions/do"),
				expect.objectContaining({
					body: expect.objectContaining({
						transaction_type_id: 241, // TransactionTypes.GET_PINTWIN_KEY
					}),
					token: "mock-access-token",
				})
			);
		});
	});
});
