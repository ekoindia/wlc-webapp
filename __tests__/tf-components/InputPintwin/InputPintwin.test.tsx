import { ChakraProvider } from "@chakra-ui/react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import InputPintwin from "tf-components/InputPintwin/InputPintwin";
import { PinTwinResponse } from "tf-components/Pintwin/Pintwin";

// Mock the Input component
jest.mock("components/Input", () => ({
	Input: React.forwardRef<HTMLInputElement, any>((props, ref) => (
		<input
			ref={ref}
			data-testid="pintwin-input"
			{...props}
			onChange={(e) => props.onChange?.(e)}
			onFocus={(e) => props.onFocus?.(e)}
			onBlur={(e) => props.onBlur?.(e)}
			onClick={(e) => props.onClick?.(e)}
		/>
	)),
}));

// Mock useBreakpointValue
jest.mock("@chakra-ui/react", () => ({
	...jest.requireActual("@chakra-ui/react"),
	useBreakpointValue: jest.fn((values) => values.base), // Always return mobile view for testing
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

describe("InputPintwin Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockSessionStorage.getItem.mockReturnValue("mock-access-token");
	});

	/**
	 * Test basic rendering
	 */
	it("renders successfully with default props", () => {
		render(
			<TestWrapper>
				<InputPintwin />
			</TestWrapper>
		);

		expect(screen.getByTestId("pintwin-input")).toBeInTheDocument();
	});

	/**
	 * Test input value changes
	 */
	it("handles input value changes correctly", () => {
		const mockOnChange = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin onChange={mockOnChange} />
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");
		fireEvent.change(input, { target: { value: "1234" } });

		expect(mockOnChange).toHaveBeenCalledWith("1234", "****");
	});

	/**
	 * Test numeric-only input filtering
	 */
	it("filters non-numeric characters", () => {
		const mockOnChange = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin onChange={mockOnChange} />
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");
		fireEvent.change(input, { target: { value: "1a2b3c4" } });

		expect(mockOnChange).toHaveBeenCalledWith("1234", "****");
	});

	/**
	 * Test maximum length enforcement
	 */
	it("enforces maximum length", () => {
		const mockOnChange = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin lengthMax={4} onChange={mockOnChange} />
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");
		fireEvent.change(input, { target: { value: "123456789" } });

		expect(mockOnChange).toHaveBeenCalledWith("1234", "****");
	});

	/**
	 * Test focus and blur events
	 */
	it("handles focus and blur events", () => {
		const mockOnFocusChange = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin onFocusChange={mockOnFocusChange} />
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");

		fireEvent.focus(input);
		expect(mockOnFocusChange).toHaveBeenCalledWith(true);

		fireEvent.blur(input);
		expect(mockOnFocusChange).toHaveBeenCalledWith(false);
	});

	/**
	 * Test Set PIN mode
	 */
	it("activates Set PIN mode when metadata and showSetPin are provided", () => {
		const mockOnSetPin = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin
					metadata="reset_pin_interaction_id"
					showSetPin={true}
					onSetPin={mockOnSetPin}
				/>
			</TestWrapper>
		);

		// Input should be disabled in Set PIN mode
		const input = screen.getByTestId("pintwin-input");
		expect(input).toBeDisabled();

		// Set PIN button should be rendered
		const setPinButton = screen.getByText("Set Your PIN");
		expect(setPinButton).toBeInTheDocument();

		// Clicking should trigger onSetPin
		fireEvent.click(setPinButton);
		expect(mockOnSetPin).toHaveBeenCalled();
	});

	/**
	 * Test Reset PIN functionality
	 */
	it("shows Reset PIN option when allowed", () => {
		const mockOnResetPin = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin
					metadata="reset_pin_interaction_id"
					showSetPin={false}
					onResetPin={mockOnResetPin}
				/>
			</TestWrapper>
		);

		const resetPinButton = screen.getByText("Forgot PIN?");
		expect(resetPinButton).toBeInTheDocument();

		fireEvent.click(resetPinButton);
		expect(mockOnResetPin).toHaveBeenCalled();
	});

	/**
	 * Test validation functionality
	 */
	it("validates input correctly", async () => {
		const mockOnValidationChange = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin
					lengthMin={4}
					lengthMax={4}
					required={true}
					onValidationChange={mockOnValidationChange}
				/>
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");

		// Test insufficient length
		fireEvent.change(input, { target: { value: "12" } });
		await waitFor(() => {
			expect(mockOnValidationChange).toHaveBeenCalledWith(false);
		});

		// Test valid length
		fireEvent.change(input, { target: { value: "1234" } });
		await waitFor(() => {
			expect(mockOnValidationChange).toHaveBeenCalledWith(true);
		});
	});

	/**
	 * Test PIN encoding with mock data
	 */
	it("encodes PIN correctly using PinTwin with mock data", async () => {
		const mockOnChange = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin
					pintwinApp={true}
					useMockData={true}
					onChange={mockOnChange}
				/>
			</TestWrapper>
		);

		// Wait for PIN encoding to be ready
		await waitFor(() => {
			expect((window as any).encodePinTwin).toBeDefined();
		});

		const input = screen.getByTestId("pintwin-input");
		fireEvent.change(input, { target: { value: "1234" } });

		// The encoded value should be different from the input
		expect(mockOnChange).toHaveBeenCalled();
		const [encodedValue] = mockOnChange.mock.calls[0];
		expect(encodedValue).not.toBe("1234"); // Should be encoded
	});

	/**
	 * Test PIN encoding with API call
	 */
	it("encodes PIN correctly using PinTwin with API call", async () => {
		mockFetcher.mockResolvedValue(mockPinTwinResponse);
		const mockOnChange = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin
					pintwinApp={true}
					useMockData={false}
					onChange={mockOnChange}
				/>
			</TestWrapper>
		);

		// Wait for API call and PIN encoding to be ready
		await waitFor(() => {
			expect(mockFetcher).toHaveBeenCalled();
		});

		await waitFor(() => {
			expect((window as any).encodePinTwin).toBeDefined();
		});

		const input = screen.getByTestId("pintwin-input");
		fireEvent.change(input, { target: { value: "1234" } });

		// The encoded value should be different from the input
		expect(mockOnChange).toHaveBeenCalled();
		const [encodedValue] = mockOnChange.mock.calls[0];
		expect(encodedValue).not.toBe("1234"); // Should be encoded
	});

	/**
	 * Test useMockData prop functionality
	 */
	it("uses mock data when useMockData is true", async () => {
		render(
			<TestWrapper>
				<InputPintwin pintwinApp={true} useMockData={true} />
			</TestWrapper>
		);

		// Should not make API calls when using mock data
		await waitFor(() => {
			expect(mockFetcher).not.toHaveBeenCalled();
		});
	});

	/**
	 * Test API call when useMockData is false
	 */
	it("calls API when useMockData is false", async () => {
		mockFetcher.mockResolvedValue(mockPinTwinResponse);

		render(
			<TestWrapper>
				<InputPintwin pintwinApp={true} useMockData={false} />
			</TestWrapper>
		);

		// Should make API calls when not using mock data
		await waitFor(() => {
			expect(mockFetcher).toHaveBeenCalled();
		});
	});

	/**
	 * Test disabled state
	 */
	it("does not allow input when disabled", () => {
		render(
			<TestWrapper>
				<InputPintwin disabled={true} />
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");
		expect(input).toBeDisabled();
	});

	/**
	 * Test frozen state
	 */
	it("does not allow input when frozen", () => {
		render(
			<TestWrapper>
				<InputPintwin isFrozen={true} />
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");
		expect(input).toBeDisabled();
	});

	/**
	 * Test component visibility
	 */
	it("does not render when not visible", () => {
		render(
			<TestWrapper>
				<InputPintwin isVisible={false} />
			</TestWrapper>
		);

		expect(screen.queryByTestId("pintwin-input")).not.toBeInTheDocument();
	});
});
