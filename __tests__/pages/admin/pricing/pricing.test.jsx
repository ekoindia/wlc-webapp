import { pageRender, screen, mockRouter } from "test-utils";
import Pricing from "pages";


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
