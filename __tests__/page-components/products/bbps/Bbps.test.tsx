import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Bbps } from "page-components/products/bbps/Bbps";
import { BbpsProducts } from "page-components/products/bbps/BbpsProducts";

// Mock the components
jest.mock("components", () => ({
	InfoTileGrid: ({ list }: { list: any[] }) => (
		<div data-testid="info-tile-grid">
			{list.map((item, index) => (
				<div key={index} data-testid={`tile-${item.id}`}>
					{item.label}
				</div>
			))}
		</div>
	),
	PageTitle: ({ title }: { title: string }) => (
		<h1 data-testid="page-title">{title}</h1>
	),
}));

describe("Bbps Component", () => {
	it("renders without error", () => {
		render(<Bbps />);

		expect(screen.getByTestId("page-title")).toBeInTheDocument();
		expect(screen.getByTestId("info-tile-grid")).toBeInTheDocument();
	});

	it("displays correct page title", () => {
		render(<Bbps />);

		expect(screen.getByTestId("page-title")).toHaveTextContent(
			"Bharat Bill Payment System"
		);
	});

	it("renders InfoTileGrid with BbpsProducts", () => {
		render(<Bbps />);

		const tileGrid = screen.getByTestId("info-tile-grid");
		expect(tileGrid).toBeInTheDocument();

		// Check that all products are rendered
		BbpsProducts.forEach((product) => {
			expect(
				screen.getByTestId(`tile-${product.id}`)
			).toBeInTheDocument();
			expect(screen.getByTestId(`tile-${product.id}`)).toHaveTextContent(
				product.label
			);
		});
	});

	it("renders with correct structure", () => {
		const { container } = render(<Bbps />);

		// Check that the component has the expected structure
		expect(container.firstChild).toMatchSnapshot();
	});

	it("displays all BBPS products", () => {
		render(<Bbps />);

		// Verify specific products are displayed
		expect(screen.getByTestId("tile-corporate-cc")).toHaveTextContent(
			"Corporate Credit Card"
		);
		expect(screen.getByTestId("tile-loan")).toHaveTextContent("Loan");
	});

	it("renders consistently on multiple renders", () => {
		const { rerender } = render(<Bbps />);

		expect(screen.getByTestId("page-title")).toHaveTextContent(
			"Bharat Bill Payment System"
		);

		rerender(<Bbps />);

		expect(screen.getByTestId("page-title")).toHaveTextContent(
			"Bharat Bill Payment System"
		);
		expect(screen.getByTestId("info-tile-grid")).toBeInTheDocument();
	});
});
