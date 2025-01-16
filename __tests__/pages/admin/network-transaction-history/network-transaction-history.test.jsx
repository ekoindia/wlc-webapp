import NetworkTransactionHistory from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("NetworkTransactionHistory", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<NetworkTransactionHistory />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
