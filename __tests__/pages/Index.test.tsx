import Index from "@/pages/index";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("index", () => {
	it("should render properly", () => {
		render(<Index />);

		const header = screen.getByRole("heading");
		const headerText = "hello team";

		expect(header).toHaveTextContent(headerText);
	});
});
