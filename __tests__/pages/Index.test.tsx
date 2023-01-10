import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Index from "@/pages/Index";

describe("index", () => {
	it("should render properly", () => {
		render(<Index />);

		const header = screen.getByRole("heading");
		const headerText = "Hello Team";

		expect(header).toHaveTextContent(headerText);
	});
});
