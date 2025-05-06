import { expect } from "@storybook/test";
import { useImageEditor } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useImageEditor());
	expect(result.current).toBeDefined();
	// result.current = {"editImage": [Function editImage], "result": null, "status": "idle"}
	expect(result.current.editImage).toBeDefined();
	expect(result.current.editImage).toBeInstanceOf(Function);
	expect(result.current.result).toBeNull();
	expect(result.current.status).toBe("idle");
});
