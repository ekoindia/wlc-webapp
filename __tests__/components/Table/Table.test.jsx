import { Table } from "components/Table";
import { pageRender } from "test-utils";
// import { renderer_mock, table_data_mock } from "./Table.mocks";

// Mock table schema
export const renderer_mock = [
	{
		name: "mobile_number",
		label: "Transaction ID",
	},
	{
		name: "createdAt",
		label: "Date & Time",
		sorting: true,
	},
	{ name: "type", label: "Activity" },
	{
		name: "type",
		label: "Description",
	},

	{ name: "ekocsp_code", label: "Amount" },
];

// Mock data for the table
export const table_data_mock = [
	{
		name: "R. J. Technology",
		mobile_number: "+91 95999 13099",
		type: "iMerchant",
		createdAt: "12/10/2012",
		account_status: "Cancel",
		ekocsp_code: "10167082",
		location: "Delhi NCR",
	},
	{
		name: "Aarkay Finance",
		mobile_number: "+91 95999 13099",
		type: "Retailer",
		createdAt: "12/10/2012",
		account_status: "Other",
		ekocsp_code: "10167082",
		location: "Kolkata, W. B.",
	},
	{
		name: "Deepu Phinance",
		mobile_number: "+91 95999 13099",
		type: "Retailer",
		createdAt: "12/10/2012",
		account_status: "Pending",
		ekocsp_code: "10167082",
		location: "Kolkata, W. B.",
	},
	{
		name: "Divu Tech",
		mobile_number: "+91 95999 13099",
		type: "Retailer",
		createdAt: "12/10/2012",
		account_status: "Active",
		ekocsp_code: "10167082",
		location: "Kolkata, W. B.",
	},
	{
		name: "Aaru Pharma",
		mobile_number: "+91 95999 13099",
		type: "Retailer",
		createdAt: "12/10/2012",
		account_status: "Active",
		ekocsp_code: "10167082",
		location: "Kolkata, W. B.",
	},
	{
		name: "R. J. Technology",
		mobile_number: "+91 95999 13099",
		type: "iMerchant",
		createdAt: "12/10/2012",
		account_status: "Active",
		ekocsp_code: "10167082",
		location: "Delhi NCR",
	},
	{
		name: "Aarkay Finance",
		mobile_number: "+91 95999 13099",
		type: "Retailer",
		createdAt: "12/10/2012",
		account_status: "Inactive",
		ekocsp_code: "10167082",
		location: "Kolkata, W. B.",
	},
	{
		name: "Deepu Phinance",
		mobile_number: "+91 95999 13099",
		type: "Retailer",
		createdAt: "12/10/2012",
		account_status: "Pending",
		ekocsp_code: "10167082",
		location: "Kolkata, W. B.",
	},
	{
		name: "Divu Tech",
		mobile_number: "+91 95999 13099",
		type: "Retailer",
		createdAt: "12/10/2012",
		account_status: "Active",
		ekocsp_code: "10167082",
		location: "Kolkata, W. B.",
	},
	{
		name: "Aaru Pharma",
		mobile_number: "+91 95999 13099",
		type: "Retailer",
		createdAt: "12/10/2012",
		account_status: "Active",
		ekocsp_code: "10167082",
		location: "Kolkata, W. B.",
	},
	{
		name: "R. J. Technology",
		mobile_number: "+91 95999 13099",
		type: "iMerchant",
		createdAt: "12/10/2012",
		account_status: "Active",
		ekocsp_code: "10167082",
		location: "Delhi NCR",
	},
	{
		name: "Aarkay Finance",
		mobile_number: "+91 95999 13099",
		type: "Retailer",
		createdAt: "12/10/2012",
		account_status: "Inactive",
		ekocsp_code: "10167082",
		location: "Kolkata, W. B.",
	},
	{
		name: "Deepu Phinance",
		mobile_number: "+91 95999 13099",
		type: "Retailer",
		createdAt: "12/10/2012",
		account_status: "Pending",
		ekocsp_code: "10167082",
		location: "Kolkata, W. B.",
	},
	{
		name: "Divu Tech",
		mobile_number: "+91 95999 13099",
		type: "Retailer",
		createdAt: "12/10/2012",
		account_status: "Active",
		ekocsp_code: "10167082",
		location: "Kolkata, W. B.",
	},
	{
		name: "Aaru Pharma",
		mobile_number: "+91 95999 13099",
		type: "Retailer",
		createdAt: "12/10/2012",
		account_status: "Active",
		ekocsp_code: "10167082",
		location: "Kolkata, W. B.",
	},
];

describe("Table", () => {
	it("renders without error with no attributes", () => {
		const { container } = pageRender(
			<Table
				tableRowLimit={10}
				renderer={renderer_mock}
				data={table_data_mock}
				variant="evenStriped"
			/>
		);
		expect(container).not.toBeEmptyDOMElement();

		// expect(container).toHaveTextContent("Any text");

		// const inp = screen.getByLabelText("Input Label");
		// expect(inp).toBeInTheDocument();

		// const btn = utils.getByRole("button", { name: "Submit" });

		// CUSTOM MATCHERS (jest-dom)
		// See all matchers here: https://github.com/testing-library/jest-dom#table-of-contents
		// expect(btn).toBeDisabled();
		// expect(btn).toBeEnabled();
		// expect(inp).toBeInvalid();
		// expect(inp).toBeRequired();
		// expect(btn).toBeVisible();
		// expect(btn).toContainElement(elm);
		// expect(btn).toContainHTML(htmlText: string);
		// expect(btn).toHaveFocus();

		// Check style
		// expect(getByTestId('background')).toHaveStyle(`background-image: url(${props.image})`);

		// Enable snapshot testing:
		// expect(container).toMatchSnapshot();
	});

	// TODO: Write other tests here..
	// Start by writting all possible test cases here using test.todo()
	test.todo(
		"TODO: add proper test cases for Table in __tests__/components/Table/Table.test.jsx"
	);
});
