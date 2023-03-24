import {
	Box,
	Heading,
	Stack,
	StackDivider,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import { Cards, IconButtons } from "components";

/**
 * A <ContactPane> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<ContactPane></ContactPane>`
 */
const ContactPane = (props) => {
	const contactdata = props.rowdata;
	const [isSmallerThan769] = useMediaQuery("(max-width:769px)");
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

	return (
		<Cards h={{ base: "auto", lg: "100%" }}>
			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
			>
				<Heading
					fontSize={{ base: 20, md: 15, lg: 17, xl: 18 }}
					fontWeight="semibold"
					color={"light"}
				>
					Contact information
				</Heading>
				<IconButtons
					title={isSmallerThan769 ? "" : "Edit Details"}
					iconPos={isSmallerThan769 ? "" : "left"}
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
				fontSize={{ base: 14, md: 12, lg: 14 }}
			>
				<Box display={"flex"} justifyContent={"space-between"}>
					<Box display={"flex"} as="span">
						<Text color="light">Mobile number:</Text>
						<Text fontWeight={"medium"}>
							&nbsp; {contactdata.mobile_number}
						</Text>
					</Box>
					{isSmallerThan769 ? (
						<IconButtons
							variant="success"
							iconName="phone"
							iconStyle={{
								width: "12px",
								height: "12px",
							}}
						/>
					) : (
						""
					)}
				</Box>
				<Box display={"flex"} justifyContent={"space-between"}>
					<Box display={"flex"} as="span">
						<Text color="light">Email:</Text>
						<Text fontWeight={"medium"}>
							&nbsp; {contactdata.email}
						</Text>
					</Box>
					<IconButtons
						title={isSmallerThan769 ? "" : "Email Now"}
						variant="accent"
						hasIcon={isSmallerThan769 ? true : false}
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
