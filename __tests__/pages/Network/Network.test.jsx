import { pageRender, screen, mockRouter } from "test-utils";
import Network from "pages";

describe("Network", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Network />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
