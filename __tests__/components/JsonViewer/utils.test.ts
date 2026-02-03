import { formatKeyLabel, transformDisplayValue } from "components/JsonViewer";

describe("JsonViewer utils", () => {
	describe("formatKeyLabel", () => {
		it("removes underscores and capitalizes words by default", () => {
			expect(formatKeyLabel("pan_number")).toBe("Pan Number");
			expect(formatKeyLabel("aadhaar_seeding_status")).toBe(
				"Aadhaar Seeding Status"
			);
			expect(formatKeyLabel("dob")).toBe("Dob");
		});

		it("uses override when provided", () => {
			const overrides = {
				pan_number: "PAN Number",
				dob: "Date of Birth",
			};
			expect(formatKeyLabel("pan_number", overrides)).toBe("PAN Number");
			expect(formatKeyLabel("dob", overrides)).toBe("Date of Birth");
		});

		it("falls back to default when key not in overrides", () => {
			const overrides = { pan_number: "PAN Number" };
			expect(formatKeyLabel("other_field", overrides)).toBe(
				"Other Field"
			);
		});

		it("handles single word keys", () => {
			expect(formatKeyLabel("name")).toBe("Name");
			expect(formatKeyLabel("status")).toBe("Status");
		});

		it("handles keys without underscores", () => {
			expect(formatKeyLabel("firstName")).toBe("FirstName");
		});
	});

	describe("transformDisplayValue", () => {
		describe("byKey transforms", () => {
			it("transforms value when byKey mapping exists", () => {
				const config = { byKey: { Y: "Yes", N: "No" } };
				expect(
					transformDisplayValue("Y", "status", "root.status", config)
				).toBe("Yes");
				expect(
					transformDisplayValue("N", "active", "root.active", config)
				).toBe("No");
			});

			it("returns original value when no byKey mapping", () => {
				const config = { byKey: { Y: "Yes" } };
				expect(
					transformDisplayValue(
						"active",
						"status",
						"root.status",
						config
					)
				).toBe("active");
			});
		});

		describe("byPath transforms", () => {
			it("transforms value when byPath mapping exists", () => {
				const config = {
					byPath: {
						"permanent_address.city": {
							delhi: "Delhi (Permanent)",
						},
					},
				};
				expect(
					transformDisplayValue(
						"delhi",
						"city",
						"root.permanent_address.city",
						config
					)
				).toBe("Delhi (Permanent)");
			});

			it("byPath takes precedence over byKey", () => {
				const config = {
					byKey: { delhi: "Delhi (Default)" },
					byPath: {
						"address.city": { delhi: "Delhi (Specific)" },
					},
				};
				expect(
					transformDisplayValue(
						"delhi",
						"city",
						"root.address.city",
						config
					)
				).toBe("Delhi (Specific)");
			});

			it("falls back to byKey when no byPath match", () => {
				const config = {
					byKey: { delhi: "Delhi City" },
					byPath: {
						"other_address.city": { delhi: "Other Delhi" },
					},
				};
				expect(
					transformDisplayValue(
						"delhi",
						"city",
						"root.main_address.city",
						config
					)
				).toBe("Delhi City");
			});
		});

		describe("edge cases", () => {
			it("returns original value for non-string values", () => {
				const config = { byKey: { "123": "One Two Three" } };
				expect(
					transformDisplayValue(123, "id", "root.id", config)
				).toBe(123);
				expect(
					transformDisplayValue(true, "active", "root.active", config)
				).toBe(true);
				expect(
					transformDisplayValue(null, "data", "root.data", config)
				).toBe(null);
			});

			it("returns original value when config is undefined", () => {
				expect(
					transformDisplayValue(
						"Y",
						"status",
						"root.status",
						undefined
					)
				).toBe("Y");
			});

			it("handles empty config objects", () => {
				expect(
					transformDisplayValue("Y", "status", "root.status", {})
				).toBe("Y");
				expect(
					transformDisplayValue("Y", "status", "root.status", {
						byKey: {},
					})
				).toBe("Y");
				expect(
					transformDisplayValue("Y", "status", "root.status", {
						byPath: {},
					})
				).toBe("Y");
			});

			it("handles numeric keys for array indices", () => {
				const config = { byKey: { Y: "Yes" } };
				expect(transformDisplayValue("Y", 0, "root[0]", config)).toBe(
					"Y"
				);
			});
		});
	});
});
