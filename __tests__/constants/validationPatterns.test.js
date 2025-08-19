import {
	VALIDATION_LENGTHS,
	VALIDATION_MESSAGES,
	VALIDATION_PATTERNS,
} from "constants/validationPatterns";

describe("Validation Patterns", () => {
	describe("Name validation", () => {
		it("should validate correct names", () => {
			const validNames = [
				"John Doe",
				"Mary Jane Smith",
				"A. B. Kumar",
				"Jean-Pierre",
				"O'Connor",
			];

			validNames.forEach((name) => {
				console.log(
					`Testing name: "${name}" with pattern: ${VALIDATION_PATTERNS.name}`
				);
				console.log(`Result: ${VALIDATION_PATTERNS.name.test(name)}`);
				expect(VALIDATION_PATTERNS.name.test(name)).toBe(true);
			});
		});

		it("should reject invalid names", () => {
			const invalidNames = [
				"", // empty
				"a", // too short
				"aaa", // repeated characters
				"111", // numbers only
				"@john", // special characters
			];

			invalidNames.forEach((name) => {
				console.log(
					`Testing invalid name: "${name}" with pattern: ${VALIDATION_PATTERNS.name}`
				);
				console.log(`Result: ${VALIDATION_PATTERNS.name.test(name)}`);
				expect(VALIDATION_PATTERNS.name.test(name)).toBe(false);
			});
		});
	});

	describe("Shop name validation", () => {
		it("should validate correct shop names", () => {
			const validShopNames = [
				"ABC Store",
				"Shop-123",
				"Store, Inc.",
				"24/7 Market",
				"Soni's Shop",
			];

			validShopNames.forEach((shopName) => {
				console.log(
					`Testing shop name: "${shopName}" with pattern: ${VALIDATION_PATTERNS.shopName}`
				);
				console.log(
					`Result: ${VALIDATION_PATTERNS.shopName.test(shopName)}`
				);
				expect(VALIDATION_PATTERNS.shopName.test(shopName)).toBe(true);
			});
		});

		it("should reject invalid shop names", () => {
			const invalidShopNames = [
				"Shop@Home", // @ not allowed
				"Store#1", // # not allowed
				"Shop&Co", // & not allowed
			];

			invalidShopNames.forEach((shopName) => {
				expect(VALIDATION_PATTERNS.shopName.test(shopName)).toBe(false);
			});
		});
	});

	describe("Email validation", () => {
		it("should validate correct emails", () => {
			const validEmails = [
				"test@example.com",
				"user.name@domain.co.in",
				"admin+test@company.org",
			];

			validEmails.forEach((email) => {
				expect(VALIDATION_PATTERNS.email.test(email)).toBe(true);
			});
		});

		it("should reject invalid emails", () => {
			const invalidEmails = [
				"invalid-email",
				"@domain.com",
				"user@",
				"user@domain",
			];

			invalidEmails.forEach((email) => {
				expect(VALIDATION_PATTERNS.email.test(email)).toBe(false);
			});
		});
	});

	describe("Phone validation", () => {
		it("should validate Indian phone numbers", () => {
			const validPhones = [
				"9876543210",
				"8123456789",
				"7000000000",
				"6999999999",
			];

			validPhones.forEach((phone) => {
				expect(VALIDATION_PATTERNS.phone.test(phone)).toBe(true);
			});
		});

		it("should reject invalid phone numbers", () => {
			const invalidPhones = [
				"1234567890", // doesn't start with 6-9
				"98765432", // too short
				"98765432100", // too long
				"abcdefghij", // letters
			];

			invalidPhones.forEach((phone) => {
				expect(VALIDATION_PATTERNS.phone.test(phone)).toBe(false);
			});
		});
	});
});

describe("Validation Lengths", () => {
	it("should have correct length constraints", () => {
		expect(VALIDATION_LENGTHS.name.min).toBe(2);
		expect(VALIDATION_LENGTHS.name.max).toBe(50);
		expect(VALIDATION_LENGTHS.shopName.min).toBe(2);
		expect(VALIDATION_LENGTHS.shopName.max).toBe(100);
	});
});

describe("Validation Messages", () => {
	it("should have messages for all patterns", () => {
		expect(VALIDATION_MESSAGES.name.required).toBeDefined();
		expect(VALIDATION_MESSAGES.name.pattern).toBeDefined();
		expect(VALIDATION_MESSAGES.shopName.required).toBeDefined();
		expect(VALIDATION_MESSAGES.email.pattern).toBeDefined();
	});
});
