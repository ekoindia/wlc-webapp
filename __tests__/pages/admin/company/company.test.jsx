import Company from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("Company", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Company />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
