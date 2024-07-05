import { renderHook } from "test-utils";
import { useSwipe } from "hooks";

test("renders hook", () => {
	const { result } = renderHook(() => useSwipe());
	expect(result.current).toBeUndefined();
});
