import {
	Box,
	Heading,
	Stack,
	StackDivider,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import { Cards, IconButtons } from "../";

const ContactPane = () => {
	const [isSmallerThan768] = useMediaQuery("(max-width:768px)");
	// useEffect(() => {
	// 	window.addEventListener("resize", (e) => {
	// 		console.log("inside useEffect", useDim);
	// 		let innerWidth = e.currentTarget.innerWidth;
	// 		if (innerWidth < 768) {
	// 			console.log("innerWidth", innerWidth);
	// 			setDim(innerWidth);
	// 		}
	// 	});
	// 	return () => {
	// 		window.removeEventListener("resize");
	// 	};
	// }, []);

	const contactData = [
		{
			label: "Mobile Number",
			data: "+91 9898239232",
		},
		{
			label: "Email",
			data: "angeltech@email.co.in",
		},
	];

	return (
		<Cards h="365px">
			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
			>
				<Heading
					fontSize={{ base: 16, md: 18 }}
					fontWeight="semibold"
					color={"light"}
				>
					Contact information
				</Heading>
				<IconButtons
					title={isSmallerThan768 ? "" : "Edit Details"}
					iconPos={isSmallerThan768 ? "" : "left"}
					iconName="mode-edit"
					iconStyle={{
						width: "12px",
						height: "12px",
					}}
				/>
			</Box>

			<Stack
				direction="column"
				divider={<StackDivider />}
				mt="5"
				fontSize={14}
			>
				<Box display={"flex"} justifyContent={"space-between"}>
					<Box display={"flex"} as="span">
						<Text color="light">Mobile number:</Text>
						<Text fontWeight={"medium"}>&nbsp; +91 9898239232</Text>
					</Box>
					<IconButtons
						variant="success"
						hasIcon={isSmallerThan768 ? true : false}
						iconName="phone"
						iconStyle={{
							width: "12px",
							height: "12px",
						}}
					/>
				</Box>
				<Box display={"flex"} justifyContent={"space-between"}>
					<Box display={"flex"} as="span">
						<Text color="light">Email:</Text>
						<Text fontWeight={"medium"}>
							&nbsp; angeltech@email.co.in
						</Text>
					</Box>
					<IconButtons
						title={isSmallerThan768 ? "" : "Email Now"}
						variant="accent"
						hasIcon={isSmallerThan768 ? true : false}
						iconName="mail"
						iconStyle={{
							width: "12px",
							height: "12px",
						}}
					/>
				</Box>
			</Stack>
		</Cards>
	);
};

export default ContactPane;
