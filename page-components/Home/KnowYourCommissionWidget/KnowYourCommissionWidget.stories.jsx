import KnowYourCommission from "./KnowYourCommissionWidget";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "PageComponent/Home/KnowYourCommissionWidget",
	component: KnowYourCommission,

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
	},
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <KnowYourCommision {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
	className: "",
};
