import { Flex, Stack, StackDivider, Text } from "@chakra-ui/react";
import { Card, IcoButton } from "components";
import { useRouter } from "next/router";

/**
 * A <PersonalPane> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<PersonalPane></PersonalPane>`
 */
const PersonalPane = ({ data }) => {
	const router = useRouter();

	const personalDataList = [
		{
			label: "Date of birth",
			value: data?.date_of_birth,
		},
		{ label: "Gender", value: data?.gender },
		{
			label: "Shop name",
			value: data?.shop_name,
		},
		{
			label: "Marital Status",
			value: data?.marital_status,
		},
		// {
		// 	label: "Monthly Income",
		// 	value: data?.monthly_income,
		// },
		{
			label: "Shop Type",
			value: data?.shop_type,
		},
	];

	return (
		<Card h="auto">
			<Flex justify="space-between">
				<Text as="b" color="light">
					Personal information
				</Text>
				<IcoButton
					onClick={() =>
						router.push("/admin/my-network/profile/up-per-info")
					}
					theme="accent"
					title="Edit Detail"
					iconName="mode-edit"
					size="sm"
				/>
			</Flex>
			<Stack
				direction="column"
				divider={<StackDivider />}
				mt="4"
				fontSize="sm"
			>
				{personalDataList.map(({ label, value }) => (
					<Flex gap="1" color="light" key={label}>
						{label}:
						<Text fontWeight="medium" color="dark">
							{value}
						</Text>
					</Flex>
				))}
			</Stack>
		</Card>
	);
};

export default PersonalPane;
