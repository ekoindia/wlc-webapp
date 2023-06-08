import { useDailyCacheState } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useDailyCacheState());
	expect(result.current).toBeUndefined();
});
