import Button from "./Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Component/Button",
	component: Button,

	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	// More on controls: https://storybook.js.org/docs/react/essentials/controls
	argTypes: {
		title: {
			type: { name: "string", required: false },
			description: "Title for the button",
			defaultValue: "Button",
			control: "text",
		},
		variant: {
			type: { name: "string", required: false },
			description: "Variant for the button",
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
const Template = (args) => <Button {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
	title: "button",
	variant: "primary",
	disabled: false,
};
