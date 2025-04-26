import { useClipboard } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useClipboard());
	expect(result.current).toBeDefined();
	expect(result.current.copy).toBeDefined();
	expect(result.current.copy).toBeInstanceOf(Function);
	expect(result.current.state).toBeDefined();
	expect(result.current.state).toBeInstanceOf(Object);
});
