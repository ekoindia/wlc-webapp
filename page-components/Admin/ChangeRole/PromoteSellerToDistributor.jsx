import { Flex } from "@chakra-ui/react";
import { Button } from "components";
import { Endpoints, ParamType, UserTypeLabel } from "constants";
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

const AGENT_TYPE = {
	RETAILER: "2",
	INDEPENDENT_RETAILER: "3",
};

const retailer_type_list = [
	{
		value: AGENT_TYPE.INDEPENDENT_RETAILER,
		label: "Retailers not mapped to any distributor",
	},
	{
		value: AGENT_TYPE.RETAILER,
		label: "Retailers already mapped to a distributor",
	},
];

/**
 * PromoteSellerToDistributor page-component
 * @returns
 */
const PromoteSellerToDistributor = ({
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
		setValue,
	} = useForm({
		defaultValues: {
			retailer_type: "3",
		},
	});

	const watcher = useWatch({ control });

	useEffect(() => {
		if (!showOrgChangeRoleView && default_agent_mobile) {
			return;
		}

		setValue("retailer", ""); //to reset value of retailer on retailer_type change, to prevent from using previously selected value

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agent-list?usertype=${watcher.retailer_type}`,
				"tf-req-method": "GET",
			},
			token: accessToken,
		})
			.then((res) => {
				const _seller = res?.data?.csp_list ?? [];
				setSellerList(_seller);
			})
			.catch((err) => {
				console.error("error", err);
			});
	}, [default_agent_mobile, watcher.retailer_type]);

	const promote_retailer_parameter_list = [
		{
			name: "retailer_type",
			label: `Select Retailer Type to Search`,
			parameter_type_id: ParamType.LIST,
			list_elements: retailer_type_list,
			is_inactive: !showOrgChangeRoleView && default_agent_mobile,

			styles: { direction: "column", gap: "2" },
		},
		{
			name: "retailer",
			label: `Select ${UserTypeLabel[watcher.retailer_type]}`, //TODO: add an/a
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

	// Handled API according to updated Select component
	const onSubmit = (data) => {
		delete data.retailer_type;
		const { retailer } = data;
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agents/profile/changeRole/promotecsps",
				"tf-req-method": "PUT",
			},
			body: {
				operation_type: 1,
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
						parameter_list: promote_retailer_parameter_list,
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
						Promote
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

export default PromoteSellerToDistributor;
