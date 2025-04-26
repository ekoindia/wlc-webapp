import { useCamera } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useCamera());
	expect(result.current).toBeDefined();
	expect(result.current.openCamera).toBeDefined();
	expect(result.current.result).toBeDefined();
	expect(result.current.status).toBeDefined();
});
