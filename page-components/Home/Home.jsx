import { Grid } from "@chakra-ui/react";
import { useSession, useTodos } from "contexts";
import { useFeatureFlag } from "hooks";
import dynamic from "next/dynamic";
import Head from "next/head";
import { EarningSummary } from "page-components/Profile";
import { useMemo } from "react";
import {
	BillPaymentWidget,
	CommonTrxnWidget,
	KnowYourCommission,
	NotificationWidget,
	QueryWidget,
	RecentTrxnWidget,
} from ".";

// Lazy-load the Todo Widget
const TodoWidget = dynamic(
	() => import("./TodoWidget").then((pkg) => pkg.TodoWidget),
	{
		ssr: false,
	}
);

// Lazy-load the experimental GPT Chat Beta Widget
const AiChatWidget = dynamic(() => import("./AiChatWidget"), {
	ssr: false,
});

/**
 * A <Home> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Home></Home>` TODO: Fix example
 */
const Home = () => {
	const { isLoggedIn } = useSession();
	const { todos, deleteTodo, toggleTodoDone } = useTodos();

	// Check if the GPT Chat widget is enabled
	const [isGptChatAllowed] = useFeatureFlag("AI_CHATBOT_HOME");

	// Check network speed on page load...
	const isFastNetwork = useMemo(() => {
		// Get network connection strength
		const effectiveConnectionType =
			navigator && "connection" in navigator
				? navigator["connection"]["effectiveType"]
				: "unknown";
		if (
			effectiveConnectionType === "slow-2g" ||
			effectiveConnectionType === "2g"
		) {
			return false;
		}
		return true;
	}, []);

	if (!isLoggedIn) return null;

	const widgets = [
		{ id: 1, component: CommonTrxnWidget },
		{ id: 2, component: BillPaymentWidget },
		{
			id: 3,
			component: () => (
				<NotificationWidget
					title="Unread Notifications"
					compactMode
					unreadOnly
				/>
			),
		},
		{ id: 4, component: EarningSummary },
		{ id: 5, component: KnowYourCommission },
		{ id: 6, component: RecentTrxnWidget },
	];

	if (todos && todos.length > 0) {
		widgets.push({
			id: 91,
			component: () => (
				<TodoWidget
					todos={todos}
					onDeleteTodo={deleteTodo}
					onToggleTodoDone={toggleTodoDone}
				/>
			),
		});
	}

	widgets.push({ id: 99, component: QueryWidget });

	// EXPERIMENTAL: GPT Chat widget
	if (isGptChatAllowed) {
		widgets.push({ id: 100, component: AiChatWidget });
	}

	return (
		<>
			{isFastNetwork ? (
				<Head>
					<link
						rel="prefetch"
						href={
							process.env.NEXT_PUBLIC_CONNECT_WIDGET_URL +
							"/elements/tf-eko-connect-widget/tf-wlc-widget.html"
						}
						as="script"
					></link>
					<link
						rel="prefetch"
						href="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.24/webcomponents-lite.min.js"
						as="script"
					></link>
				</Head>
			) : null}

			<Grid
				templateColumns={{
					base: "repeat(auto-fit,minmax(280px,1fr))",
					md: "repeat(auto-fit,minmax(340px,1fr))",
					// xl: "repeat(auto-fit,minmax(440px,1fr))",
				}}
				justifyContent="center"
				py={{ base: "20px", md: "0px" }}
				gap={{ base: 4, lg: 5, "2xl": 8 }}
				width={"100%"}
			>
				{widgets.map(({ id, component: Component }) => (
					<Component key={id} />
				))}
			</Grid>
		</>
	);
};

export default Home;
