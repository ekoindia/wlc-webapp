import userEvent from "@testing-library/user-event";
import { OtpInput } from "components/OtpInput";
import { render, screen } from "test-utils";

describe("OtpInput component", () => {
	const defaultProps = {
		length: 4,
		onChange: jest.fn(),
		onComplete: jest.fn(),
		onKeyDown: jest.fn(),
		onEnter: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders successfully with default props", () => {
		const { container } = render(<OtpInput />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders correct number of input fields based on length prop", () => {
		render(<OtpInput length={6} />);
		const inputs = screen.getAllByRole("textbox");
		expect(inputs).toHaveLength(6);
	});

	it("renders with custom length prop", () => {
		render(<OtpInput length={4} />);
		const inputs = screen.getAllByRole("textbox");
		expect(inputs).toHaveLength(4);
	});

	it("calls onChange when input value changes", async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		render(<OtpInput {...defaultProps} onChange={onChange} />);

		const inputs = screen.getAllByRole("textbox");
		await user.type(inputs[0], "1");

		expect(onChange).toHaveBeenCalledWith("1");
	});

	it("calls onComplete when all fields are filled", async () => {
		const user = userEvent.setup();
		const onComplete = jest.fn();
		render(<OtpInput {...defaultProps} onComplete={onComplete} />);

		const inputs = screen.getAllByRole("textbox");
		await user.type(inputs[0], "1");
		await user.type(inputs[1], "2");
		await user.type(inputs[2], "3");
		await user.type(inputs[3], "4");

		expect(onComplete).toHaveBeenCalledWith("1234");
	});

	it("handles keyboard navigation correctly", async () => {
		const user = userEvent.setup();
		const onKeyDown = jest.fn();
		render(<OtpInput {...defaultProps} onKeyDown={onKeyDown} />);

		const inputs = screen.getAllByRole("textbox");
		await user.type(inputs[0], "1");

		// Should automatically focus next input
		expect(document.activeElement).toBe(inputs[1]);
	});

	it("handles Enter key press", async () => {
		const user = userEvent.setup();
		const onEnter = jest.fn();
		render(<OtpInput {...defaultProps} onEnter={onEnter} />);

		const inputs = screen.getAllByRole("textbox");
		await user.type(inputs[0], "1");
		await user.keyboard("{Enter}");

		expect(onEnter).toHaveBeenCalledWith("1");
	});

	it("handles Backspace key correctly", async () => {
		const user = userEvent.setup();
		render(<OtpInput {...defaultProps} />);

		const inputs = screen.getAllByRole("textbox");
		await user.type(inputs[0], "1");
		await user.type(inputs[1], "2");
		await user.keyboard("{Backspace}");

		// Should clear the current input and focus previous
		expect(inputs[1]).toHaveValue("");
	});

	it("applies custom input styles", () => {
		const inputStyle = { fontSize: "20px", width: "50px" };
		render(<OtpInput {...defaultProps} inputStyle={inputStyle} />);

		const inputs = screen.getAllByRole("textbox");
		expect(inputs[0]).toHaveStyle("font-size: 20px");
	});

	it("applies custom container styles", () => {
		const containerStyle = { gap: "20px" };
		const { container } = render(
			<OtpInput {...defaultProps} containerStyle={containerStyle} />
		);

		const flexContainer = container.querySelector("div");
		expect(flexContainer).toHaveStyle("gap: 20px");
	});

	it("handles disabled state correctly", () => {
		render(<OtpInput {...defaultProps} isDisabled={true} />);

		const inputs = screen.getAllByRole("textbox");
		inputs.forEach((input) => {
			expect(input).toBeDisabled();
		});
	});

	it("handles placeholder text", () => {
		const placeholder = "Enter OTP";
		render(<OtpInput {...defaultProps} placeholder={placeholder} />);

		const inputs = screen.getAllByRole("textbox");
		inputs.forEach((input) => {
			expect(input).toHaveAttribute("placeholder", placeholder);
		});
	});

	it("handles initial value correctly", () => {
		const value = "1234";
		render(<OtpInput {...defaultProps} value={value} />);

		const inputs = screen.getAllByRole("textbox");
		expect(inputs[0]).toHaveValue("1");
		expect(inputs[1]).toHaveValue("2");
		expect(inputs[2]).toHaveValue("3");
		expect(inputs[3]).toHaveValue("4");
	});

	it("focuses first input on mount", () => {
		render(<OtpInput {...defaultProps} />);

		const inputs = screen.getAllByRole("textbox");
		expect(document.activeElement).toBe(inputs[0]);
	});

	it("handles focus management correctly", async () => {
		const user = userEvent.setup();
		render(<OtpInput {...defaultProps} />);

		const inputs = screen.getAllByRole("textbox");

		// Click on third input
		await user.click(inputs[2]);
		expect(document.activeElement).toBe(inputs[2]);

		// Type a number
		await user.type(inputs[2], "3");
		expect(document.activeElement).toBe(inputs[3]);
	});

	it("handles empty OTP state correctly", () => {
		render(<OtpInput {...defaultProps} />);

		const inputs = screen.getAllByRole("textbox");
		inputs.forEach((input) => {
			expect(input).toHaveValue("");
		});
	});

	it("handles partial OTP entry correctly", async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		render(<OtpInput {...defaultProps} onChange={onChange} />);

		const inputs = screen.getAllByRole("textbox");
		await user.type(inputs[0], "1");
		await user.type(inputs[1], "2");

		expect(onChange).toHaveBeenCalledWith("1");
		expect(onChange).toHaveBeenCalledWith("12");
	});

	it("handles rapid typing correctly", async () => {
		const user = userEvent.setup();
		const onComplete = jest.fn();
		render(<OtpInput {...defaultProps} onComplete={onComplete} />);

		const inputs = screen.getAllByRole("textbox");
		await user.type(inputs[0], "1234");

		expect(onComplete).toHaveBeenCalledWith("1234");
	});

	it("handles focus on empty field correctly", async () => {
		const user = userEvent.setup();
		render(<OtpInput {...defaultProps} />);

		const inputs = screen.getAllByRole("textbox");
		await user.click(inputs[2]);

		// Should focus the first empty field
		expect(document.activeElement).toBe(inputs[0]);
	});
});
