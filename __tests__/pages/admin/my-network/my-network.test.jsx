import MyNetwork from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("MyNetwork", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<MyNetwork />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
