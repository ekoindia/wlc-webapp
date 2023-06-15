import BulkOnboarding from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("BulkOnboarding", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<BulkOnboarding />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
