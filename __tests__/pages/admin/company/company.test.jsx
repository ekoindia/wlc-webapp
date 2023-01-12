import { pageRender, screen, mockRouter } from "test-utils";
import Company from "pages";


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
