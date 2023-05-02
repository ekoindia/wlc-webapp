import { formatDateTime } from "utils/dateFormat";

describe("formatDateTime", () => {
	it("should format date-time correctly", () => {
		expect(formatDateTime("2017-01-13T16:14:24+05:30")).toBe(
			"13/01/2017 04:14 PM"
		);
	});

	it("should format date correctly", () => {
		expect(formatDateTime("2017-01-13", "dd/MM/yyyy")).toBe("13/01/2017");
	});

	it("should return empty string for invalid date", () => {
		expect(formatDateTime("")).toBe("");
	});
});
