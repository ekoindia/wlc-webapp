import Issue from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("Issue", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Issue />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
