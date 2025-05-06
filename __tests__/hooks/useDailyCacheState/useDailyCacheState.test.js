import { useDailyCacheState } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useDailyCacheState());
	expect(result.current).toBeDefined();
	expect(result.current.length).toBe(3);
	expect(result.current[0]).toBeUndefined();
	expect(result.current[1]).toBeInstanceOf(Function);
	expect(result.current[2]).toBe(true);
});
