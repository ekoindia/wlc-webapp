import React from "react";
import ContactPane from "./ContactPane";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Component/ContactPane",
	component: ContactPane,

	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	// More on controls: https://storybook.js.org/docs/react/essentials/controls
	argTypes: {
		className: {
			type: { name: "string", required: false },
			description:
				"Additional classes for this component. Useful to style using TailwindCSS",
			defaultValue: "",
			control: "text",
		},
		/*
		arg2: {
			type: { name: "number", required: false },
			description: "...",
			defaultValue: 0,
			control: { type: "range", min: 0, max: 5, step: 1 },
		},
		arg3: {
			type: { name: "number", required: false },
			description: "...",
			defaultValue: 0,
			control: "number",
		},
		disabled: {
			type: { name: "boolean", required: false },
			description: "Is the component disabled?",
			defaultValue: false,
			control: "boolean",
		},
		tags: {
			type: { name: "array", required: false },
			description: "List of tags for this product",
			defaultValue: [],
			control: "object",
		},
		onClick: { action: "Clicked" },
		*/
	},
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <ContactPane {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
	className: "",
};
