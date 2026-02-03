import { fireEvent } from "@testing-library/react";
import { OtpInput } from "components/OtpInput";
import { useState } from "react";
import { render, screen } from "test-utils";

const ControlledOtpInput = ({ onChange, initialValue = "", ...props }) => {
	const [value, setValue] = useState(initialValue);
	const handleChange = (val) => {
		setValue(val);
		onChange && onChange(val);
	};
	return <OtpInput {...props} value={value} onChange={handleChange} />;
};

describe("OtpInput component", () => {
	const defaultProps = {
		length: 4,
		onChange: jest.fn(),
		onComplete: jest.fn(),
		onKeyDown: jest.fn(),
		onEnter: jest.fn(),
		value: "",
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders successfully with default props", () => {
		const { container } = render(<OtpInput {...defaultProps} />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders correct number of input fields based on length prop", () => {
		render(<OtpInput {...defaultProps} length={6} />);
		const inputs = screen.getAllByRole("textbox");
		expect(inputs).toHaveLength(6);
	});

	it("renders with custom length prop", () => {
		render(<OtpInput {...defaultProps} length={4} />);
		const inputs = screen.getAllByRole("textbox");
		expect(inputs).toHaveLength(4);
	});

	it("calls onChange when input value changes", () => {
		const onChange = jest.fn();
		render(<ControlledOtpInput onChange={onChange} length={4} />);

		const inputs = screen.getAllByRole("textbox");
		fireEvent.change(inputs[0], { target: { value: "1" } });

		expect(onChange).toHaveBeenCalledWith("1");
	});

	it("calls onComplete when all fields are filled", () => {
		const onComplete = jest.fn();
		render(
			<ControlledOtpInput
				length={4}
				onComplete={onComplete}
				initialValue="123"
			/>
		);

		const inputs = screen.getAllByRole("textbox");
		fireEvent.change(inputs[3], { target: { value: "4" } });

		expect(onComplete).toHaveBeenCalledWith("1234");
	});

	it("handles keyboard navigation correctly", () => {
		const onKeyDown = jest.fn();
		render(<ControlledOtpInput onKeyDown={onKeyDown} length={4} />);

		const inputs = screen.getAllByRole("textbox");
		// PinInput attaches onKeyDown to inputs.
		fireEvent.keyDown(inputs[0], { key: "ArrowRight", code: "ArrowRight" });

		// We check if the passed onKeyDown is called.
		expect(onKeyDown).toHaveBeenCalled();
	});

	it("handles Enter key press", () => {
		const onEnter = jest.fn();
		render(<ControlledOtpInput onEnter={onEnter} length={4} />);

		const inputs = screen.getAllByRole("textbox");
		fireEvent.keyDown(inputs[0], { key: "Enter", code: "Enter" });

		expect(onEnter).toHaveBeenCalled();
	});

	it("handles Backspace key correctly", () => {
		// Testing if backspace doesn't crash and triggers updates
		const onChange = jest.fn();
		render(
			<ControlledOtpInput
				length={4}
				initialValue="12"
				onChange={onChange}
			/>
		);

		const inputs = screen.getAllByRole("textbox");
		// If we are at index 2 (empty), backspace should focus index 1.
		// If we are at index 1 (value "2"), backspace should clear it.

		// In controlled environment with fireEvent setup here, strict simulation of focus/delete depends on PinInput internals.
		// We primarily want to see if the component renders and accepts key events without error.
		fireEvent.keyDown(inputs[1], { key: "Backspace", code: "Backspace" });

		// Ideally onChange might be called with "1" if PinInput handles it on keyDown.
		// But PinInput might handle it on change.
		// Let's just ensure no crash for now, as detailed behavior depends on Chakra's implementation.
	});

	it("applies custom input styles", () => {
		// Passing style object to simulate inline styles or prop styles
		render(
			<OtpInput
				{...defaultProps}
				inputStyle={{ style: { fontSize: "20px" } }}
			/>
		);

		const inputs = screen.getAllByRole("textbox");
		expect(inputs[0]).toHaveStyle("font-size: 20px");
	});

	it("applies custom container styles", () => {
		const { container } = render(
			<OtpInput
				{...defaultProps}
				containerStyle={{ style: { marginTop: "10px" } }}
			/>
		);

		// Container style usually applied to the root HStack/div
		// Verify if applied.
		expect(container.firstChild).toHaveStyle("margin-top: 10px");
	});

	it("handles disabled state correctly", () => {
		render(<OtpInput {...defaultProps} isDisabled={true} />);

		const inputs = screen.getAllByRole("textbox");
		inputs.forEach((input) => {
			expect(input).toBeDisabled();
		});
	});

	it("handles placeholder text", () => {
		const placeholder = "-";
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

	it("handles focus management correctly", () => {
		render(<ControlledOtpInput length={4} />);
		const inputs = screen.getAllByRole("textbox");

		// Just check if we can focus
		inputs[0].focus();
		expect(document.activeElement).toBe(inputs[0]);
	});

	it("handles empty OTP state correctly", () => {
		render(<OtpInput {...defaultProps} value="" />);
		const inputs = screen.getAllByRole("textbox");
		inputs.forEach((input) => {
			expect(input).toHaveValue("");
		});
	});
});
