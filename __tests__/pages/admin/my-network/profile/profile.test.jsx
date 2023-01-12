import { pageRender, screen, mockRouter } from "test-utils";
import Profile from "pages";

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
