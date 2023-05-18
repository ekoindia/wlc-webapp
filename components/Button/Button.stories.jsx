import Button from "./Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Component/Button",
	component: Button,

	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	// More on controls: https://storybook.js.org/docs/react/essentials/controls
	argTypes: {
		variant: {
			type: { name: "string", required: false },
			description: "Variant for the button",
			defaultValue: "primary",
			// control: "text",
		},
		shape: {
			type: { name: "string", required: false },
			description: "Shape for the button",
			defaultValue: "primary",
			// control: "text",
		},
		disabled: {
			type: { name: "string", required: false },
			description: "Disabled for the button",
			defaultValue: false,
			control: "text",
		},
		size: {
			type: { name: "string", required: false },
			description: "Disabled for the button",
			control: "text",
		},
	},
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Button {...args}>Click Me</Button>;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
	disabled: false,
};

export const Accent = Template.bind({});
Accent.args = {
	theme: "red",
};

export const Rounded = Template.bind({});
Rounded.args = {
	theme: "accent",
	shape: "rounded",
};
