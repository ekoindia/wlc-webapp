import Profile from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("Profile", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Profile />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
