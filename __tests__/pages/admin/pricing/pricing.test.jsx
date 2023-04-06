import Pricing from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("Pricing", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Pricing />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
