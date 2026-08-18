import Calendar from "components/Calendar/Calendar";
import { render, screen } from "test-utils";

/**
 * showPicker() throws a SecurityError for date inputs inside a cross-origin
 * iframe, so the hidden 1px input the component normally relies on could never
 * open the picker for an embedded page (see /gateway/*). There, the native
 * input has to become the visible, clickable control instead.
 */
describe("Calendar inside a cross-origin iframe", () => {
	const dateInput = (container: HTMLElement) =>
		container.querySelector('input[type="date"]') as HTMLInputElement;

	/** Simulate being framed by a cross-origin page: reading top.location throws. */
	const mockCrossOriginTop = () => {
		const crossOriginTop = {
			get location(): Location {
				throw new DOMException("Blocked a frame", "SecurityError");
			},
		};
		jest.spyOn(window, "top", "get").mockReturnValue(
			crossOriginTop as unknown as Window
		);
	};

	afterEach(() => jest.restoreAllMocks());

	it("shows the native date input instead of the hidden one", () => {
		mockCrossOriginTop();

		const { container } = render(<Calendar value="2026-08-18" />);
		const input = dateInput(container);

		expect(input).toBeVisible();
		expect(input.style.opacity).not.toBe("0");
		expect(input.style.pointerEvents).not.toBe("none");
		// The native control draws its own indicator, and it renders the value,
		// so the stand-in text is not duplicated.
		expect(screen.queryByText("2026-08-18")).not.toBeInTheDocument();
	});

	it("does not call showPicker (it would throw)", () => {
		mockCrossOriginTop();
		const showPicker = jest.fn();
		HTMLInputElement.prototype.showPicker = showPicker;

		const { container } = render(<Calendar />);
		dateInput(container).parentElement?.click();

		expect(showPicker).not.toHaveBeenCalled();
	});

	it("keeps the hidden-input behaviour when not embedded", () => {
		const { container } = render(<Calendar value="2026-08-18" />);
		const input = dateInput(container);

		expect(input.style.opacity).toBe("0");
		expect(input.style.pointerEvents).toBe("none");
		expect(screen.getByText("2026-08-18")).toBeInTheDocument();
	});
});
