import Dashboard from "pages";
import { mockRouter, pageRender } from "test-utils";

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
