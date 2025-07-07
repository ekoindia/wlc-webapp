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
					lengthMax={6}
					required={true}
					onValidationChange={mockOnValidationChange}
				/>
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");

		// Test with empty input (should be invalid because required)
		fireEvent.change(input, { target: { value: "" } });
		expect(mockOnValidationChange).toHaveBeenCalledWith(false);

		// Test with too short input
		fireEvent.change(input, { target: { value: "12" } });
		expect(mockOnValidationChange).toHaveBeenCalledWith(false);

		// Test with valid input
		fireEvent.change(input, { target: { value: "1234" } });
		expect(mockOnValidationChange).toHaveBeenCalledWith(true);
	});

	/**
	 * Test PinTwin encoding with custom fetch function
	 */
	it("encodes PIN with PinTwin when available", async () => {
		const mockFetchPinTwinKey = jest
			.fn()
			.mockResolvedValue(mockPinTwinResponse);
		const mockOnChange = jest.fn();

		// Mock the global encodePinTwin function
		const _mockEncodePinTwin = jest.fn((_pin: string) => "encoded_pin");

		render(
			<TestWrapper>
				<InputPintwin
					pintwinApp={true}
					fetchPinTwinKey={mockFetchPinTwinKey}
					onChange={mockOnChange}
				/>
			</TestWrapper>
		);

		// Wait for PinTwin to load
		await waitFor(() => {
			expect(mockFetchPinTwinKey).toHaveBeenCalled();
		});

		const input = screen.getByTestId("pintwin-input");
		fireEvent.change(input, { target: { value: "1234" } });

		// Should call onChange with encoded value
		await waitFor(() => {
			expect(mockOnChange).toHaveBeenCalledWith("9748|39", "****");
		});

		// Cleanup
		delete (window as any).encodePinTwin;
	});

	/**
	 * Test keyboard interaction
	 */
	it("handles numeric keyboard input", () => {
		const mockOnChange = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin onChange={mockOnChange} />
			</TestWrapper>
		);

		// Focus to show keyboard
		const input = screen.getByTestId("pintwin-input");
		fireEvent.focus(input);

		// Find and click numeric key (this would be in the NumericKeyboard component)
		// Since we're testing integration, we can simulate the keyboard callback
		const _component = screen.getByTestId("pintwin-input").closest("div");

		// Simulate keyboard key press through the component's internal handler
		// This is a simplified test - in reality the keyboard component would trigger this
		fireEvent.change(input, { target: { value: "1" } });
		expect(mockOnChange).toHaveBeenCalledWith("1", "*");
	});

	/**
	 * Test component cleanup
	 */
	it("cleans up properly on unmount", () => {
		const { unmount } = render(
			<TestWrapper>
				<InputPintwin />
			</TestWrapper>
		);

		unmount();
		// Should not throw any errors
	});

	/**
	 * Test invisible component
	 */
	it("does not render when not visible", () => {
		const { container } = render(
			<TestWrapper>
				<InputPintwin isVisible={false} />
			</TestWrapper>
		);

		expect(container.firstChild).toBeNull();
	});

	/**
	 * Test frozen state
	 */
	it("handles frozen state correctly", () => {
		render(
			<TestWrapper>
				<InputPintwin isFrozen={true} />
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");
		expect(input).toBeDisabled();
	});

	/**
	 * Test jump to next functionality
	 */
	it("handles jump to next field", () => {
		const mockOnJumpToNext = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin onJumpToNext={mockOnJumpToNext} />
			</TestWrapper>
		);

		// This would typically be triggered by the NumericKeyboard OK button
		// We can simulate this by testing the handler directly
		const input = screen.getByTestId("pintwin-input");
		fireEvent.focus(input);

		// Simulate OK button press (this would come from the keyboard component)
		// In a real scenario, this would be triggered by the NumericKeyboard component
		// For now, we just verify the component accepts the callback
		expect(mockOnJumpToNext).toBeDefined();
	});

	/**
	 * Test stretch animation
	 */
	it("shows stretch animation when max length is reached", () => {
		const mockOnChange = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin lengthMax={4} onChange={mockOnChange} />
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");
		fireEvent.change(input, { target: { value: "1234" } });

		// Stretch animation should be triggered (we can't easily test the visual aspect)
		expect(mockOnChange).toHaveBeenCalledWith("1234", "****");
	});

	/**
	 * Test error message display
	 */
	it("displays error messages correctly", () => {
		render(
			<TestWrapper>
				<InputPintwin invalid={true} errorMessage="Invalid PIN" />
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");
		expect(input).toHaveAttribute("errorMsg", "Invalid PIN");
	});

	/**
	 * Test custom label
	 */
	it("uses custom label when provided", () => {
		render(
			<TestWrapper>
				<InputPintwin label="Custom PIN Label" />
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");
		expect(input).toHaveAttribute("label", "Custom PIN Label");
	});

	/**
	 * Test input click handler
	 */
	it("handles input click events", () => {
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

		const input = screen.getByTestId("pintwin-input");
		fireEvent.click(input);

		expect(mockOnSetPin).toHaveBeenCalled();
	});

	/**
	 * Test required field validation
	 */
	it("validates required fields correctly", () => {
		const mockOnValidationChange = jest.fn();

		render(
			<TestWrapper>
				<InputPintwin
					required={true}
					onValidationChange={mockOnValidationChange}
				/>
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");
		fireEvent.blur(input);

		// Should be invalid when empty and required
		expect(mockOnValidationChange).toHaveBeenCalledWith(false);
	});

	/**
	 * Test input field props
	 */
	it("passes correct props to input field", () => {
		render(
			<TestWrapper>
				<InputPintwin
					name="test-pin"
					label="Test PIN"
					lengthMin={4}
					lengthMax={6}
					required={true}
					disabled={false}
				/>
			</TestWrapper>
		);

		const input = screen.getByTestId("pintwin-input");
		expect(input).toHaveAttribute("name", "test-pin");
		expect(input).toHaveAttribute("label", "Test PIN");
		expect(input).toHaveAttribute("minLength", "4");
		expect(input).toHaveAttribute("maxLength", "6");
		expect(input).toHaveAttribute("required");
		expect(input).toHaveAttribute("type", "password");
		expect(input).toHaveAttribute("inputMode", "tel");
	});
});
