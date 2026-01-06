import Calendar from "components/Calendar/Calendar";
import { render, screen } from "test-utils";

/*
	* React Testing Library:
		- Cheatsheet: https://testing-library.com/docs/react-testing-library/cheatsheet
		- How to query: https://testing-library.com/docs/queries/about/
		- Testing user events: https://testing-library.com/docs/user-event/intro
		- Migrate from Enzyme (examples): https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/
		- Testing onChange event handlers: https://testing-library.com/docs/react-testing-library/faq
		- All APIs: https://testing-library.com/docs/react-testing-library/api
		- Debug: https://testing-library.com/docs/queries/about/#screendebug, https://testing-library.com/docs/dom-testing-library/api-debugging/#prettydom
	* Jest:
		- Docs: https://jestjs.io/docs/getting-started
		- Jest-dom (matchers): https://github.com/testing-library/jest-dom
*/

describe("Calendar", () => {
	it("renders without error with no attributes", () => {
		const { container } = render(<Calendar />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders with a label", () => {
		render(<Calendar label="Start Date" />);
		expect(screen.getByText("Start Date")).toBeInTheDocument();
	});

	it("renders with a placeholder", () => {
render(<Calendar placeholder="From" />);
expect(screen.getByText("From")).toBeInTheDocument();
	});

	it("displays the value when provided", () => {
		render(<Calendar value="2024-06-15" />);
		expect(screen.getByText("2024-06-15")).toBeInTheDocument();
	});

	it("displays placeholder date when no value is provided", () => {
		render(<Calendar />);
		expect(screen.getByText("YYYY-MM-DD")).toBeInTheDocument();
	});

	it("renders the calendar icon", () => {
		const { container } = render(<Calendar />);
		// The Icon component should be present with the calendar icon
		expect(
			container.querySelector('[data-icon="calender"]') ||
				container.querySelector(".icon")
		).toBeTruthy();
	});

	// TODO: Write additional test cases
	test.todo("calls onChange when date is selected");
	test.todo("respects minDate constraint");
	test.todo("respects maxDate constraint");
	test.todo("shows required indicator when required prop is true");
});
