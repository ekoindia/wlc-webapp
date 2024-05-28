import { useGeolocation } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useGeolocation());
	expect(result.current).toBeUndefined();
});
