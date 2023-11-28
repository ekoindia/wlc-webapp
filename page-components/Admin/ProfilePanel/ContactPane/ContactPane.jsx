import { Flex, Stack, StackDivider, Text } from "@chakra-ui/react";
import { Card, IcoButton } from "components";
import { useRouter } from "next/router";

/**
 * A <ContactPane> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<ContactPane></ContactPane>`
 */
const ContactPane = ({ data }) => {
	const router = useRouter();

	const contactDataList = [
		{
			label: "Mobile",
			value: data?.agent_mobile,
			iconName: "phone",
			onClick: () => {
				router.push(`tel:${data?.agent_mobile}`);
			},
		},
		{
			label: "Email",
			value: data?.email,
			iconName: "mail",
			onClick: () => {
				router.push(`mailto:${data?.email}`);
			},
		},
	];

	return (
		<Card h="auto">
			<Text as="b" color="light">
				Contact information
			</Text>

			<Stack
				direction="column"
				divider={<StackDivider />}
				mt="4"
				fontSize="sm"
			>
				{contactDataList.map(
					({ label, value, iconName, onClick }) =>
						value && (
							<Flex
								key={label}
								justify="space-between"
								align="center"
							>
								<Flex gap="1" color="light">
									{label}:
									<Text fontWeight="medium" color="dark">
										{value}
									</Text>
								</Flex>
								<IcoButton
									size="sm"
									theme="accent"
									iconName={iconName}
									onClick={onClick}
								/>
							</Flex>
						)
				)}
			</Stack>
		</Card>
	);
};

export default ContactPane;
