import { useExternalResource } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useExternalResource());
	expect(result.current).toBeUndefined();
});
