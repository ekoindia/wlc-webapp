import { Flex, Stack, StackDivider, Text } from "@chakra-ui/react";
import { Card, IcoButton, Icon } from "components";
import { useClipboard } from "hooks";
import { useRouter } from "next/router";

/**
 * A <ContactPane> component that displays contact information.
 *
 * This component receives a data object as a prop and displays the mobile number and email. It also provides buttons to call the mobile number and send an email.
 * @param {object} props - Properties passed to the component
 * @param {object} props.data - The data object containing contact details
 * @param {string} props.data.agent_mobile - The mobile number of the agent
 * @param {string} props.data.email - The email of the agent
 * @param {string} [props.className] - Optional classes to pass to this component
 * @example
 * const data = {
 *   agent_mobile: '1234567890',
 *   email: 'example@example.com'
 * };
 *
 * <ContactPane data={data} />
 */
const ContactPane = ({ data }) => {
	const router = useRouter();
	const { agent_mobile, email } = data ?? {};
	const { copy, state } = useClipboard();

	const contactDataList = [
		{
			label: "Mobile",
			value: agent_mobile,
			iconName: "phone",
			onClick: () => {
				router.push(`tel:${agent_mobile}`);
			},
		},
		{
			label: "Email",
			value: email,
			iconName: "mail",
			onClick: () => {
				router.push(`mailto:${email}`);
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
									<Flex
										align="center"
										gap="0.5"
										cursor="pointer"
										transition="opacity 0.3s ease-out"
										_hover={{ opacity: 0.9 }}
										onClick={() => copy(value)}
									>
										<Text fontWeight="medium" color="dark">
											{value}
										</Text>
										<Icon
											title="Copy"
											name={
												state[value]
													? "check"
													: "content-copy"
											}
											size="xs"
											color="light"
										/>
									</Flex>
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
