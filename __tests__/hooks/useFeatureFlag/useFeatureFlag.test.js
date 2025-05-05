import { useFeatureFlag } from "hooks";
import { renderHook } from "test-utils";

test("renders hook - useFeatureFlag", () => {
	const { result } = renderHook(() => useFeatureFlag());
	expect(result.current).toBeDefined();
	expect(result.current.length).toBe(2);
	expect(result.current[0]).toBe(false);
	expect(result.current[1]).toBeInstanceOf(Function);
});
