import { About } from "page-components/About";
import { fireEvent, pageRender } from "test-utils";

describe("About component", () => {
	it("renders without error", () => {
		const { container } = pageRender(<About />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders About view with menu items by default", () => {
		const { getByText } = pageRender(<About />);
		// expect(getByText("Report an Issue")).toBeInTheDocument();
		expect(getByText("Privacy Policy")).toBeInTheDocument();
		expect(getByText("Troubleshoot")).toBeInTheDocument();
	});

	it("navigates to Troubleshoot view when clicking Troubleshoot menu item", () => {
		const { getByText, queryByText } = pageRender(<About />);

		// Click Troubleshoot menu item
		const troubleshootButton = getByText("Troubleshoot");
		fireEvent.click(troubleshootButton);

		// Check that Troubleshoot view is shown
		expect(getByText("Display")).toBeInTheDocument();
		// About menu should not be visible anymore
		expect(queryByText("Report an Issue")).not.toBeInTheDocument();
	});

	it("navigates back to About view when clicking back button", () => {
		const { getByText, getByLabelText } = pageRender(<About />);

		// Navigate to Troubleshoot
		fireEvent.click(getByText("Troubleshoot"));

		// Click back button
		const backButton = getByLabelText("Go back");
		fireEvent.click(backButton);

		// Check that About view is shown again
		// expect(getByText("Report an Issue")).toBeInTheDocument();
		expect(getByText("Privacy Policy")).toBeInTheDocument();
	});

	it("accepts onClose prop without error", () => {
		const mockOnClose = jest.fn();
		const { container } = pageRender(<About onClose={mockOnClose} />);
		expect(container).not.toBeEmptyDOMElement();
	});
});
