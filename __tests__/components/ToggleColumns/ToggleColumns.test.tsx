import { fireEvent, render } from "@testing-library/react";
import { ToggleColumns } from "components";

describe("ToggleColumns component", () => {
	const mockColumns = [
		{ name: "col1", label: "Column 1", visible_in_table: true },
		{
			name: "col2",
			label: "Column 2",
			visible_in_table: true,
			hide_by_default: true,
		},
		{ name: "col3", label: "Column 3", visible_in_table: true },
	];

	const mockHiddenColumns = {
		col2: true,
	};

	const mockOnToggle = jest.fn();
	const mockOnReset = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders successfully", () => {
		const { container } = render(
			<ToggleColumns
				columns={mockColumns}
				hiddenColumns={mockHiddenColumns}
				onToggle={mockOnToggle}
				onReset={mockOnReset}
			/>
		);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("displays all column labels", () => {
		const { getByText } = render(
			<ToggleColumns
				columns={mockColumns}
				hiddenColumns={mockHiddenColumns}
				onToggle={mockOnToggle}
				onReset={mockOnReset}
			/>
		);

		expect(getByText("Column 1")).toBeInTheDocument();
		expect(getByText("Column 2")).toBeInTheDocument();
		expect(getByText("Column 3")).toBeInTheDocument();
	});

	it("displays default title text", () => {
		const { getByText } = render(
			<ToggleColumns
				columns={mockColumns}
				hiddenColumns={mockHiddenColumns}
				onToggle={mockOnToggle}
				onReset={mockOnReset}
			/>
		);

		expect(
			getByText("Show or hide columns in the table:")
		).toBeInTheDocument();
	});

	it("displays custom title text when provided", () => {
		const { getByText } = render(
			<ToggleColumns
				columns={mockColumns}
				hiddenColumns={mockHiddenColumns}
				onToggle={mockOnToggle}
				onReset={mockOnReset}
				title="Custom title"
			/>
		);

		expect(getByText("Custom title")).toBeInTheDocument();
	});

	it("displays default reset button text", () => {
		const { getByText } = render(
			<ToggleColumns
				columns={mockColumns}
				hiddenColumns={mockHiddenColumns}
				onToggle={mockOnToggle}
				onReset={mockOnReset}
			/>
		);

		expect(getByText("Reset Columns")).toBeInTheDocument();
	});

	it("displays custom reset button text when provided", () => {
		const { getByText } = render(
			<ToggleColumns
				columns={mockColumns}
				hiddenColumns={mockHiddenColumns}
				onToggle={mockOnToggle}
				onReset={mockOnReset}
				resetButtonText="Reset All"
			/>
		);

		expect(getByText("Reset All")).toBeInTheDocument();
	});

	it("shows switches in correct state based on hiddenColumns", () => {
		const { getAllByRole } = render(
			<ToggleColumns
				columns={mockColumns}
				hiddenColumns={mockHiddenColumns}
				onToggle={mockOnToggle}
				onReset={mockOnReset}
			/>
		);

		const switches = getAllByRole("checkbox");

		// col1: not hidden (checked)
		expect(switches[0]).toBeChecked();

		// col2: hidden (not checked)
		expect(switches[1]).not.toBeChecked();

		// col3: not hidden (checked)
		expect(switches[2]).toBeChecked();
	});

	it("respects hide_by_default when column not in hiddenColumns", () => {
		const { getAllByRole } = render(
			<ToggleColumns
				columns={mockColumns}
				hiddenColumns={{}} // Empty, so should use hide_by_default
				onToggle={mockOnToggle}
				onReset={mockOnReset}
			/>
		);

		const switches = getAllByRole("checkbox");

		// col1: not hidden by default (checked)
		expect(switches[0]).toBeChecked();

		// col2: hidden by default (not checked)
		expect(switches[1]).not.toBeChecked();

		// col3: not hidden by default (checked)
		expect(switches[2]).toBeChecked();
	});

	it("calls onToggle when switch is clicked", () => {
		const { getAllByRole } = render(
			<ToggleColumns
				columns={mockColumns}
				hiddenColumns={mockHiddenColumns}
				onToggle={mockOnToggle}
				onReset={mockOnReset}
			/>
		);

		const switches = getAllByRole("checkbox");

		// Click first switch (col1, currently visible)
		fireEvent.click(switches[0]);

		expect(mockOnToggle).toHaveBeenCalledWith("col1", true);

		// Click second switch (col2, currently hidden)
		fireEvent.click(switches[1]);

		expect(mockOnToggle).toHaveBeenCalledWith("col2", false);
	});

	it("calls onReset when reset button is clicked", () => {
		const { getByText } = render(
			<ToggleColumns
				columns={mockColumns}
				hiddenColumns={mockHiddenColumns}
				onToggle={mockOnToggle}
				onReset={mockOnReset}
			/>
		);

		const resetButton = getByText("Reset Columns");
		fireEvent.click(resetButton);

		expect(mockOnReset).toHaveBeenCalledTimes(1);
	});

	it("handles empty columns array", () => {
		const { container } = render(
			<ToggleColumns
				columns={[]}
				hiddenColumns={{}}
				onToggle={mockOnToggle}
				onReset={mockOnReset}
			/>
		);

		// Should still render but with no switches
		expect(container).not.toBeEmptyDOMElement();
		const switches = container.querySelectorAll('input[type="checkbox"]');
		expect(switches).toHaveLength(0);
	});

	it("handles undefined columns", () => {
		const { container } = render(
			<ToggleColumns
				columns={undefined}
				hiddenColumns={{}}
				onToggle={mockOnToggle}
				onReset={mockOnReset}
			/>
		);

		expect(container).not.toBeEmptyDOMElement();
	});
});
