import { JsonViewer } from "components/JsonViewer";
import { render, screen } from "test-utils";

describe("JsonViewer", () => {
	describe("basic rendering", () => {
		it("renders without error", () => {
			const { container } = render(
				<JsonViewer data={{ name: "John", age: 30 }} />
			);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("renders JSON string input", () => {
			const { container } = render(
				<JsonViewer data='{"name": "John"}' />
			);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("shows error state for invalid JSON string", () => {
			render(<JsonViewer data="{invalid: json}" />);
			expect(screen.getByText("Invalid JSON")).toBeInTheDocument();
		});
	});

	describe("showBrackets prop", () => {
		it("shows brackets by default", () => {
			render(<JsonViewer data={{ name: "John" }} />);
			expect(screen.getByText("{")).toBeInTheDocument();
			expect(screen.getByText("}")).toBeInTheDocument();
		});

		it("hides brackets when showBrackets is false", () => {
			render(<JsonViewer data={{ name: "John" }} showBrackets={false} />);
			expect(screen.queryByText("{")).not.toBeInTheDocument();
			expect(screen.queryByText("}")).not.toBeInTheDocument();
		});

		it("hides array brackets when showBrackets is false", () => {
			render(
				<JsonViewer data={["item1", "item2"]} showBrackets={false} />
			);
			expect(screen.queryByText("[")).not.toBeInTheDocument();
			expect(screen.queryByText("]")).not.toBeInTheDocument();
		});
	});

	describe("key formatting", () => {
		it("formats keys by removing underscores and capitalizing by default", () => {
			render(
				<JsonViewer
					data={{ pan_number: "ABC123", dob_match: "Y" }}
					collapseAfterLevel={Infinity}
				/>
			);
			expect(screen.getByText("Pan Number")).toBeInTheDocument();
			expect(screen.getByText("Dob Match")).toBeInTheDocument();
		});

		it("uses keyOverrides when provided", () => {
			render(
				<JsonViewer
					data={{ pan_number: "ABC123", dob: "2025-01-20" }}
					keyOverrides={{
						pan_number: "PAN Number",
						dob: "Date of Birth",
					}}
					collapseAfterLevel={Infinity}
				/>
			);
			expect(screen.getByText("PAN Number")).toBeInTheDocument();
			expect(screen.getByText("Date of Birth")).toBeInTheDocument();
		});

		it("falls back to default formatting when key not in overrides", () => {
			render(
				<JsonViewer
					data={{ pan_number: "ABC123", other_field: "value" }}
					keyOverrides={{ pan_number: "PAN Number" }}
					collapseAfterLevel={Infinity}
				/>
			);
			expect(screen.getByText("PAN Number")).toBeInTheDocument();
			expect(screen.getByText("Other Field")).toBeInTheDocument();
		});
	});

	describe("value transforms - byKey", () => {
		it("transforms values using byKey mapping", () => {
			render(
				<JsonViewer
					data={{ status: "Y", active: "N" }}
					valueTransforms={{ byKey: { Y: "Yes", N: "No" } }}
					collapseAfterLevel={Infinity}
				/>
			);
			expect(screen.getByText(/"Yes"/)).toBeInTheDocument();
			expect(screen.getByText(/"No"/)).toBeInTheDocument();
		});

		it("leaves values unchanged when no matching transform", () => {
			render(
				<JsonViewer
					data={{ status: "active" }}
					valueTransforms={{ byKey: { Y: "Yes" } }}
					collapseAfterLevel={Infinity}
				/>
			);
			expect(screen.getByText(/"active"/)).toBeInTheDocument();
		});
	});

	describe("value transforms - byPath", () => {
		it("transforms values using byPath mapping", () => {
			render(
				<JsonViewer
					data={{
						permanent_address: { city: "delhi" },
						current_address: { city: "delhi" },
					}}
					valueTransforms={{
						byPath: {
							"permanent_address.city": {
								delhi: "Delhi (Permanent)",
							},
							"current_address.city": {
								delhi: "Delhi (Current)",
							},
						},
					}}
					collapseAfterLevel={Infinity}
				/>
			);
			expect(
				screen.getByText(/"Delhi \(Permanent\)"/)
			).toBeInTheDocument();
			expect(screen.getByText(/"Delhi \(Current\)"/)).toBeInTheDocument();
		});

		it("byPath takes precedence over byKey", () => {
			render(
				<JsonViewer
					data={{
						address: { city: "mumbai" },
					}}
					valueTransforms={{
						byKey: { mumbai: "Mumbai (Default)" },
						byPath: {
							"address.city": { mumbai: "Mumbai (Specific)" },
						},
					}}
					collapseAfterLevel={Infinity}
				/>
			);
			expect(
				screen.getByText(/"Mumbai \(Specific\)"/)
			).toBeInTheDocument();
			expect(
				screen.queryByText(/"Mumbai \(Default\)"/)
			).not.toBeInTheDocument();
		});
	});

	describe("combined features", () => {
		it("supports all formatting options together", () => {
			render(
				<JsonViewer
					data={{
						pan_number: "BNKPJ3499L",
						aadhaar_seeding_status: "Y",
						name_match: "Y",
					}}
					showBrackets={false}
					keyOverrides={{ pan_number: "PAN Number" }}
					valueTransforms={{ byKey: { Y: "Yes", N: "No" } }}
					collapseAfterLevel={Infinity}
				/>
			);
			// Key override applied
			expect(screen.getByText("PAN Number")).toBeInTheDocument();
			// Default key formatting applied
			expect(
				screen.getByText("Aadhaar Seeding Status")
			).toBeInTheDocument();
			expect(screen.getByText("Name Match")).toBeInTheDocument();
			// Value transform applied
			expect(screen.getAllByText(/"Yes"/).length).toBeGreaterThanOrEqual(
				2
			);
			// No brackets
			expect(screen.queryByText("{")).not.toBeInTheDocument();
		});
	});
});
