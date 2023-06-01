import { Box, Flex, Grid } from "@chakra-ui/react";
import { IcoButton, Icon } from "components";
import { useSession, useTodos } from "contexts";
import { useClipboard } from "hooks";
import { useState } from "react";
import {
	BillPaymentWidget,
	CommonTrxnWidget,
	NotificationWidget,
	QueryWidget,
	RecentTrxnWidget,
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

	if (!isLoggedIn) return null;

	const widgets = [
		{ id: 1, component: CommonTrxnWidget },
		{ id: 2, component: BillPaymentWidget },
		{ id: 3, component: NotificationWidget },
		{ id: 4, component: RecentTrxnWidget },
		{ id: 5, component: QueryWidget },
	];

	if (todos && todos.length > 0) {
		widgets.push({
			id: 6,
			component: () => (
				<StickyNote todos={todos} onDeleteTodo={deleteTodo} />
			),
		});
	}

	return (
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
	);
};

export default Home;

const StickyNote = ({ todos, onDeleteTodo, ...rest }) => {
	const { copy, state } = useClipboard();
	const [markedDone, setMarkedDone] = useState(-1);
	// const { query } = useKBar();

	const markDone = (index) => {
		setMarkedDone(index);
		setTimeout(() => {
			onDeleteTodo(index);
		}, 500);
	};

	return (
		<Box
			boxSizing="border-box"
			minH="200px"
			maxH={{
				base: "auto",
				md: "320px",
			}}
			// p="20px"
			pt="35px"
			pb="10px"
			mx={{ base: 3, md: "0" }}
			backgroundColor="yellow.200"
			boxShadow="md"
			position="relative"
			overflowY="auto"
			fontSize={{ base: "md", md: "lg" }}
			color="yellow.900"
			_before={{
				content: '""',
				position: "absolute",
				top: 0,
				left: 0,
				h: "35px",
				w: "full",
				bg: "blackAlpha.200",
			}}
			// _before={{
			// 	content: '""',
			// 	position: "absolute",
			// 	right: 0,
			// 	top: 0,
			// 	width: 0,
			// 	height: 0,
			// 	borderStyle: "solid",
			// 	borderWidth: "0 20px 20px 0",
			// 	borderColor: "transparent bg bg transparent",
			// 	boxShadow: "-1px 1px 1px rgba(0, 0, 0, 0.4)",
			// }}
			{...rest}
		>
			{todos.map((todo, index) => (
				<Flex
					key={todo.id}
					direction="row"
					align="center"
					justify="space-between"
					py="5px"
					position="relative"
					_hover={{
						bg: "yellow.300",
					}}
					_before={{
						content: '""',
						position: "absolute",
						bottom: 0,
						left: 0,
						h: "1px",
						w: "full",
						bg: "blackAlpha.400",
					}}
				>
					<Flex
						direction="row"
						align="center"
						justify="flex-start"
						w="full"
						ml="5px"
						role="group"
					>
						<Icon
							title="Mark as done"
							name={
								markedDone === index
									? "check-box"
									: "check-box-outline-blank"
							}
							cursor="pointer"
							// bg="yellow.600"
							color="yellow.600"
							size="md"
							mx="5px"
							onClick={() => markDone(index)}
						/>
						<Box
							as="span"
							flexGrow={1}
							ml="5px"
							noOfLines={1}
							textDecoration={
								markedDone === index ? "line-through" : "none"
							}
						>
							{todo}
						</Box>
						<IcoBtn
							opacity="0"
							mr="5px"
							_groupHover={{ opacity: 1 }}
							transition="opacity 0.3s ease-out"
							title="Copy note"
							iconName={
								state === "SUCCESS" ? "check" : "content-copy"
							}
							bg="yellow.600"
							onClick={() => copy(todo)}
						/>
					</Flex>
					{/* <IcoBtn
						title="Delete todo"
						iconName="delete"
						bg="error"
						ml="10px"
						onClick={() => onDeleteTodo && onDeleteTodo(index)}
					/> */}
				</Flex>
			))}
			{/* <Flex
				direction="row"
				align="flex-end"
				position="absolute"
				bottom="0"
				left="0"
				w="full"
				p={{ base: "5px", md: "10px" }}
				fontSize="xs"
				color="yellow.900"
			>
				<IcoBtn
					title="Copy note"
					iconName={state === "SUCCESS" ? "check" : "content-copy"}
					bg="yellow.600"
					onClick={() => copy(note)}
				/>
				<IcoBtn
					title="Delete note"
					iconName="delete"
					bg="error"
					onClick={onDeleteNote}
				/>
			</Flex> */}
		</Box>
	);
};

const IcoBtn = ({ iconName, title = "Button", bg, onClick, ...rest }) => {
	return (
		<IcoButton
			title={title}
			iconName={iconName}
			theme="dark"
			size="sm"
			// ml={{ base: "15px", xl: "20px" }}
			rounded="full"
			opacity="0.7"
			bg={bg}
			_hover={{ opacity: 0.9 }}
			onClick={onClick}
			{...rest}
		/>
	);
};
