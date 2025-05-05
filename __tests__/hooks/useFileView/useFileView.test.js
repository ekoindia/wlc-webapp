import { useFileView } from "hooks";
import { renderHook } from "test-utils";

test("renders hook - useFileView", () => {
	const { result } = renderHook(() => useFileView());
	expect(result.current).toBeDefined();
	expect(result.current.showImage).toBeInstanceOf(Function);
	expect(result.current.showMedia).toBeInstanceOf(Function);
	expect(result.current.showWebpage).toBeInstanceOf(Function);
	expect(result.current.showFile).toBeInstanceOf(Function);
});
