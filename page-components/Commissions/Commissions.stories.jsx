import { UserProvider } from "../../contexts/UserContext";
import Commissions from "./Commissions";

// Custom mock implementation of useRouter
const mockRouter = {
	route: "/",
	query: {},
	asPath: "/",
	push: () => {},
};

test.mock("next/router", () => ({
	useRouter: () => mockRouter,
}));

export default {
	title: "PageComponent/Commissions",
	component: Commissions,
	argTypes: {
		className: {
			type: { name: "string", required: false },
			description:
				"Additional classes for this component. Useful to style using TailwindCSS",
			defaultValue: "",
			control: "text",
		},
	},
	decorators: [
		(Story) => (
			<UserProvider>
				<Story />
			</UserProvider>
		),
	],
};

const Template = (args) => <Commissions {...args} />;

export const Default = Template.bind({});
Default.args = {
	className: "",
};
