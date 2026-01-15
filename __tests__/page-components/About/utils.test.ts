import { parseBrowserInfo } from "page-components/About/utils";

describe("parseBrowserInfo", () => {
	it("should parse Chrome browser correctly", () => {
		const userAgent =
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
		const result = parseBrowserInfo(userAgent);
		expect(result.name).toBe("Chrome");
		expect(result.version).toBe("120");
	});

	it("should parse Edge browser correctly", () => {
		const userAgent =
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";
		const result = parseBrowserInfo(userAgent);
		expect(result.name).toBe("Edge");
		expect(result.version).toBe("120");
	});

	it("should parse Firefox browser correctly", () => {
		const userAgent =
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0";
		const result = parseBrowserInfo(userAgent);
		expect(result.name).toBe("Firefox");
		expect(result.version).toBe("121");
	});

	it("should parse Safari browser correctly", () => {
		const userAgent =
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
		const result = parseBrowserInfo(userAgent);
		expect(result.name).toBe("Safari");
		expect(result.version).toBe("17");
	});

	it("should return Unknown for unrecognized browser", () => {
		const userAgent = "Unknown Browser String";
		const result = parseBrowserInfo(userAgent);
		expect(result.name).toBe("Unknown");
		expect(result.version).toBe("Unknown");
	});

	it("should handle errors gracefully", () => {
		const result = parseBrowserInfo(null as any);
		expect(result.name).toBe("Unknown");
		expect(result.version).toBe("Unknown");
	});
});
