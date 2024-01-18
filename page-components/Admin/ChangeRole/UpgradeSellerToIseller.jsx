import { Flex } from "@chakra-ui/react";
import { Button } from "components";
import { Endpoints, ParamType } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

const renderer = {
	label: "name",
	value: "mobile",
};

/**
 * UpgradeSellerToIseller page-component
 * @returns
 */
const UpgradeSellerToIseller = ({
	agentData,
	setResponseDetails,
	showOrgChangeRoleView,
}) => {
	const [sellerList, setSellerList] = useState([]);
	const { accessToken } = useSession();

	const router = useRouter();

	const default_agent_mobile = agentData?.agent_mobile;

	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		control,
		register,
	} = useForm();

	const watcher = useWatch({ control });

	useEffect(() => {
		if (!showOrgChangeRoleView && default_agent_mobile) {
			return;
		}

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agent-list?usertype=2",
				"tf-req-method": "GET",
			},
			token: accessToken,
		}).then((res) => {
			const _seller = res?.data?.csp_list ?? [];
			setSellerList(_seller);
		});
	}, [default_agent_mobile]);

	const unassign_retailer_parameter_list = [
		{
			name: "retailer",
			label: "Select Retailer",
			parameter_type_id: ParamType.LIST,
			list_elements: sellerList,
			renderer: renderer,
			getOptionLabel: (option) => `${option.name} ✆ ${option.mobile}`,
			meta: {
				force_dropdown: true,
			},
			is_inactive: !showOrgChangeRoleView && default_agent_mobile,
		},
	];

	const onSubmit = (data) => {
		const { retailer } = data;
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri":
					"/network/agents/profile/changeRole/upgrademerchant",
				"tf-req-method": "PUT",
			},
			body: {
				agent_mobile: default_agent_mobile ?? retailer[renderer.value],
			},
			token: accessToken,
		}).then((res) => {
			setResponseDetails({ status: res.status, message: res.message });
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Flex direction="column" gap="8">
				<Form
					{...{
						parameter_list: unassign_retailer_parameter_list,
						register,
						control,
						formValues: watcher,
						errors,
					}}
				/>

				<Flex
					direction={{ base: "row-reverse", md: "row" }}
					w={{ base: "100%", md: "500px" }}
					position={{ base: "fixed", md: "initial" }}
					gap={{ base: "0", md: "16" }}
					align="center"
					bottom="0"
					left="0"
					bg="white"
				>
					<Button
						type="submit"
						size="lg"
						h="64px"
						w={{ base: "100%", md: "200px" }}
						fontWeight="bold"
						borderRadius={{ base: "none", md: "10" }}
						loading={isSubmitting}
					>
						Unassign
					</Button>

					<Button
						h={{ base: "64px", md: "auto" }}
						w={{ base: "100%", md: "initial" }}
						bg={{ base: "white", md: "none" }}
						variant="link"
						fontWeight="bold"
						color="primary.DEFAULT"
						_hover={{ textDecoration: "none" }}
						borderRadius={{ base: "none", md: "10" }}
						onClick={() => router.back()}
					>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</form>
	);
};

export default UpgradeSellerToIseller;
