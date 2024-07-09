import { useCamera } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useCamera());
	expect(result.current).toBeUndefined();
});
