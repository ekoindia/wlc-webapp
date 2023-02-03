import { renderHook } from "test-utils";
import { useRequest } from "hooks";

test("renders hook", () => {
	const { result } = renderHook(() => useRequest());
	expect(result.current).toBeUndefined();
});
