import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { IcoButton } from "components";
import { useNote, useSession } from "contexts";
import { useClipboard } from "hooks";
import { formatDateTime } from "utils";
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
	const { note, updatedAt, deleteNote } = useNote();

	if (!isLoggedIn) return null;

	const widgets = [
		{ id: 1, component: CommonTrxnWidget },
		{ id: 2, component: BillPaymentWidget },
		{ id: 3, component: NotificationWidget },
		{ id: 4, component: RecentTrxnWidget },
		{ id: 5, component: QueryWidget },
	];

	if (note) {
		widgets.push({
			id: 6,
			component: () => (
				<StickyNote
					note={note}
					updatedAt={updatedAt}
					onDeleteNote={deleteNote}
				/>
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

const StickyNote = ({ note, updatedAt, onDeleteNote, ...rest }) => {
	const { copy, state } = useClipboard();
	// const { query } = useKBar();
	return (
		<Box
			boxSizing="border-box"
			minH="200px"
			p="20px"
			py="50px"
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
			{note}
			<Flex
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
				<Text flexGrow={1} opacity={0.5}>
					{formatDateTime(updatedAt, "dd/MM/yyyy, hh:mm AA")}
				</Text>
				{/* <IcoBtn
					title="Search note"
					iconName="search"
					bg="accent.light"
					onClick={() => {
						query.setSearch(note);
						query.toggle();
					}}
				/> */}
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
			</Flex>
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
			ml={{ base: "15px", xl: "20px" }}
			rounded="full"
			opacity="0.7"
			bg={bg}
			_hover={{ opacity: 0.9 }}
			onClick={onClick}
			{...rest}
		/>
	);
};
