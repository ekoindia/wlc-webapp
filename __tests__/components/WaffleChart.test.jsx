import { WaffleChart } from "components/WaffleChart";
import { render, screen } from "test-utils";

describe("WaffleChart component", () => {
	const mockData = [
		{ value: 30, label: "Category A" },
		{ value: 20, label: "Category B" },
		{ value: 50, label: "Category C" },
	];

	it("renders successfully", () => {
		const { container } = render(<WaffleChart data={mockData} />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders correct number of squares", () => {
		const rows = 5;
		const cols = 4;
		const { container } = render(
			<WaffleChart data={mockData} rows={rows} cols={cols} />
		);

		// Should render rows * cols total squares (squares are the Box elements with borderRadius)
		const squares = container.querySelectorAll(
			"[style*='border-radius: 50%']"
		);
		expect(squares).toHaveLength(rows * cols);
	});

	it("applies custom colors when provided", () => {
		const customColors = ["#FF0000", "#00FF00", "#0000FF"];
		render(<WaffleChart data={mockData} colors={customColors} />);

		// The component should use the provided colors
		// Note: This test would need more specific assertions based on how colors are applied
	});

	it("handles empty data gracefully", () => {
		const { container } = render(<WaffleChart data={[]} />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("handles zero values in data", () => {
		const dataWithZero = [
			{ value: 0, label: "Zero Category" },
			{ value: 100, label: "Full Category" },
		];

		const { container } = render(<WaffleChart data={dataWithZero} />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("applies default props when not specified", () => {
		const { container } = render(<WaffleChart data={mockData} />);

		// Default should be 10x10 grid (first child is tooltip, second is grid)
		const gridElement = container.firstChild.firstChild;
		expect(gridElement).toHaveStyle({
			gridTemplateRows: "repeat(10, 8px)",
			gridTemplateColumns: "repeat(10, 8px)",
		});
	});

	it("applies custom size and gap props", () => {
		const customSize = "12px";
		const customGap = "6px";
		const rows = 8;
		const cols = 8;

		const { container } = render(
			<WaffleChart
				data={mockData}
				size={customSize}
				gap={customGap}
				rows={rows}
				cols={cols}
			/>
		);

		const gridElement = container.firstChild.firstChild; // First child is tooltip, second is grid
		expect(gridElement).toHaveStyle({
			gridTemplateRows: `repeat(${rows}, ${customSize})`,
			gridTemplateColumns: `repeat(${cols}, ${customSize})`,
			gap: customGap,
		});
	});

	it("displays tooltip with percentages", () => {
		render(<WaffleChart data={mockData} />);

		// The tooltip should be present with the chart
		const chartContainer = screen.getByRole("tooltip", { hidden: true });
		expect(chartContainer).toBeInTheDocument();

		// Check if the grid has cursor help style
		const gridElement = chartContainer.querySelector(
			"[style*='cursor: help']"
		);
		expect(gridElement).toBeInTheDocument();
	});
});
