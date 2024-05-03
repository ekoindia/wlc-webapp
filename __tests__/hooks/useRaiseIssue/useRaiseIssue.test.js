import { useRaiseIssue } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useRaiseIssue());
	expect(result.current).toBeUndefined();
});
