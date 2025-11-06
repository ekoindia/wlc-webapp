import {
	capitalize,
	extractTextContent,
	getFirstWord,
	getInitials,
	limitText,
	nullRemover,
	numberRemover,
	toKebabCase,
} from "utils/textFormat";

describe("textFormat utilities", () => {
	describe("limitText", () => {
		it("returns text as-is when shorter than maxLength", () => {
			expect(limitText("Hello", 10)).toBe("Hello");
		});

		it("returns text as-is when equal to maxLength", () => {
			expect(limitText("Hello", 5)).toBe("Hello");
		});

		it("truncates text and adds default postfix when exceeding maxLength", () => {
			expect(limitText("Hello World", 5)).toBe("Hello…");
		});

		it("truncates text and adds custom postfix", () => {
			expect(limitText("Hello World", 5, "...")).toBe("Hello...");
		});

		it("handles empty string", () => {
			expect(limitText("", 5)).toBe("");
		});
	});

	describe("getFirstWord", () => {
		it("returns first word from text", () => {
			expect(getFirstWord("Hello World")).toBe("Hello");
		});

		it("returns single word", () => {
			expect(getFirstWord("Hello")).toBe("Hello");
		});

		it("handles empty string", () => {
			expect(getFirstWord("")).toBe("");
		});

		it("handles null/undefined", () => {
			expect(getFirstWord(null)).toBe("");
			expect(getFirstWord(undefined)).toBe("");
		});

		it("handles multiple spaces", () => {
			expect(getFirstWord("Hello   World")).toBe("Hello");
		});
	});

	describe("capitalize", () => {
		it("capitalizes first letters of words", () => {
			expect(capitalize("fix this string")).toBe("Fix This String");
		});

		it("lowercases other letters by default", () => {
			expect(capitalize("javaSCrIPT")).toBe("Javascript");
		});

		it("preserves case when lower=false", () => {
			expect(capitalize("javaSCrIPT", false)).toBe("JavaSCrIPT");
		});

		it("handles empty string", () => {
			expect(capitalize("")).toBe("");
		});

		it("handles null/undefined", () => {
			expect(capitalize(null)).toBe("");
			expect(capitalize(undefined)).toBe("");
		});

		it("capitalizes after special characters", () => {
			expect(capitalize("hello-world")).toBe("Hello-World");
			expect(capitalize("(hello world)")).toBe("(Hello World)");
			expect(capitalize('hello "world"')).toBe('Hello "World"');
			expect(capitalize("hello [world]")).toBe("Hello [World]");
			expect(capitalize("hello {world}")).toBe("Hello {World}");
		});
	});

	describe("toKebabCase", () => {
		it("converts label to kebab-case", () => {
			expect(toKebabCase("Agent Pricing")).toBe("agent-pricing");
		});

		it("handles single word", () => {
			expect(toKebabCase("Agent")).toBe("agent");
		});

		it("handles multiple spaces", () => {
			expect(toKebabCase("Agent   Pricing   Config")).toBe(
				"agent-pricing-config"
			);
		});

		it("handles uppercase text", () => {
			expect(toKebabCase("AGENT PRICING")).toBe("agent-pricing");
		});

		it("handles mixed case", () => {
			expect(toKebabCase("AgEnT pRiCiNg")).toBe("agent-pricing");
		});
	});

	describe("nullRemover", () => {
		it("removes null from comma-separated list", () => {
			expect(nullRemover("null, text, null, text")).toBe("text, text");
		});

		it("removes null from text", () => {
			expect(nullRemover("text null text")).toBe("text  text");
		});

		it("handles empty string", () => {
			expect(nullRemover("")).toBe("");
		});

		it("handles null/undefined input", () => {
			expect(nullRemover(null)).toBe("");
			expect(nullRemover(undefined)).toBe("");
		});

		it("handles text without null", () => {
			expect(nullRemover("text, text")).toBe("text, text");
		});

		it("handles case insensitive null", () => {
			expect(nullRemover("NULL, text, Null, text")).toBe("text, text");
		});

		it("preserves list structure", () => {
			expect(nullRemover("item1, null, item2, null, item3")).toBe(
				"item1, item2, item3"
			);
		});

		it("handles all null values", () => {
			expect(nullRemover("null, null, null")).toBe("");
		});
	});

	describe("numberRemover", () => {
		it("removes numbers from text", () => {
			expect(numberRemover("text 123 text")).toBe("text  text");
		});

		it("removes multiple numbers", () => {
			expect(numberRemover("123 text 456 text 789")).toBe(" text  text ");
		});

		it("handles text without numbers", () => {
			expect(numberRemover("text text")).toBe("text text");
		});

		it("handles only numbers", () => {
			expect(numberRemover("123 456 789")).toBe("  ");
		});

		it("preserves numbers within alphanumeric strings", () => {
			expect(numberRemover("abc123def456")).toBe("abc123def456");
		});
	});

	describe("getInitials", () => {
		it("extracts initials from text (default 2 characters)", () => {
			expect(getInitials("John Doe")).toBe("JD");
		});

		it("extracts specified number of initials", () => {
			expect(getInitials("John Doe Smith", 3)).toBe("JDS");
		});

		it("handles single word", () => {
			expect(getInitials("John")).toBe("J");
		});

		it("handles empty string", () => {
			expect(getInitials("")).toBe("");
		});

		it("handles null/undefined", () => {
			expect(getInitials(null)).toBe("");
			expect(getInitials(undefined)).toBe("");
		});

		it("handles non-string input", () => {
			expect(getInitials(123)).toBe("");
			expect(getInitials({})).toBe("");
		});

		it("converts to uppercase", () => {
			expect(getInitials("john doe")).toBe("JD");
		});

		it("handles special characters as separators", () => {
			expect(getInitials("john-doe")).toBe("JD");
			expect(getInitials("john.doe")).toBe("JD");
		});

		it("handles text with numbers", () => {
			expect(getInitials("agent123 pricing456")).toBe("AP");
		});

		it("returns fewer initials if text has fewer words", () => {
			expect(getInitials("John", 3)).toBe("J");
		});
	});

	describe("extractTextContent", () => {
		it("extracts string directly", () => {
			expect(extractTextContent("Hello")).toBe("Hello");
		});

		it("converts number to string", () => {
			expect(extractTextContent(123)).toBe("123");
		});

		it("handles null/undefined", () => {
			expect(extractTextContent(null)).toBe("");
			expect(extractTextContent(undefined)).toBe("");
		});

		it("handles array of strings", () => {
			expect(extractTextContent(["Hello", "World"])).toBe("Hello World");
		});

		it("handles array with numbers", () => {
			expect(extractTextContent(["Hello", 123, "World"])).toBe(
				"Hello 123 World"
			);
		});

		it("extracts text from React element with children", () => {
			const element = {
				props: {
					children: "Hello World",
				},
			};
			expect(extractTextContent(element)).toBe("Hello World");
		});

		it("extracts value prop from editable components", () => {
			const element = {
				props: {
					value: "Input Value",
					children: "Fallback",
				},
			};
			expect(extractTextContent(element)).toBe("Input Value");
		});

		it("handles nested children", () => {
			const element = {
				props: {
					children: {
						props: {
							children: "Nested Text",
						},
					},
				},
			};
			expect(extractTextContent(element)).toBe("Nested Text");
		});

		it("handles array of React elements", () => {
			const elements = [
				{ props: { children: "Hello" } },
				{ props: { children: "World" } },
			];
			expect(extractTextContent(elements)).toBe("Hello World");
		});

		it("handles empty array", () => {
			expect(extractTextContent([])).toBe("");
		});

		it("handles object with no props", () => {
			expect(extractTextContent({})).toBe("");
		});

		it("prioritizes value over children", () => {
			const element = {
				props: {
					value: 42,
					children: "Should not appear",
				},
			};
			expect(extractTextContent(element)).toBe("42");
		});

		it("handles value prop with null", () => {
			const element = {
				props: {
					value: null,
					children: "Fallback Text",
				},
			};
			expect(extractTextContent(element)).toBe("Fallback Text");
		});

		it("handles complex nested structure", () => {
			const complex = {
				props: {
					children: [
						"Text 1",
						{ props: { children: "Text 2" } },
						123,
						{ props: { value: "Text 3" } },
					],
				},
			};
			expect(extractTextContent(complex)).toBe(
				"Text 1 Text 2 123 Text 3"
			);
		});
	});
});
