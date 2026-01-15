import { act, renderHook } from "@testing-library/react";
import { useColumnVisibility } from "hooks/useColumnVisibility";

// Mock localStorage
const localStorageMock = (() => {
	let store = {};
	return {
		getItem: (key) => store[key] || null,
		setItem: (key, value) => {
			store[key] = value.toString();
		},
		clear: () => {
			store = {};
		},
		removeItem: (key) => {
			delete store[key];
		},
	};
})();

Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

describe("useColumnVisibility hook", () => {
	const testColumns = [
		{
			name: "col1",
			label: "Column 1",
			visible_in_table: true,
			hide_by_default: false,
		},
		{
			name: "col2",
			label: "Column 2",
			visible_in_table: true,
			hide_by_default: true,
		},
		{
			name: "col3",
			label: "Column 3",
			visible_in_table: false,
			hide_by_default: false,
		},
		{ name: "col4", label: "Column 4", visible_in_table: true },
	];

	beforeEach(() => {
		localStorageMock.clear();
	});

	it("initializes with empty hiddenColumns", () => {
		const { result } = renderHook(() =>
			useColumnVisibility({
				storageKey: "testHiddenCols",
				columns: testColumns,
			})
		);

		expect(result.current.hiddenColumns).toEqual({});
	});

	it("toggles column visibility", () => {
		const { result } = renderHook(() =>
			useColumnVisibility({
				storageKey: "testHiddenCols",
				columns: testColumns,
			})
		);

		act(() => {
			result.current.toggleColumnVisibility("col1", true);
		});

		expect(result.current.hiddenColumns).toEqual({ col1: true });

		act(() => {
			result.current.toggleColumnVisibility("col1", false);
		});

		expect(result.current.hiddenColumns).toEqual({ col1: false });
	});

	it("resets column visibility", () => {
		const { result } = renderHook(() =>
			useColumnVisibility({
				storageKey: "testHiddenCols",
				columns: testColumns,
			})
		);

		act(() => {
			result.current.toggleColumnVisibility("col1", true);
		});

		act(() => {
			result.current.toggleColumnVisibility("col2", false);
		});

		expect(result.current.hiddenColumns.col1).toBe(true);
		expect(result.current.hiddenColumns.col2).toBe(false);

		act(() => {
			result.current.resetColumnVisibility();
		});

		expect(result.current.hiddenColumns).toEqual({});
	});

	it("checks if column is hidden", () => {
		const { result } = renderHook(() =>
			useColumnVisibility({
				storageKey: "testHiddenCols",
				columns: testColumns,
			})
		);

		// Column not in hiddenColumns, uses hide_by_default
		expect(result.current.isColumnHidden("col2", testColumns[1])).toBe(
			true
		);
		expect(result.current.isColumnHidden("col1", testColumns[0])).toBe(
			false
		);

		act(() => {
			result.current.toggleColumnVisibility("col1", true);
		});

		// Column in hiddenColumns, uses hiddenColumns value
		expect(result.current.isColumnHidden("col1", testColumns[0])).toBe(
			true
		);
	});

	it("filters visible columns correctly", () => {
		const { result } = renderHook(() =>
			useColumnVisibility({
				storageKey: "testHiddenCols",
				columns: testColumns,
			})
		);

		// Initially: col1, col4 visible (col2 hide_by_default=true, col3 visible_in_table=false)
		const visibleColumns = result.current.getVisibleColumns();
		expect(visibleColumns).toHaveLength(2);
		expect(visibleColumns.map((col) => col.name)).toEqual(["col1", "col4"]);

		// Hide col1
		act(() => {
			result.current.toggleColumnVisibility("col1", true);
		});

		const afterToggle = result.current.getVisibleColumns();
		expect(afterToggle).toHaveLength(1);
		expect(afterToggle.map((col) => col.name)).toEqual(["col4"]);

		// Show col2 (was hidden by default)
		act(() => {
			result.current.toggleColumnVisibility("col2", false);
		});

		const afterShowCol2 = result.current.getVisibleColumns();
		expect(afterShowCol2).toHaveLength(2);
		expect(afterShowCol2.map((col) => col.name)).toEqual(["col2", "col4"]);
	});

	it("persists state in localStorage", () => {
		const storageKey = "testHiddenCols";

		const { result: result1 } = renderHook(() =>
			useColumnVisibility({
				storageKey,
				columns: testColumns,
			})
		);

		act(() => {
			result1.current.toggleColumnVisibility("col1", true);
		});

		// Create new hook instance with same storage key
		const { result: result2 } = renderHook(() =>
			useColumnVisibility({
				storageKey,
				columns: testColumns,
			})
		);

		// Should have persisted state
		expect(result2.current.hiddenColumns).toEqual({ col1: true });
	});

	it("handles columns without visible_in_table property", () => {
		const columnsWithoutProperty = [
			{ name: "col1", label: "Column 1" },
			{ name: "col2", label: "Column 2", hide_by_default: true },
		];

		const { result } = renderHook(() =>
			useColumnVisibility({
				storageKey: "testHiddenCols",
				columns: columnsWithoutProperty,
			})
		);

		// Should include col1, exclude col2 (hide_by_default)
		const visibleColumns = result.current.getVisibleColumns();
		expect(visibleColumns).toHaveLength(1);
		expect(visibleColumns[0].name).toBe("col1");
	});

	it("filters custom column array when provided to getVisibleColumns", () => {
		const { result } = renderHook(() =>
			useColumnVisibility({
				storageKey: "testHiddenCols",
				columns: testColumns,
			})
		);

		act(() => {
			result.current.toggleColumnVisibility("col1", true);
		});

		const customColumns = [
			{ name: "col1", label: "Custom 1", visible_in_table: true },
			{ name: "col5", label: "Custom 5", visible_in_table: true },
		];

		const visibleColumns = result.current.getVisibleColumns(customColumns);
		// col1 is hidden, col5 is visible
		expect(visibleColumns).toHaveLength(1);
		expect(visibleColumns[0].name).toBe("col5");
	});
});
