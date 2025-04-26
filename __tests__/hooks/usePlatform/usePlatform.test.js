import { usePlatform } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => usePlatform());
	expect(result.current).toBeDefined();
	// result.current = {"isMac": false, "platform": "Windows"}
	expect(result.current.platform).toBeDefined();
	expect(result.current.platform).toBe("Windows");
	expect(result.current.isMac).toBeDefined();
	expect(result.current.isMac).toBe(false);
});
