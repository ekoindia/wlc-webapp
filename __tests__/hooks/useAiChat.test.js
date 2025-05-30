import { act, renderHook } from "@testing-library/react";
import { useSession, useUser } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { useAiChat } from "hooks/useAiChat";

// Mock the dependencies
jest.mock("contexts", () => ({
	useSession: jest.fn(),
	useUser: jest.fn(),
}));

jest.mock("helpers/apiHelper", () => ({
	fetcher: jest.fn(),
}));

describe("useAiChat hook", () => {
	const mockAccessToken = "mock-access-token";
	const mockFetcher = fetcher;
	const mockUseSession = useSession;
	const mockUseUser = useUser;

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseSession.mockReturnValue({
			accessToken: mockAccessToken,
		});
		mockUseUser.mockReturnValue({
			isLoggedIn: true,
		});
	});

	it("should initialize with correct default values", () => {
		const { result } = renderHook(() => useAiChat());

		expect(result.current.chatLines).toEqual([]);
		expect(result.current.inputValue).toBe("");
		expect(result.current.busy).toBe(false);
		expect(result.current.isDisabled).toBe(false);
		expect(result.current.hasReachedLimit).toBe(false);
		expect(result.current.isEmpty).toBe(true);
		expect(result.current.chatState).toBe("ready");
		expect(result.current.maxChatLines).toBe(10);
	});

	it("should initialize with custom maxChatLines", () => {
		const { result } = renderHook(() => useAiChat({ maxChatLines: 5 }));

		expect(result.current.maxChatLines).toBe(5);
	});

	it("should send chat input correctly", async () => {
		mockFetcher.mockResolvedValueOnce({
			reply: "AI response",
		});

		const { result } = renderHook(() => useAiChat());

		act(() => {
			result.current.sendChatInput("Hello AI");
		});

		// Should add user message immediately
		expect(result.current.chatLines).toHaveLength(1);
		expect(result.current.chatLines[0]).toMatchObject({
			from: "user",
			msg: "Hello AI",
		});
		expect(result.current.inputValue).toBe("");
		expect(result.current.busy).toBe(true);
	});

	it("should clear chat correctly", () => {
		const { result } = renderHook(() => useAiChat());

		// Add a message first
		act(() => {
			result.current.sendChatInput("Test message");
		});

		expect(result.current.chatLines).toHaveLength(1);

		// Clear chat
		act(() => {
			result.current.clearChat();
		});

		expect(result.current.chatLines).toEqual([]);
		expect(result.current.isEmpty).toBe(true);
	});

	it("should update input value correctly", () => {
		const { result } = renderHook(() => useAiChat());

		act(() => {
			result.current.setInputValue("Test input");
		});

		expect(result.current.inputValue).toBe("Test input");
	});

	it("should send current input correctly", () => {
		const { result } = renderHook(() => useAiChat());

		act(() => {
			result.current.setInputValue("Current input test");
		});

		act(() => {
			result.current.sendCurrentInput();
		});

		expect(result.current.chatLines).toHaveLength(1);
		expect(result.current.chatLines[0].msg).toBe("Current input test");
		expect(result.current.inputValue).toBe("");
	});

	it("should not send empty messages", () => {
		const { result } = renderHook(() => useAiChat());

		act(() => {
			result.current.sendChatInput("");
		});

		expect(result.current.chatLines).toHaveLength(0);

		act(() => {
			result.current.sendChatInput("   ");
		});

		expect(result.current.chatLines).toHaveLength(0);
	});

	it("should respect maxChatLines limit", () => {
		const { result } = renderHook(() => useAiChat({ maxChatLines: 2 }));

		// Send first message
		act(() => {
			result.current.sendChatInput("Message 1");
		});

		// Send second message
		act(() => {
			result.current.sendChatInput("Message 2");
		});

		expect(result.current.chatLines).toHaveLength(2);
		expect(result.current.hasReachedLimit).toBe(true);
		expect(result.current.isDisabled).toBe(true);

		// Try to send third message - should be ignored
		act(() => {
			result.current.sendChatInput("Message 3");
		});

		expect(result.current.chatLines).toHaveLength(2);
	});

	it("should handle initial message correctly", () => {
		const { result } = renderHook(() =>
			useAiChat({ initialMessage: "Initial test message" })
		);

		// Should process initial message automatically
		expect(result.current.chatLines).toHaveLength(1);
		expect(result.current.chatLines[0]).toMatchObject({
			from: "user",
			msg: "Initial test message",
		});
	});

	it("should call onChatLinesChange callback", () => {
		const onChatLinesChange = jest.fn();
		const { result } = renderHook(() => useAiChat({ onChatLinesChange }));

		act(() => {
			result.current.sendChatInput("Test message");
		});

		expect(onChatLinesChange).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					from: "user",
					msg: "Test message",
				}),
			])
		);
	});

	it("should call onBusyStateChange callback", () => {
		const onBusyStateChange = jest.fn();
		mockFetcher.mockResolvedValueOnce({ reply: "AI response" });

		const { result } = renderHook(() => useAiChat({ onBusyStateChange }));

		act(() => {
			result.current.sendChatInput("Test message");
		});

		expect(onBusyStateChange).toHaveBeenCalledWith(true);
	});

	it("should return correct chatState values", () => {
		const { result } = renderHook(() => useAiChat({ maxChatLines: 1 }));

		// Initially ready
		expect(result.current.chatState).toBe("ready");

		// Send message to trigger busy state
		act(() => {
			result.current.sendChatInput("Test");
		});

		expect(result.current.chatState).toBe("limit-reached");
	});

	it("should not work when user is not logged in", () => {
		mockUseUser.mockReturnValue({
			isLoggedIn: false,
		});

		const { result } = renderHook(() => useAiChat());

		act(() => {
			result.current.sendChatInput("Test message");
		});

		// Should not send message or make API call when not logged in
		expect(mockFetcher).not.toHaveBeenCalled();
	});
});
