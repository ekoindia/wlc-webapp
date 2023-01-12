import { pageRender, screen, mockRouter } from "test-utils";
import Invoicing from "pages";


describe("Invoicing", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Invoicing />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
