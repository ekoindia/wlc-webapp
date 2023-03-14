import { pageRender, screen, mockRouter } from "test-utils";
import Dashboard from "pages";

describe("Dashboard", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Dashboard />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
