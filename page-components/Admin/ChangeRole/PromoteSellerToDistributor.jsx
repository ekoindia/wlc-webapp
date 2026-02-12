import { Flex, useToast } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { Endpoints, ParamType, UserType, UserTypeLabel } from "constants";
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
		label: `${UserTypeLabel[UserType.MERCHANT]}s (${
			UserTypeLabel[UserType.MERCHANT]
		}s not mapped to any ${UserTypeLabel[UserType.DISTRIBUTOR]})`,
	},
	{
		value: AGENT_TYPE.RETAILER,
		label: `${UserTypeLabel[UserType.MERCHANT]}s already mapped to a ${
			UserTypeLabel[UserType.DISTRIBUTOR]
		}`,
	},
];

/**
 * PromoteSellerToDistributor page-component
 * @param root0
 * @param root0.agentData
 * @param root0.showOrgChangeRoleView
 * @returns
 */
const PromoteSellerToDistributor = ({ agentData, showOrgChangeRoleView }) => {
	const [sellerList, setSellerList] = useState([]);
	const { accessToken } = useSession();
	const toast = useToast();

	const router = useRouter();

	const default_agent_mobile = agentData?.agent_mobile;

	const {
		handleSubmit,
		formState: { errors, isSubmitting, isValid, isDirty },
		control,
		register,
		setValue,
		reset,
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
			label: `Select ${UserTypeLabel[UserType.MERCHANT]} Type to Search`,
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
		const { retailer } = data || {};
		if (!retailer) {
			console.error("Retailer is required.");
			return;
		}
		return fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				headers: {
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri":
						"/network/agents/profile/changeRole/promotecsps",
					"tf-req-method": "PUT",
				},
				body: {
					operation_type: 1,
					agent_mobile:
						default_agent_mobile ?? retailer[renderer.value],
				},
				token: accessToken,
			}
		)
			.then((res) => {
				// Success Response Type ID for promotecsps is 1967
				if (res.response_type_id === 1967) {
					toast({
						title: res.message,
						status: "success",
						duration: 3000,
						isClosable: true,
					});
					reset(data);
					return;
				} else {
					toast({
						title: res.message,
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				}
			})
			.catch((err) => {
				toast({
					title: err?.message || "Something went wrong",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			});
	};

	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Promote",
			loading: isSubmitting,
			disabled: !isValid || !isDirty,
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: () => router.back(),
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

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

				<ActionButtonGroup {...{ buttonConfigList }} />
			</Flex>
		</form>
	);
};

export default PromoteSellerToDistributor;
