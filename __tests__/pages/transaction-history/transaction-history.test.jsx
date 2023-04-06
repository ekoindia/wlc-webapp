import TransactionHistory from "pages";
import { mockRouter, pageRender } from "test-utils";

describe("TransactionHistory", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<TransactionHistory />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
