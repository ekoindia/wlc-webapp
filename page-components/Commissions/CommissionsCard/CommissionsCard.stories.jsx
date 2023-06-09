import CommissionsCard from "./CommissionsCard";

export default {
	title: "PageComponent/Commissions/CommissionsCard",
	component: CommissionsCard,

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

const Template = (args) => <CommissionsCard {...args} />;

export const Default = Template.bind({});

Default.args = {
	className: "",
};
