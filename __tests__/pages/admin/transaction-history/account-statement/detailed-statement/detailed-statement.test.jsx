import DetailedStatement from "pages";
import { mockRouter, pageRender } from "test-utils";

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
