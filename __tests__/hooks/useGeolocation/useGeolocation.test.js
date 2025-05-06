import { useGeolocation } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useGeolocation());
	expect(result.current).toBeDefined();
	expect(result.current.accuracy).toBe(5);
	expect(result.current.latitude).toBe(27.01234);
	expect(result.current.longitude).toBe(38.01234);
});
