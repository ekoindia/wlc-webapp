import { pageRender, screen, mockRouter } from "test-utils";
import TrxnHistory from "pages";

describe("TrxnHistory", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<TrxnHistory />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
});
