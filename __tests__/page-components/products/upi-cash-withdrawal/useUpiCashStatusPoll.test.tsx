import { act, renderHook } from "@testing-library/react";

const statusCall = jest.fn();
jest.mock("hooks/useApiFetch", () => ({
	__esModule: true,
	default: () => [statusCall, false],
}));

import { useUpiCashStatusPoll } from "page-components/products/upi-cash-withdrawal/hooks/useUpiCashStatusPoll";

const SCHEDULE = { startIn: 1, gap: 1, attempts: 3 };

const paid = (bankRef = "BR-9") => ({
	data: {
		response_status_id: 0,
		data: { txstatus_desc: "SUCCESS", bank_ref_num: bankRef },
	},
});
const pending = () => ({
	data: { response_status_id: 2, data: { txstatus_desc: "PENDING" } },
});
const failed = () => ({
	data: { response_status_id: 1, data: { txstatus_desc: "FAILED" } },
});

const tick = async (ms: number) => {
	await act(async () => {
		jest.advanceTimersByTime(ms);
	});
};

describe("useUpiCashStatusPoll (branch on response_status_id)", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		statusCall.mockReset();
	});
	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	const run = () =>
		renderHook(() =>
			useUpiCashStatusPoll({
				tid: "TID-1",
				schedule: SCHEDULE,
				enabled: true,
			})
		);

	// AC-4.1 — polls on the returned schedule and stays pending (do not hand over).
	it("polls on schedule and stays pending (AC-4.1)", async () => {
		statusCall.mockResolvedValue(pending());
		const { result } = run();
		expect(result.current.status).toBe("pending");

		await tick(1000); // first poll (startIn)
		expect(statusCall).toHaveBeenCalledWith({
			body: { interaction_type_id: 1109, tid: "TID-1" },
		});
		expect(result.current.status).toBe("pending");
		expect(result.current.isPaid).toBe(false);
	});

	// AC-4.2 — paid (0) → isPaid true + bank_ref_num.
	it("resolves to paid with bank ref on response_status_id 0 (AC-4.2)", async () => {
		statusCall
			.mockResolvedValueOnce(pending())
			.mockResolvedValue(paid("BR-42"));
		const { result } = run();

		await tick(1000); // poll 1 → pending
		expect(result.current.status).toBe("pending");
		await tick(1000); // poll 2 → paid
		expect(result.current.status).toBe("paid");
		expect(result.current.isPaid).toBe(true);
		expect(result.current.bankRefNum).toBe("BR-42");
	});

	// AC-4.3 — failed (1) → failed, never paid.
	it("resolves to failed on response_status_id 1 (AC-4.3)", async () => {
		statusCall.mockResolvedValue(failed());
		const { result } = run();

		await tick(1000);
		expect(result.current.status).toBe("failed");
		expect(result.current.isPaid).toBe(false);
	});

	// AC-4.4 — still pending after the last poll → unknown, never paid.
	it("resolves to unknown after the last poll if still pending (AC-4.4)", async () => {
		statusCall.mockResolvedValue(pending());
		const { result } = run();

		await tick(1000); // attempt 1
		await tick(1000); // attempt 2
		await tick(1000); // attempt 3 (== attempts) → unknown
		expect(result.current.attemptsUsed).toBe(3);
		expect(result.current.status).toBe("unknown");
		expect(result.current.isPaid).toBe(false);
	});

	// AC-4.4 — connection errors are treated as not-paid and end as unknown.
	it("treats connection errors as not-paid → unknown (AC-4.4)", async () => {
		statusCall.mockResolvedValue({ error: true });
		const { result } = run();

		await tick(1000);
		await tick(1000);
		await tick(1000);
		expect(result.current.status).toBe("unknown");
		expect(result.current.isPaid).toBe(false);
	});

	// AC-4.5 — an unrecognised status id is never shown as paid.
	it("never shows paid for an unrecognised status id (AC-4.5)", async () => {
		statusCall.mockResolvedValue({
			data: { response_status_id: 7, data: {} },
		});
		const { result } = run();

		await tick(1000);
		expect(result.current.isPaid).toBe(false);
		await tick(1000);
		await tick(1000);
		expect(result.current.status).toBe("unknown");
		expect(result.current.isPaid).toBe(false);
	});

	it("is idle and does not poll when disabled", async () => {
		statusCall.mockResolvedValue(paid());
		const { result } = renderHook(() =>
			useUpiCashStatusPoll({
				tid: "TID-1",
				schedule: SCHEDULE,
				enabled: false,
			})
		);
		await tick(5000);
		expect(result.current.status).toBe("idle");
		expect(statusCall).not.toHaveBeenCalled();
	});
});
