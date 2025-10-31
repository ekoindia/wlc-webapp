import userEvent from "@testing-library/user-event";
import { render, screen } from "test-utils";
import Pintwin from "tf-components/Pintwin/Pintwin";

// Mock the usePinTwin hook
const mockUsePinTwin = jest.fn();
jest.mock("hooks/usePinTwin", () => ({
	usePinTwin: () => mockUsePinTwin(),
}));

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
		pintwinKey: ["1", "9", "7", "4", "8", "5", "6", "3", "0", "2"],
		loading: false,
		reloadKey: jest.fn(),
		encodePinTwin: jest.fn((pin: string) => `encoded_${pin}`),
		keyLoadError: false,
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
		render(<Pintwin maxLength={6} />);

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
			loading: true,
		});

		render(<Pintwin />);

		expect(MockOtpInput).toHaveBeenCalledWith(
			expect.objectContaining({
				isDisabled: true,
			})
		);
	});

	it("calls onPinChange when PIN is entered", async () => {
		const user = userEvent.setup();
		const onPinChange = jest.fn();
		render(<Pintwin onPinChange={onPinChange} />);

		const pinInput = screen.getByTestId("pin-input");
		await user.type(pinInput, "1234");

		// Simulate onComplete callback
		const otpInputProps = MockOtpInput.mock.calls[0][0];
		otpInputProps.onComplete("1234");

		expect(onPinChange).toHaveBeenCalledWith("1234", "encoded_1234");
	});

	it("handles PIN change without onPinChange callback", () => {
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
			loading: true,
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
			keyLoadError: true,
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

	it("calls reloadKey when IcoButton is clicked and there's an error", async () => {
		const user = userEvent.setup();
		const reloadKey = jest.fn();
		mockUsePinTwin.mockReturnValue({
			...defaultMockHookReturn,
			keyLoadError: true,
			reloadKey,
		});

		render(<Pintwin />);

		const icoButton = screen.getByTestId("ico-button");
		await user.click(icoButton);

		expect(reloadKey).toHaveBeenCalled();
	});

	it("does not call reloadKey when IcoButton is clicked and there's no error", async () => {
		const user = userEvent.setup();
		const reloadKey = jest.fn();
		mockUsePinTwin.mockReturnValue({
			...defaultMockHookReturn,
			reloadKey,
		});

		render(<Pintwin />);

		const icoButton = screen.getByTestId("ico-button");
		await user.click(icoButton);

		expect(reloadKey).not.toHaveBeenCalled();
	});

	it("renders lookup table when noLookup is false", () => {
		render(<Pintwin noLookup={false} />);

		// Should render the lookup table with digits
		expect(screen.getByText("0")).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
		expect(screen.getByText("4")).toBeInTheDocument();
		expect(screen.getByText("5")).toBeInTheDocument();
		expect(screen.getByText("6")).toBeInTheDocument();
		expect(screen.getByText("7")).toBeInTheDocument();
		expect(screen.getByText("8")).toBeInTheDocument();
		expect(screen.getByText("9")).toBeInTheDocument();
	});

	it("does not render lookup table when noLookup is true", () => {
		render(<Pintwin noLookup={true} />);

		// Should not render the lookup table
		expect(screen.queryByText("0")).not.toBeInTheDocument();
		expect(screen.queryByText("1")).not.toBeInTheDocument();
	});

	it("applies loading opacity to lookup table when loading", () => {
		mockUsePinTwin.mockReturnValue({
			...defaultMockHookReturn,
			loading: true,
		});

		render(<Pintwin noLookup={false} />);

		const lookupContainer = screen.getByText("0").closest("div");
		expect(lookupContainer).toHaveStyle("opacity: 0.4");
	});

	it("uses mock data when useMockData is true", () => {
		render(<Pintwin useMockData={true} />);

		expect(mockUsePinTwin).toHaveBeenCalledWith({
			useMockData: true,
			autoLoad: true,
		});
	});

	it("uses real data when useMockData is false", () => {
		render(<Pintwin useMockData={false} />);

		expect(mockUsePinTwin).toHaveBeenCalledWith({
			useMockData: false,
			autoLoad: true,
		});
	});

	it("handles PIN encoding correctly", () => {
		const encodePinTwin = jest.fn((pin: string) => `encoded_${pin}`);
		mockUsePinTwin.mockReturnValue({
			...defaultMockHookReturn,
			encodePinTwin,
		});

		render(<Pintwin />);

		const otpInputProps = MockOtpInput.mock.calls[0][0];
		otpInputProps.onComplete("5678");

		expect(encodePinTwin).toHaveBeenCalledWith("5678");
	});

	it("handles case when encodePinTwin is not available", () => {
		mockUsePinTwin.mockReturnValue({
			...defaultMockHookReturn,
			encodePinTwin: undefined,
		});

		const onPinChange = jest.fn();
		render(<Pintwin onPinChange={onPinChange} />);

		const otpInputProps = MockOtpInput.mock.calls[0][0];
		otpInputProps.onComplete("1234");

		expect(onPinChange).toHaveBeenCalledWith("1234", "1234");
	});

	it("renders with custom maxLength", () => {
		render(<Pintwin maxLength={6} />);

		expect(MockOtpInput).toHaveBeenCalledWith(
			expect.objectContaining({
				length: 6,
			})
		);
	});

	it("renders with default maxLength when not provided", () => {
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
