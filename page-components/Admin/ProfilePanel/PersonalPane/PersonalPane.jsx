import { Flex, Stack, StackDivider, Text } from "@chakra-ui/react";
import { Card, IcoButton } from "components";
import { useSession } from "contexts";
import { useShopTypes } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const getLabel = (list, id) => {
	for (let i = 0; i < list.length; i++) {
		if (list[i].value == id) {
			return list[i].label;
		}
	}
	return null; // If the id is not found in the list
};

/**
 * A <PersonalPane> component that displays personal information of a user
 * @param {object} prop - Properties passed to the component
 * @param {object} prop.data - User's personal data including dob, gender, shop_name, etc.
 * @returns {JSX.Element} - The PersonalPane component
 * @example	`<PersonalPane data={userData} />`
 */
const PersonalPane = ({ data }) => {
	const router = useRouter();
	const { mobile } = router.query;
	const [shopTypeLabel, setShopTypeLabel] = useState();
	const { isAdmin } = useSession();
	const { shopTypes } = useShopTypes();

	useEffect(() => {
		if (shopTypes?.length > 0) {
			const _label = getLabel(shopTypes, data?.shop_type);
			setShopTypeLabel(_label);
		}
	}, [data, shopTypes]);

	const personalDataList = [
		{
			label: "Date of Birth",
			value: data?.dob ?? data?.date_of_birth,
		},
		{ label: "Gender", value: data?.gender },
		{
			label: "Marital Status",
			value: data?.marital_status,
		},
		{
			label: "Shop Name",
			value: data?.shop_name,
		},
		{
			label: "Shop Type",
			value: shopTypeLabel || data?.shop_type,
		},
	];

	const handleEditRoute = () => {
		const pathname = isAdmin
			? "/admin/my-network/profile/up-per-info"
			: "/my-network/profile/up-per-info";

		router.push({
			pathname: pathname,
			query: { mobile },
		});
	};

	return (
		<Card h="auto">
			<Flex justify="space-between">
				<Text as="b" color="light">
					Personal information
				</Text>
				<IcoButton
					onClick={handleEditRoute}
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
