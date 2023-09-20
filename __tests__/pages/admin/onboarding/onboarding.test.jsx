import Onboarding from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("Onboarding", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Onboarding />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
