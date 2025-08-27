import {
	emailValidation,
	nameValidation,
	phoneValidation,
	shopNameValidation,
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
					`Testing name: "${name}" with pattern: ${nameValidation.regex}`
				);
				console.log(`Result: ${nameValidation.regex.test(name)}`);
				expect(nameValidation.regex.test(name)).toBe(true);
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
					`Testing invalid name: "${name}" with pattern: ${nameValidation.regex}`
				);
				console.log(`Result: ${nameValidation.regex.test(name)}`);
				expect(nameValidation.regex.test(name)).toBe(false);
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
					`Testing shop name: "${shopName}" with pattern: ${shopNameValidation.regex}`
				);
				console.log(
					`Result: ${shopNameValidation.regex.test(shopName)}`
				);
				expect(shopNameValidation.regex.test(shopName)).toBe(true);
			});
		});

		it("should reject invalid shop names", () => {
			const invalidShopNames = [
				"Shop@Home", // @ not allowed
				"Store#1", // # not allowed
				"Shop&Co", // & not allowed
			];

			invalidShopNames.forEach((shopName) => {
				expect(shopNameValidation.regex.test(shopName)).toBe(false);
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
				expect(emailValidation.regex.test(email)).toBe(true);
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
				expect(emailValidation.regex.test(email)).toBe(false);
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
				expect(phoneValidation.regex.test(phone)).toBe(true);
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
				expect(phoneValidation.regex.test(phone)).toBe(false);
			});
		});
	});
});

describe("Validation Configuration", () => {
	it("should have correct validation properties for name", () => {
		expect(nameValidation.regex).toBeInstanceOf(RegExp);
		expect(nameValidation.minLength).toBe(2);
		expect(nameValidation.maxLength).toBe(50);
	});

	it("should have correct validation properties for shopName", () => {
		expect(shopNameValidation.regex).toBeInstanceOf(RegExp);
		expect(shopNameValidation.minLength).toBe(2);
		expect(shopNameValidation.maxLength).toBe(100);
	});

	it("should have correct validation properties for email", () => {
		expect(emailValidation.regex).toBeInstanceOf(RegExp);
		expect(emailValidation.minLength).toBe(5);
		expect(emailValidation.maxLength).toBe(100);
	});

	it("should have correct validation properties for phone", () => {
		expect(phoneValidation.regex).toBeInstanceOf(RegExp);
		expect(phoneValidation.minLength).toBe(10);
		expect(phoneValidation.maxLength).toBe(10);
	});
});
