import NetworkStatement from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("NetworkStatement", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<NetworkStatement />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
