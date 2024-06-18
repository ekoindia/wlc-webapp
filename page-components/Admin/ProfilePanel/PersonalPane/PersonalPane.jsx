import { Flex, Stack, StackDivider, Text } from "@chakra-ui/react";
import { Card, IcoButton } from "components";
import { Endpoints, TransactionIds } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useLocalStorage } from "hooks";
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
 * A <PersonalPane> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @param prop.data
 * @example	`<PersonalPane></PersonalPane>`
 */
const PersonalPane = ({ data }) => {
	const [shopTypeLabel, setShopTypeLabel] = useState();
	const [shopTypes, setShopTypes] = useLocalStorage("oth-shop-types");
	const router = useRouter();
	const { accessToken } = useSession();

	const fetchShopTypes = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionIds.SHOP_TYPE,
			},
			token: accessToken,
		})
			.then((res) => {
				if (res.status === 0) {
					setShopTypes(res?.param_attributes.list_elements);
				}
			})
			.catch((err) => {
				console.error("err", err);
			});
	};

	useEffect(() => {
		if (!shopTypes?.length) {
			fetchShopTypes();
		}
	}, []);

	useEffect(() => {
		if (shopTypes?.length > 0) {
			const _label = getLabel(shopTypes, data?.shop_type);
			setShopTypeLabel(_label);
		}
	}, [data, shopTypes]);

	const personalDataList = [
		{
			label: "Date of birth",
			value: data?.dob ?? data?.date_of_birth,
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
			value: shopTypeLabel,
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
