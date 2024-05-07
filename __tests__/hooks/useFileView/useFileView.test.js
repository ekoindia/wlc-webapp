import { useFileView } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useFileView());
	expect(result.current).toBeUndefined();
});
