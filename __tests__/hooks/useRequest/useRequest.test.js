import { useRequest } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useRequest());
	expect(result.current).toBeUndefined();
});
