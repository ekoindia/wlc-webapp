import Calendar from "./Calendar";

export default {
	title: "Component/Calendar",
	component: Calendar,

	argTypes: {
		label: {
			type: { name: "string", required: false },
			description: "Label displayed above the input",
			control: "text",
		},
		leftAddon: {
			type: { name: "string", required: false },
			description: 'Left addon content (e.g., "From", "To")',
			control: "text",
		},
		value: {
			type: { name: "string", required: false },
			description: "Selected date value in YYYY-MM-DD format",
			control: "text",
		},
		placeholder: {
			type: { name: "string", required: false },
			description: "Placeholder text shown when no date is selected",
			defaultValue: "YYYY-MM-DD",
			control: "text",
		},
		required: {
			type: { name: "boolean", required: false },
			description: "Whether the field is required",
			defaultValue: false,
			control: "boolean",
		},
		hideOptionalMark: {
			type: { name: "boolean", required: false },
			description: 'Whether to hide the "(optional)" mark',
			defaultValue: false,
			control: "boolean",
		},
		minDate: {
			type: { name: "string", required: false },
			description: "Minimum selectable date in YYYY-MM-DD format",
			control: "text",
		},
		maxDate: {
			type: { name: "string", required: false },
			description: "Maximum selectable date in YYYY-MM-DD format",
			control: "text",
		},
		onChange: { action: "changed" },
	},
};

const Template = (args) => <Calendar {...args} />;

export const Default = Template.bind({});
Default.args = {
	label: "Select Date",
};

export const WithValue = Template.bind({});
WithValue.args = {
	label: "Start Date",
	value: "2024-06-15",
};

export const WithLeftAddon = Template.bind({});
WithLeftAddon.args = {
	label: "Date Range",
	leftAddon: "From",
};

export const WithLeftAddonTo = Template.bind({});
WithLeftAddonTo.args = {
	label: "Date Range",
	leftAddon: "To",
};

export const Required = Template.bind({});
Required.args = {
	label: "Due Date",
	required: true,
};

export const WithMinMaxDates = Template.bind({});
WithMinMaxDates.args = {
	label: "Date Range",
	leftAddon: "Select",
	minDate: "2024-01-01",
	maxDate: "2024-12-31",
};

export const CustomPlaceholder = Template.bind({});
CustomPlaceholder.args = {
	label: "Birth Date",
	placeholder: "Select your birth date",
};
