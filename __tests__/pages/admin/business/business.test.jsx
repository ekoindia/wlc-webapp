import { pageRender, mockRouter } from "test-utils";
import Business from "pages";

describe("Business", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Business />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
