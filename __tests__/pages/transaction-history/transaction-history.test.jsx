import { pageRender, screen, mockRouter } from "test-utils";
import TransactionHistory from "pages";

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
