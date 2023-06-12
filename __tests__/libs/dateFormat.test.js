import { formatDateTime } from "libs/dateFormat";

describe("formatDateTime", () => {
	it("should format date-time correctly", () => {
		expect(formatDateTime("2023-01-13T16:14:24+05:30")).toBe(
			"13/01/2023 04:14 PM"
		);
	});

	it("should format date", () => {
		expect(formatDateTime("2023-01-13", "dd/MM/yyyy")).toBe("13/01/2023");
	});

	it("should format date - month name - Jan", () => {
		expect(formatDateTime("2023-01-13", "dd/MMM/yyyy")).toBe("13/Jan/2023");
	});

	it("should format date - month name - Mar", () => {
		expect(formatDateTime("2023-03-13", "dd/MMM/yyyy")).toBe("13/Mar/2023");
	});

	it("should return empty string for invalid date", () => {
		expect(formatDateTime("")).toBe("");
	});
});
