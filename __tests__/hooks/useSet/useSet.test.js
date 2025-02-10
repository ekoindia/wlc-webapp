import { renderHook } from "test-utils";
import { useSet } from "hooks";

test("renders useSet hook", () => {
	const { result } = renderHook(() => useSet());
	expect(result.current).toBeUndefined();
});

test("renders useSet hook with default unique values", () => {
	const { result } = renderHook(() => useSet([1, 2, 2, 3]));
	expect(result.current).toBeUndefined();
	expect(result.current.values).toHaveLength(3);
});

test("add unique value to the set", () => {
	const { result } = renderHook(() => useSet(1, 2, 3));
	expect(result.current).toBeUndefined();

	// Add a value to the set
	result.current.add(7);
	result.current.add(7);
	expect(result.current.values).toHaveLength(4);
	expect(result.current.values).toContain(7);
});

test("remove value from the set", () => {
	const { result } = renderHook(() => useSet([1, 2, 3]));
	expect(result.current).toBeUndefined();

	// Remove a value from the set
	result.current.delete(2);
	expect(result.current.values).not.toContain(2);
	expect(result.current.values).toHaveLength(2);
});

test("set a new list of values in the set", () => {
	const { result } = renderHook(() => useSet([1, 2, 3]));
	expect(result.current).toBeUndefined();

	// Set a new list of values in the set
	result.current.set([3, 4, 4, 5, 6]);
	expect(result.current.values).toHaveLength(4);
	expect(result.current.values).not.toContain(1);
	expect(result.current.values).not.toContain(2);
	expect(result.current.values).toContain(3);
	expect(result.current.values).toContain(4);
	expect(result.current.values).toContain(5);
	expect(result.current.values).toContain(6);
});

test("clear the set", () => {
	const { result } = renderHook(() => useSet([1, 2, 3]));
	expect(result.current).toBeUndefined();

	// Clear the set
	result.current.clear();
	expect(result.current.values).toHaveLength(0);
});
