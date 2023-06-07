import { Grid } from "@chakra-ui/react";
import { useSession, useTodos } from "contexts";
import Head from "next/head";
import { useMemo } from "react";
import {
	BillPaymentWidget,
	CommonTrxnWidget,
	NotificationWidget,
	QueryWidget,
	RecentTrxnWidget,
	TodoWidget,
} from ".";

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
	const { todos, deleteTodo } = useTodos();

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
		{ id: 3, component: NotificationWidget },
		{ id: 4, component: RecentTrxnWidget },
	];

	if (todos && todos.length > 0) {
		widgets.push({
			id: 5,
			component: () => (
				<TodoWidget todos={todos} onDeleteTodo={deleteTodo} />
			),
		});
	}

	widgets.push({ id: 6, component: QueryWidget });

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
