import {
	Box,
	Flex,
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
const ContactPane = ({ rowData: contactdata }) => {
	const [isSmallerThan769] = useMediaQuery("(max-width:769px)");

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
						size: "12px",
					}}
				/>
			</Box>

			<Stack
				direction="column"
				divider={<StackDivider />}
				mt="5"
				fontSize={{ base: 14, md: 12, lg: 14 }}
			>
				<Flex justifyContent={"space-between"}>
					<Flex as="span" align="center">
						<Text color="light">Mobile number:</Text>
						<Text fontWeight={"medium"}>
							&nbsp; {contactdata?.mobile_number}
						</Text>
					</Flex>
					{isSmallerThan769 ? (
						<IconButtons
							variant="success"
							iconName="phone"
							iconStyle={{
								size: "12px",
							}}
						/>
					) : (
						""
					)}
				</Flex>
				<Flex justifyContent={"space-between"}>
					<Flex as="span" align="center">
						<Text color="light">Email:</Text>
						<Text fontWeight={"medium"}>
							&nbsp; {contactdata?.email}
						</Text>
					</Flex>
					<IconButtons
						title={isSmallerThan769 ? "" : "Email Now"}
						variant="accent"
						hasIcon={isSmallerThan769 ? true : false}
						iconName="mail"
						iconStyle={{
							size: "12px",
						}}
					/>
				</Flex>
			</Stack>
		</Cards>
	);
};

export default ContactPane;
