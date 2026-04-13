import { fireEvent } from "@testing-library/react";
import { render, screen } from "test-utils";
import Pintwin from "tf-components/Pintwin/Pintwin";

// Mock the usePinTwin hook
const mockUsePinTwin = jest.fn();
jest.mock("hooks/usePinTwin", () => ({
	usePinTwin: () => mockUsePinTwin(),
}));

// Mock API helper
const mockFetcher = jest.fn();
jest.mock("helpers/apiHelper", () => ({
	fetcher: (...args) => mockFetcher(...args),
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
// Mock the OtpInput component
const MockOtpInput = jest.fn();
jest.mock("components/OtpInput", () => ({
	OtpInput: (props: any) => {
		MockOtpInput(props);
		return (
			<div data-testid="otp-input">
				<input
					data-testid="pin-input"
					type="text"
					placeholder="Enter PIN"
					disabled={props.isDisabled}
					onChange={(e) => {
						if (props.onChange) props.onChange(e.target.value);
					}}
				/>
			</div>
		);
	},
}));

// Mock IcoButton component
const MockIcoButton = jest.fn();
jest.mock("components/IcoButton", () => ({
	IcoButton: (props: any) => {
		MockIcoButton(props);
		return (
			<button
				data-testid="ico-button"
				onClick={props.onClick}
				disabled={props.isDisabled}
			>
				{props.iconName}
			</button>
		);
	},
}));

// Mock InputLabel component
jest.mock("components/InputLabel", () => ({
	InputLabel: ({ children, ...props }: any) => (
		<label data-testid="input-label" {...props}>
			{children}
		</label>
	),
}));

describe("Pintwin Component", () => {
	const defaultMockHookReturn = {
		pinTwinKeyLoadStatus: "loaded",
		refreshPinTwinKey: jest.fn(),
		encodePinTwin: jest.fn((pin: string) => `encoded_${pin}`),
		validatePin: jest.fn(() => ({ isValid: true, error: null })),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockUsePinTwin.mockReturnValue(defaultMockHookReturn);
	});

	it("renders successfully with default props", () => {
		const { container } = render(<Pintwin />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders with custom label", () => {
		render(<Pintwin label="Custom PIN" />);
		expect(screen.getByText("Custom PIN")).toBeInTheDocument();
	});

	it("renders with default label when not provided", () => {
		render(<Pintwin />);
		expect(screen.getByText("Secret PIN")).toBeInTheDocument();
	});

	it("renders OtpInput with correct props", () => {
		render(<Pintwin length={6} />);

		expect(MockOtpInput).toHaveBeenCalledWith(
			expect.objectContaining({
				length: 6,
				isDisabled: false,
			})
		);
	});

	it("passes disabled state to OtpInput", () => {
		render(<Pintwin disabled={true} />);

		expect(MockOtpInput).toHaveBeenCalledWith(
			expect.objectContaining({
				isDisabled: true,
			})
		);
	});

	it("passes loading state to OtpInput", () => {
		mockUsePinTwin.mockReturnValue({
			...defaultMockHookReturn,
			pinTwinKeyLoadStatus: "loading",
		});

		render(<Pintwin />);

		expect(MockOtpInput).toHaveBeenCalledWith(
			expect.objectContaining({
				isDisabled: true,
			})
		);
	});

	it("calls onPinComplete when PIN is entered", () => {
		const onPinComplete = jest.fn();
		render(<Pintwin onPinComplete={onPinComplete} />);

		// Simulate onComplete callback directly (mocked OtpInput)
		const otpInputProps = MockOtpInput.mock.calls[0][0];
		otpInputProps.onComplete("1234");

		expect(onPinComplete).toHaveBeenCalledWith("1234", "encoded_1234");
	});

	it("handles PIN complete without onPinComplete callback", () => {
		render(<Pintwin />);

		const otpInputProps = MockOtpInput.mock.calls[0][0];
		expect(() => otpInputProps.onComplete("1234")).not.toThrow();
	});

	it("renders IcoButton with correct icon based on state", () => {
		render(<Pintwin />);

		expect(MockIcoButton).toHaveBeenCalledWith(
			expect.objectContaining({
				iconName: "insurance",
				iconStyle: expect.objectContaining({
					color: "success",
				}),
			})
		);
	});

	it("renders IcoButton with retry icon when loading", () => {
		mockUsePinTwin.mockReturnValue({
			...defaultMockHookReturn,
			pinTwinKeyLoadStatus: "loading",
		});

		render(<Pintwin />);

		expect(MockIcoButton).toHaveBeenCalledWith(
			expect.objectContaining({
				iconName: "retry",
				iconStyle: expect.objectContaining({
					color: "highlight",
				}),
			})
		);
	});

	it("renders IcoButton with replay icon when there's an error", () => {
		mockUsePinTwin.mockReturnValue({
			...defaultMockHookReturn,
			pinTwinKeyLoadStatus: "error",
		});

		render(<Pintwin />);

		expect(MockIcoButton).toHaveBeenCalledWith(
			expect.objectContaining({
				iconName: "replay",
				iconStyle: expect.objectContaining({
					color: "error",
				}),
			})
		);
	});

	it("calls refreshPinTwinKey when IcoButton is clicked and there's an error", () => {
		const refreshPinTwinKey = jest.fn();
		mockUsePinTwin.mockReturnValue({
			...defaultMockHookReturn,
			pinTwinKeyLoadStatus: "error",
			refreshPinTwinKey,
		});

		render(<Pintwin />);

		const icoButton = screen.getByTestId("ico-button");
		fireEvent.click(icoButton);

		expect(refreshPinTwinKey).toHaveBeenCalled();
	});

	it("does not call refreshPinTwinKey when IcoButton is clicked and there's no error", () => {
		const refreshPinTwinKey = jest.fn();
		mockUsePinTwin.mockReturnValue({
			...defaultMockHookReturn,
			refreshPinTwinKey,
		});

		render(<Pintwin />);

		const icoButton = screen.getByTestId("ico-button");
		fireEvent.click(icoButton);

		expect(refreshPinTwinKey).not.toHaveBeenCalled();
	});

	it("handles PIN encoding correctly", () => {
		const encodePinTwin = jest.fn((pin: string) => `encoded_${pin}`);
		mockUsePinTwin.mockReturnValue({
			...defaultMockHookReturn,
			encodePinTwin,
		});

		const onPinComplete = jest.fn();
		render(<Pintwin onPinComplete={onPinComplete} />);

		const otpInputProps = MockOtpInput.mock.calls[0][0];
		otpInputProps.onComplete("5678");

		expect(encodePinTwin).toHaveBeenCalledWith("5678");
	});

	it("renders with custom length", () => {
		render(<Pintwin length={6} />);

		expect(MockOtpInput).toHaveBeenCalledWith(
			expect.objectContaining({
				length: 6,
			})
		);
	});

	it("renders with default length when not provided", () => {
		render(<Pintwin />);

		expect(MockOtpInput).toHaveBeenCalledWith(
			expect.objectContaining({
				length: 4,
			})
		);
	});

	it("handles disabled state correctly", () => {
		render(<Pintwin disabled={true} />);

		expect(MockOtpInput).toHaveBeenCalledWith(
			expect.objectContaining({
				isDisabled: true,
			})
		);

		expect(MockIcoButton).toHaveBeenCalledWith(
			expect.objectContaining({
				onClick: undefined,
			})
		);
	});
});
