import { useClipboard } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useClipboard());
	expect(result.current).toBeUndefined();
});
