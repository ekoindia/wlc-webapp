import { pageRender, screen, mockRouter } from "test-utils";
import Home from "pages";

describe("Home", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Home />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
