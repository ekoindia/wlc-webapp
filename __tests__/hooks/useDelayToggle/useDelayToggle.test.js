import { useDelayToggle } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useDelayToggle());
	expect(result.current).toBeUndefined();
});
