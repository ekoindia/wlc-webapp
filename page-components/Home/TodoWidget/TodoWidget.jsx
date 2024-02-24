import { Box, Flex, Text } from "@chakra-ui/react";
import { IcoButton, Icon } from "components";
import { useKBarReady } from "components/CommandBar";
import { useClipboard } from "hooks";
import { useKBar } from "kbar";
import { useState } from "react";

/**
 * A <TodoWidget> component to show a list of Todo notes on homepage for agents.
 * @param 	{object}	prop	Properties passed to the component
 * @param	{Array}		prop.todos	List of todos to show.
 * @param	{function}	prop.onDeleteTodo	Function to delete a todo.
 * @param	{...*}		rest	Rest of the props passed to this component.
 * @example	`<TodoWidget />` TODO: Fix example
 */
const TodoWidget = ({ todos, onDeleteTodo, ...rest }) => {
	const { copy, state } = useClipboard();
	const [markedDone, setMarkedDone] = useState(-1);
	const { query } = useKBar();

	// Check if CommandBar is loaded...
	const { ready } = useKBarReady();

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
			// fontSize={{ base: "md", md: "lg" }}
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
					key={todo + index}
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
						position="relative"
						direction="row"
						align="center"
						justify="flex-start"
						w="full"
						ml="5px"
						role="group"
						overflow="hidden"
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
						<Text
							as="span"
							flexGrow={1}
							textAlign="middle"
							ml="5px"
							noOfLines={1}
							textDecoration={
								markedDone === index ? "line-through" : "none"
							}
						>
							{todo}
						</Text>
						<Flex
							align="center"
							// position="absolute"
							// top={0}
							// bottom={0}
							// right="0"
							width={{ base: "80px", md: "0" }}
							transition="width 0.1s ease-out"
							_groupHover={{ width: "80px" }}
						>
							{ready && (
								<IcoBtn
									title="Search with this note"
									iconName="search"
									onClick={() => {
										query.toggle();
										setTimeout(() => {
											query.setSearch(todo);
										}, 100);
									}}
								/>
							)}
							<IcoBtn
								title="Copy note"
								iconName={
									state[todo] === "SUCCESS"
										? "check"
										: "content-copy"
								}
								onClick={() => copy(todo)}
							/>
						</Flex>
					</Flex>
				</Flex>
			))}
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
			mr="8px"
			bg={bg || "yellow.600"}
			transition="opacity 0.3s ease-out"
			_hover={{ opacity: 0.9 }}
			onClick={onClick}
			{...rest}
		/>
	);
};

export default TodoWidget;
