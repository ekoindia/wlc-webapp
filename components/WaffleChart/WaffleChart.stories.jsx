import { WaffleChart } from "./WaffleChart";

export default {
	title: "Components/WaffleChart",
	component: WaffleChart,
	argTypes: {
		rows: {
			control: { type: "number", min: 5, max: 20, step: 1 },
		},
		cols: {
			control: { type: "number", min: 5, max: 20, step: 1 },
		},
		size: {
			control: { type: "text" },
		},
		gap: {
			control: { type: "text" },
		},
		animationDuration: {
			control: { type: "text" },
		},
		animationDelay: {
			control: { type: "text" },
		},
	},
};

const Template = (args) => <WaffleChart {...args} />;

export const Default = Template.bind({});
Default.args = {
	data: [
		{ value: 30, label: "Category A" },
		{ value: 20, label: "Category B" },
		{ value: 15, label: "Category C" },
		{ value: 35, label: "Category D" },
	],
	rows: 10,
	cols: 10,
	size: "8px",
	gap: "4px",
};
Default.parameters = {
	docs: {
		description: {
			story: "Basic waffle chart with default styling and CSS diagonal entrance animations. Watch as squares appear in a diagonal wave from top-left to bottom-right. Hover over individual squares to see scale effects and tooltip with percentages.",
		},
	},
};

export const CustomColors = Template.bind({});
CustomColors.args = {
	data: [
		{ value: 25, label: "Red Category" },
		{ value: 35, label: "Blue Category" },
		{ value: 40, label: "Green Category" },
	],
	colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
	rows: 8,
	cols: 12,
	size: "10px",
	gap: "2px",
};

export const LargeChart = Template.bind({});
LargeChart.args = {
	data: [
		{ value: 40, label: "Primary" },
		{ value: 30, label: "Secondary" },
		{ value: 20, label: "Tertiary" },
		{ value: 10, label: "Other" },
	],
	rows: 15,
	cols: 15,
	size: "6px",
	gap: "3px",
};

export const SmallChart = Template.bind({});
SmallChart.args = {
	data: [
		{ value: 60, label: "Majority" },
		{ value: 40, label: "Minority" },
	],
	rows: 5,
	cols: 8,
	size: "12px",
	gap: "5px",
};

export const SlowAnimation = Template.bind({});
SlowAnimation.args = {
	data: [
		{ value: 20, label: "Category A" },
		{ value: 30, label: "Category B" },
		{ value: 25, label: "Category C" },
		{ value: 25, label: "Category D" },
	],
	rows: 6,
	cols: 8,
	size: "10px",
	gap: "3px",
	animationDuration: "1.2s",
	animationDelay: "0.08s",
};
SlowAnimation.parameters = {
	docs: {
		description: {
			story: "Waffle chart with customized slower animation timing. Uses 1.2s duration and 0.08s delay between squares for a more dramatic diagonal entrance effect from top-left to bottom-right.",
		},
	},
};
