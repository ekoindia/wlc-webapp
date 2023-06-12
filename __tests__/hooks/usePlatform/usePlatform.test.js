import { usePlatform } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => usePlatform());
	expect(result.current).toBeUndefined();
});
