import { useHotkey } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useHotkey());
	expect(result.current).toBeUndefined();
});
