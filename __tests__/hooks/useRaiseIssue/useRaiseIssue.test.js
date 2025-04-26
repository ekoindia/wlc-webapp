import { useRaiseIssue } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useRaiseIssue());
	expect(result.current).toEqual({
		result: null,
		showRaiseIssueDialog: expect.any(Function),
		status: "idle",
	});
	// result.current = {"result": null, "showRaiseIssueDialog": [Function showRaiseIssueDialog], "status": "idle"}
});
