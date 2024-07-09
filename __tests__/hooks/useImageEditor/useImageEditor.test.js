import { useImageEditor } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useImageEditor());
	expect(result.current).toBeUndefined();
});
