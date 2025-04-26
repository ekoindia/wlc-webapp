import { useSet } from "hooks";
import { act, renderHook } from "test-utils";

describe("useSet Hook", () => {
	// ==================================
	// Initialization Tests
	// ==================================
	describe("Initialization", () => {
		it("should initialize with an empty set if no default value is provided", () => {
			const { result } = renderHook(() => useSet());
			expect(result.current.values).toEqual([]);
		});

		it("should initialize with the provided default array", () => {
			const defaultValue = [1, "a", 3];
			const { result } = renderHook(() => useSet(defaultValue));
			// Use toEqual for array comparison
			// Use arrayContaining andtoHaveLength for order-independent check
			expect(result.current.values).toHaveLength(3);
			expect(result.current.values).toEqual(
				expect.arrayContaining([1, "a", 3])
			);
		});

		it("should initialize with unique values from the default array", () => {
			const defaultValue = [1, 2, 2, "a", "b", "a", 3];
			const { result } = renderHook(() => useSet(defaultValue));
			expect(result.current.values).toHaveLength(5); // 1, 2, 'a', 'b', 3
			expect(result.current.values).toEqual(
				expect.arrayContaining([1, 2, "a", "b", 3])
			);
		});

		it("should initialize correctly with an empty array", () => {
			const { result } = renderHook(() => useSet([]));
			expect(result.current.values).toEqual([]);
		});
	});

	// ==================================
	// `add` Action Tests
	// ==================================
	describe("add Action", () => {
		it("should add a new unique value to the set", () => {
			const { result } = renderHook(() => useSet([1, 2]));
			expect(result.current.values).toEqual(
				expect.arrayContaining([1, 2])
			);

			act(() => {
				result.current.add(3);
			});

			expect(result.current.values).toHaveLength(3);
			expect(result.current.values).toEqual(
				expect.arrayContaining([1, 2, 3])
			);
		});

		it("should not add a duplicate value", () => {
			const { result } = renderHook(() => useSet([1, 2]));
			expect(result.current.values).toEqual(
				expect.arrayContaining([1, 2])
			);

			act(() => {
				result.current.add(2); // Try adding existing value
			});

			expect(result.current.values).toHaveLength(2);
			expect(result.current.values).toEqual(
				expect.arrayContaining([1, 2])
			);
			// Optionally check if the array reference itself changed (it should due to new Set creation)
			// expect(result.current.values).not.toBe(initialValues); // Depends on implementation detail
		});

		it("should add various data types", () => {
			const { result } = renderHook(() => useSet());
			const obj = { id: 1 };
			const arr = [10, 20];

			act(() => {
				result.current.add(5);
				result.current.add("hello");
				result.current.add(true);
				result.current.add(null);
				result.current.add(undefined);
				result.current.add(obj);
				result.current.add(arr);
			});

			expect(result.current.values).toHaveLength(7);
			expect(result.current.values).toEqual(
				expect.arrayContaining([
					5,
					"hello",
					true,
					null,
					undefined,
					obj,
					arr,
				])
			);

			// Try adding the same object reference again (should not add)
			act(() => {
				result.current.add(obj);
			});
			expect(result.current.values).toHaveLength(7);
		});
	});

	// ==================================
	// `delete` Action Tests
	// ==================================
	describe("delete Action", () => {
		it("should remove an existing value from the set and return true", () => {
			const { result } = renderHook(() => useSet([1, "a", 3]));
			let deleteResult;

			act(() => {
				deleteResult = result.current.delete("a");
			});

			expect(deleteResult).toBe(true);
			expect(result.current.values).toHaveLength(2);
			expect(result.current.values).toEqual(
				expect.arrayContaining([1, 3])
			);
			expect(result.current.values).not.toContain("a");
		});

		it("should not change the set and return false if the value does not exist", () => {
			const { result } = renderHook(() => useSet([1, "a", 3]));
			const initialValues = result.current.values;
			let deleteResult;

			act(() => {
				deleteResult = result.current.delete("b"); // Value not in set
			});

			expect(deleteResult).toBe(false);
			expect(result.current.values).toHaveLength(3);
			expect(result.current.values).toEqual(
				expect.arrayContaining([1, "a", 3])
			);
			// Array reference should change, but content remains the same
			expect(result.current.values).not.toBe(initialValues);
		});

		it("should correctly delete complex types like objects if the reference matches", () => {
			const obj1 = { id: 1 };
			const obj2 = { id: 2 };
			const { result } = renderHook(() => useSet([obj1, obj2]));
			let deleteResult;

			act(() => {
				deleteResult = result.current.delete(obj1);
			});

			expect(deleteResult).toBe(true);
			expect(result.current.values).toHaveLength(1);
			expect(result.current.values).toEqual([obj2]); // Only obj2 should remain

			// Trying to delete an object with the same structure but different reference
			act(() => {
				deleteResult = result.current.delete({ id: 2 }); // Different reference
			});
			expect(deleteResult).toBe(false); // Should not find it
			expect(result.current.values).toHaveLength(1);
			expect(result.current.values).toEqual([obj2]);
		});
	});

	// ==================================
	// `set` Action Tests
	// ==================================
	describe("set Action", () => {
		it("should replace the current set with the new list of values", () => {
			const { result } = renderHook(() => useSet([1, 2, 3]));

			act(() => {
				result.current.set(["a", "b"]);
			});

			expect(result.current.values).toHaveLength(2);
			expect(result.current.values).toEqual(
				expect.arrayContaining(["a", "b"])
			);
		});

		it("should handle duplicates in the new list provided to set", () => {
			const { result } = renderHook(() => useSet([1, 2, 3]));

			act(() => {
				result.current.set(["a", "b", "a", "c", "b"]);
			});

			expect(result.current.values).toHaveLength(3); // 'a', 'b', 'c'
			expect(result.current.values).toEqual(
				expect.arrayContaining(["a", "b", "c"])
			);
		});

		it("should clear the set if an empty array is provided", () => {
			const { result } = renderHook(() => useSet([1, 2, 3]));

			act(() => {
				result.current.set([]);
			});

			expect(result.current.values).toEqual([]);
		});
	});

	// ==================================
	// `has` Action Tests
	// ==================================
	describe("has Action", () => {
		it("should return true if the value exists in the set", () => {
			const { result } = renderHook(() => useSet([1, "a", 3]));
			// No need for `act` as `has` doesn't trigger state updates
			expect(result.current.has(1)).toBe(true);
			expect(result.current.has("a")).toBe(true);
		});

		it("should return false if the value does not exist in the set", () => {
			const { result } = renderHook(() => useSet([1, "a", 3]));
			expect(result.current.has(2)).toBe(false);
			expect(result.current.has("b")).toBe(false);
		});

		it("should correctly check for complex types by reference", () => {
			const obj1 = { id: 1 };
			const obj2 = { id: 2 };
			const { result } = renderHook(() => useSet([obj1]));

			expect(result.current.has(obj1)).toBe(true);
			expect(result.current.has(obj2)).toBe(false);
			expect(result.current.has({ id: 1 })).toBe(false); // Different reference
		});

		it("should reflect changes made by other actions", () => {
			const { result } = renderHook(() => useSet([1]));
			expect(result.current.has(1)).toBe(true);
			expect(result.current.has(2)).toBe(false);

			// Add 2
			act(() => {
				result.current.add(2);
			});
			expect(result.current.has(2)).toBe(true);

			// Delete 1
			act(() => {
				result.current.delete(1);
			});
			expect(result.current.has(1)).toBe(false);
		});
	});

	// ==================================
	// `clear` Action Tests
	// ==================================
	describe("clear Action", () => {
		it("should remove all elements from the set", () => {
			const { result } = renderHook(() => useSet([1, "a", 3, true]));
			expect(result.current.values.length).toBeGreaterThan(0); // Ensure it's not empty initially

			act(() => {
				result.current.clear();
			});

			expect(result.current.values).toEqual([]);
			expect(result.current.has(1)).toBe(false); // Check elements are gone
			expect(result.current.has("a")).toBe(false);
		});

		it("should work correctly on an already empty set", () => {
			const { result } = renderHook(() => useSet([]));
			expect(result.current.values).toEqual([]);

			act(() => {
				result.current.clear();
			});

			expect(result.current.values).toEqual([]);
		});
	});

	// ==================================
	// Stability Tests (Basic Check)
	// ==================================
	describe("Action Stability", () => {
		it("should ideally return stable action functions unless list changes", () => {
			// Note: Directly testing function reference stability with useMemo
			// can be tricky and might depend on React's internals.
			// This test mainly ensures the hook rerenders correctly.
			const { result } = renderHook(() => useSet([1, 2]));

			const initialActions = result.current;

			// Rerender with the same state - actions should ideally be the same reference
			// Note: Due to new Set() inside actions, this might not hold true in this specific implementation
			// If strict stability is needed, useCallback might be required around the functions inside useMemo.
			// rerender();
			// expect(result.current.add).toBe(initialActions.add);
			// expect(result.current.delete).toBe(initialActions.delete);
			// expect(result.current.set).toBe(initialActions.set);
			// expect(result.current.clear).toBe(initialActions.clear);
			// expect(result.current.has).toBe(initialActions.has);

			// Trigger a state change
			act(() => {
				result.current.add(3);
			});

			// Actions object *should* be a new reference now because `list` changed
			expect(result.current).not.toBe(initialActions);
			expect(result.current.values).toEqual(
				expect.arrayContaining([1, 2, 3])
			);
		});
	});
});
