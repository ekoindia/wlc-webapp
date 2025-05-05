import { renderHook } from "test-utils";
import { useUseAiChatbotPopup } from "hooks";

describe("useUseAiChatbotPopup", () => {
	it("renders hook", () => {
		const { result } = renderHook(() => useUseAiChatbotPopup());
		expect(result.current).toBeDefined();
		// expect(result.current.some_property).toBeDefined();
		// expect(result.current.some_property).toBeInstanceOf(Function);
		// expect(result.current.length).toBe(2);
		// expect(result.current[0]).toBeInstanceOf(Function);
		// expect(result.current).toEqual({
		//    value: "",
		//    setValue: expect.any(Function),
		// });
	});
});

test.todo("TODO: Implement proper tests for UseAiChatbotPopup hook");
