import { useFeatureFlag } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useFeatureFlag());
	expect(result.current).toBeUndefined();
});
