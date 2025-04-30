import { RaiseIssueCard } from "page-components/RaiseIssueCard";
import { pageRender } from "test-utils";

describe("RaiseIssueCard", () => {
	it("renders without error with no attributes", () => {
		const { container } = pageRender(<RaiseIssueCard />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// TODO: Write other tests here..
	// Start by writting all possible test cases here using test.todo()
	test.todo(
		"TODO: add proper test cases for RaiseIssueCard in __tests__/components/RaiseIssueCard/RaiseIssueCard.test.jsx"
	);
});
