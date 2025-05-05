import { useExternalResource } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useExternalResource());
	expect(result.current).toBeDefined();
	expect(result.current.length).toBe(2);
	expect(result.current[0]).toBe("loading");
	expect(result.current[1]).toBeInstanceOf(Function);
});
