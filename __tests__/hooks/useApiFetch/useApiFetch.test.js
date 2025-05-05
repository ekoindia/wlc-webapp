import { useApiFetch } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useApiFetch());
	expect(result.current).toBeDefined();
	expect(result.current.length).toBe(3);
	expect(result.current[0]).toBeInstanceOf(Function);
	expect(result.current[1]).toBe(false);
	expect(result.current[2]).toBeInstanceOf(Function);
});
