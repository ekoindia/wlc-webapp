import { pageRender, screen, mockRouter } from "test-utils";
import Admin from "pages";


describe("Admin", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Admin />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
