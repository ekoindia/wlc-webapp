import Configurations from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("Configurations", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Configurations />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
