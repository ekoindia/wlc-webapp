import Query from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("Query", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Query />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
