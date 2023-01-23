import { pageRender, screen, mockRouter } from "test-utils";
import DetailedStatement from "pages";

describe("DetailedStatement", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<DetailedStatement />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
