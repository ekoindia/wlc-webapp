import { Input } from "components/Input";
import { fireEvent, render, screen } from "test-utils";

describe("Input", () => {
	it("renders without error with no attributes", () => {
		const { container } = render(<Input />);
		expect(container).not.toBeEmptyDOMElement();
	});

	describe("Numeric Input (isNumInput=true)", () => {
		it("displays formatted value with spaces", () => {
			render(
				<Input label="Mobile Number" isNumInput={true} maxLength={10} />
			);

			const input = screen.getByLabelText(/mobile number/i);
			fireEvent.change(input, { target: { value: "1234567890" } });

			expect(input).toHaveValue("123 456 7890");
		});

		it("dispatches unformatted value via onChange", () => {
			const handleChange = jest.fn();

			render(
				<Input
					label="Mobile Number"
					isNumInput={true}
					maxLength={10}
					onChange={handleChange}
				/>
			);

			const input = screen.getByLabelText(/mobile number/i);
			fireEvent.change(input, { target: { value: "1234567890" } });

			expect(handleChange).toHaveBeenCalled();
			const lastCall =
				handleChange.mock.calls[handleChange.mock.calls.length - 1];
			expect(lastCall[0].target.value).toBe("1234567890");
		});

		it("dispatches unformatted value via onEnter", () => {
			const handleEnter = jest.fn();

			render(
				<Input
					label="Mobile Number"
					isNumInput={true}
					maxLength={10}
					onEnter={handleEnter}
				/>
			);

			const input = screen.getByLabelText(/mobile number/i);
			fireEvent.change(input, { target: { value: "1234567890" } });
			fireEvent.keyDown(input, { code: "Enter" });

			expect(handleEnter).toHaveBeenCalledWith("1234567890");
		});

		it("handles controlled mode with formatted display", () => {
			const handleChange = jest.fn();
			const { rerender } = render(
				<Input
					label="Mobile Number"
					isNumInput={true}
					maxLength={10}
					value=""
					onChange={handleChange}
				/>
			);

			const input = screen.getByLabelText(/mobile number/i);
			expect(input).toHaveValue("");

			rerender(
				<Input
					label="Mobile Number"
					isNumInput={true}
					maxLength={10}
					value="1234567890"
					onChange={handleChange}
				/>
			);

			expect(input).toHaveValue("123 456 7890");
		});

		it("handles partial input correctly", () => {
			const handleChange = jest.fn();

			render(
				<Input
					label="Mobile Number"
					isNumInput={true}
					maxLength={10}
					onChange={handleChange}
				/>
			);

			const input = screen.getByLabelText(/mobile number/i);
			fireEvent.change(input, { target: { value: "12345" } });

			expect(input).toHaveValue("123 45");
			const lastCall =
				handleChange.mock.calls[handleChange.mock.calls.length - 1];
			expect(lastCall[0].target.value).toBe("12345");
		});
	});

	describe("Regular Input (isNumInput=false)", () => {
		it("does not format regular text input", () => {
			const handleChange = jest.fn();

			render(
				<Input
					label="Username"
					isNumInput={false}
					onChange={handleChange}
				/>
			);

			const input = screen.getByLabelText(/username/i);
			fireEvent.change(input, { target: { value: "testuser123" } });

			expect(input).toHaveValue("testuser123");
			const lastCall =
				handleChange.mock.calls[handleChange.mock.calls.length - 1];
			expect(lastCall[0].target.value).toBe("testuser123");
		});

		it("uses provided maxLength without adjustment", () => {
			render(
				<Input label="Username" isNumInput={false} maxLength={10} />
			);

			const input = screen.getByLabelText(/username/i);
			expect(input).toHaveAttribute("maxLength", "10");
		});
	});
});
