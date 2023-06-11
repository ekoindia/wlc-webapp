import Notifications from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("Notifications", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Notifications />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
