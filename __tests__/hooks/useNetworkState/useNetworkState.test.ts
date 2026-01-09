import { useNetworkState } from "hooks";
import { act, renderHook } from "test-utils";

type MockConnection = EventTarget & {
	effectiveType?: string;
	downlink?: number;
};

describe("useNetworkState", () => {
	let originalConnectionDescriptor: PropertyDescriptor | undefined;
	let originalOnLineDescriptor: PropertyDescriptor | undefined;

	const setOnLine = (value: boolean) => {
		Object.defineProperty(navigator, "onLine", {
			configurable: true,
			value,
		});
	};

	const setupConnection = (
		effectiveType = "4g",
		downlink = 10
	): MockConnection => {
		const connection: MockConnection = new EventTarget();
		connection.effectiveType = effectiveType;
		connection.downlink = downlink;

		Object.defineProperty(navigator, "connection", {
			configurable: true,
			value: connection,
		});

		return connection;
	};

	beforeEach(() => {
		originalConnectionDescriptor = Object.getOwnPropertyDescriptor(
			navigator,
			"connection"
		);
		originalOnLineDescriptor = Object.getOwnPropertyDescriptor(
			navigator,
			"onLine"
		);
	});

	afterEach(() => {
		if (originalConnectionDescriptor) {
			Object.defineProperty(
				navigator,
				"connection",
				originalConnectionDescriptor
			);
		} else {
			delete (navigator as any).connection;
		}

		if (originalOnLineDescriptor) {
			Object.defineProperty(
				navigator,
				"onLine",
				originalOnLineDescriptor
			);
		} else {
			delete (navigator as any).onLine;
		}
	});

	it("returns defaults when connection is unavailable", () => {
		setOnLine(true);
		delete (navigator as any).connection;

		const { result } = renderHook(() => useNetworkState());

		expect(result.current.online).toBe(true);
		expect(result.current.effectiveType).toBe("unknown");
		expect(result.current.downlink).toBe(0);
	});

	it("updates online status on network events", () => {
		setOnLine(true);
		setupConnection("4g", 8);

		const { result } = renderHook(() => useNetworkState());

		expect(result.current.online).toBe(true);

		act(() => {
			setOnLine(false);
			window.dispatchEvent(new Event("offline"));
		});

		expect(result.current.online).toBe(false);

		act(() => {
			setOnLine(true);
			window.dispatchEvent(new Event("online"));
		});

		expect(result.current.online).toBe(true);
	});

	it("responds to connection change events", () => {
		setOnLine(true);
		const connection = setupConnection("4g", 8);

		const { result } = renderHook(() => useNetworkState());

		expect(result.current.effectiveType).toBe("4g");
		expect(result.current.downlink).toBe(8);

		act(() => {
			connection.effectiveType = "3g";
			connection.downlink = 1.5;
			connection.dispatchEvent(new Event("change"));
		});

		expect(result.current.effectiveType).toBe("3g");
		expect(result.current.downlink).toBe(1.5);
	});
});
