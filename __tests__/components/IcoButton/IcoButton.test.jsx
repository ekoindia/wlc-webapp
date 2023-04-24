import { IcoButton } from "components/IcoButton";
// import { render } from "test-utils";
import { render, screen } from "@testing-library/react";

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

describe("IcoButton", () => {
	it("renders without error with no attributes", () => {
		const { container } = render(<IcoButton />);
		expect(container).not.toBeEmptyDOMElement();
	});
	it("should render the button with the correct icon", () => {
		render(<IcoButton iconName="view-transaction-history" />);
		const iconElement = screen.getByLabelText("view-transaction-history");
		expect(iconElement).toBeInTheDocument();
	});

	it("should render the button with the correct size", () => {
		render(<IcoButton size="md" />);
		const buttonElement = screen.getByRole("button");
		expect(buttonElement).toHaveStyle({ width: "48px", height: "48px" });
	});

	it("should render the button with the correct theme", () => {
		render(<IcoButton theme="light" />);
		const buttonElement = screen.getByRole("button");
		expect(buttonElement).toHaveStyle({
			background: "#E9EDF1",
			border: "1px solid #E9EDF1",
		});
	});

	it("should render the button with the correct background color", () => {
		render(<IcoButton bg="red" />);
		const buttonElement = screen.getByRole("button");
		expect(buttonElement).toHaveStyle({ background: "red" });
	});

	it("should render the button with the correct rounding", () => {
		render(<IcoButton round="20" />);
		const buttonElement = screen.getByRole("button");
		expect(buttonElement).toHaveStyle({ borderRadius: "20px" });
	});

	it("should render the button with the correct box shadow", () => {
		render(<IcoButton boxShadow="0 0 5px black" />);
		const buttonElement = screen.getByRole("button");
		expect(buttonElement).toHaveStyle({ boxShadow: "0 0 5px black" });
	});

	it("should render the button with the correct title", () => {
		render(<IcoButton title="View transaction history" />);
		const buttonElement = screen.getByRole("button");
		expect(buttonElement).toHaveAttribute(
			"title",
			"View transaction history"
		);
	});

	it("should call onClick function when button is clicked", () => {
		const onClickMock = jest.fn();
		render(<IcoButton onClick={onClickMock} />);
		const buttonElement = screen.getByRole("button");
		buttonElement.click();
		expect(onClickMock).toHaveBeenCalled();
	});

	// Start by writting all possible test cases here using test.todo()
	// test.todo(
	// 	"TODO: add proper test cases for IcoButton in __tests__/components/IcoButton/IcoButton.test.jsx"
	// );
});
