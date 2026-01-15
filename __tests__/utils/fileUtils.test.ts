import {
	b64toByteArrays,
	dataUrlToBlob,
	saveDataToFile,
} from "utils/fileUtils";

// Mock for window.URL
const mockURL = {
	createObjectURL: jest.fn().mockReturnValue("mock-url"),
	revokeObjectURL: jest.fn(),
};

// Mock for document.createElement
const mockAnchor = {
	setAttribute: jest.fn(),
	click: jest.fn(),
	style: {},
	href: "",
};

describe("fileUtils", () => {
	beforeEach(() => {
		(global.window as any).URL = mockURL;
		global.document.createElement = jest
			.fn()
			.mockReturnValue(mockAnchor as any);
		(global.window as any).navigator = {};
		global.atob = jest.fn().mockImplementation((str) => str);
		jest.clearAllMocks();
	});

	describe("b64toByteArrays", () => {
		it("converts base64 string to byte arrays successfully", () => {
			const mockData = "SGVsbG8gV29ybGQ="; // "Hello World" in base64
			global.atob = jest.fn().mockReturnValue("Hello World");

			const result = b64toByteArrays(mockData, 5);

			expect(global.atob).toHaveBeenCalledWith(mockData);
			expect(result).toHaveLength(3); // "Hello World" (11 chars) with slice size 5
			expect(result[0]).toBeInstanceOf(Uint8Array);
			expect(result[0]).toHaveLength(5); // First slice: "Hello"
			expect(result[1]).toHaveLength(5); // Second slice: " Worl"
			expect(result[2]).toHaveLength(1); // Third slice: "d"
		});

		it("uses default slice size when not provided", () => {
			const mockData = "SGVsbG8=";
			global.atob = jest.fn().mockReturnValue("Hello");

			const result = b64toByteArrays(mockData);

			expect(result).toHaveLength(1); // "Hello" fits in default 512 slice
			expect(result[0]).toHaveLength(5);
		});
	});

	describe("saveDataToFile", () => {
		it("creates and downloads file with string data", () => {
			const data = "test content";
			const filename = "test.txt";
			const type = "text/plain";

			saveDataToFile(data, filename, type);

			expect(global.document.createElement).toHaveBeenCalledWith("a");
			expect(mockAnchor.setAttribute).toHaveBeenCalledWith("hidden", "");
			expect(mockAnchor.setAttribute).toHaveBeenCalledWith(
				"download",
				filename
			);
			expect(mockAnchor.click).toHaveBeenCalled();
			expect(mockURL.createObjectURL).toHaveBeenCalled();
			expect(mockURL.revokeObjectURL).toHaveBeenCalledWith("mock-url");
		});

		it("converts base64 data when isB64 is true", () => {
			const mockB64Data = "SGVsbG8=";
			const filename = "test.txt";
			const type = "text/plain";
			global.atob = jest.fn().mockReturnValue("Hello");

			saveDataToFile(mockB64Data, filename, type, true);

			expect(global.atob).toHaveBeenCalledWith(mockB64Data);
			expect(mockAnchor.click).toHaveBeenCalled();
		});

		it("handles IE10+ compatibility when msSaveOrOpenBlob is available", () => {
			const mockMsSave = jest.fn();
			((global.window as any).navigator as any).msSaveOrOpenBlob =
				mockMsSave;
			const data = "test content";
			const filename = "test.txt";
			const type = "text/plain";

			saveDataToFile(data, filename, type);

			expect(mockMsSave).toHaveBeenCalled();
			expect(global.document.createElement).not.toHaveBeenCalled();
		});

		it("works with byte array data", () => {
			const data = [new Uint8Array([72, 101, 108, 108, 111])]; // "Hello"
			const filename = "test.bin";
			const type = "application/octet-stream";

			saveDataToFile(data, filename, type);

			expect(mockAnchor.click).toHaveBeenCalled();
			expect(mockURL.createObjectURL).toHaveBeenCalled();
		});
	});

	describe("dataUrlToBlob", () => {
		it("converts data URL to blob successfully", () => {
			const mockDataUrl = "data:image/jpeg;base64,SGVsbG9Xb3JsZA==";
			global.atob = jest.fn().mockReturnValue("HelloWorld");

			const result = dataUrlToBlob(mockDataUrl);

			expect(global.atob).toHaveBeenCalledWith("SGVsbG9Xb3JsZA==");
			expect(result).toBeInstanceOf(Blob);
			expect(result.type).toBe("image/jpeg");
		});

		it("throws error for invalid data URL format", () => {
			const invalidDataUrl = "invalid-data-url";

			expect(() => dataUrlToBlob(invalidDataUrl)).toThrow(
				"Invalid data URL format"
			);
		});

		it("handles different MIME types correctly", () => {
			const pngDataUrl = "data:image/png;base64,SGVsbG8=";
			global.atob = jest.fn().mockReturnValue("Hello");

			const result = dataUrlToBlob(pngDataUrl);

			expect(result.type).toBe("image/png");
		});
	});
});
