import { pageRender, screen, mockRouter } from "test-utils";
import MyNetwork from "pages";


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
