import { RouterContext } from "next/dist/shared/lib/router-context";
import CommissionsTable from "./CommissionsTable";

export default {
	title: "PageComponent/Commissions/CommissionsTable",
	component: CommissionsTable,
	decorators: [
		(Story) => (
			<RouterContext.Provider
				value={{
					push: () => {},
					replace: () => {},
					prefetch: () => {},
					route: "/",
					pathname: "/",
					query: {},
					asPath: "/",
				}}
			>
				<Story />
			</RouterContext.Provider>
		),
	],
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

const Template = (args) => <CommissionsTable {...args} />;

export const Default = Template.bind({});
Default.args = {
	className: "",
};
