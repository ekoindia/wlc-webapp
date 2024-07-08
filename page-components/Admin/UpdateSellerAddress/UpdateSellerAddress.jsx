import { Box, Divider, Flex, Text, useToast } from "@chakra-ui/react";
import { ActionButtonGroup, Headings } from "components";
import { Endpoints, ParamType, TransactionIds } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

const ownership_type_list = [
	{ label: "Owned", value: "Owned" },
	{ label: "Rented", value: "Rented" },
	{ label: "Family Owned", value: "Family Owned" },
	{ label: "Other", value: "Other" },
];

const findObjectByValue = (arr, value) => arr.find((obj) => obj.value == value);

/**
 * A UpdateSellerAddress page-component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<UpdateSellerAddress></UpdateSellerAddress>`
 */
const UpdateSellerAddress = () => {
	const [agentData, setAgentData] = useState();
	const [statesList, setStatesList] = useState([]);
	// const [isPermanentAddress, setIsPermanentAddress] = useState(true);
	const { accessToken } = useSession();
	const toast = useToast();

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting, isDirty, isValid },
		control,
		reset,
	} = useForm();

	const watcher = useWatch({ control });

	const router = useRouter();

	const fetchStatesList = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionIds.STATE_TYPE,
			},
			token: accessToken,
		})
			.then((res) => {
				if (res.status === 0) {
					setStatesList(res?.param_attributes.list_elements);
				}
			})
			.catch((err) => {
				console.error("err", err);
			});
	};

	const fetchAgentDataViaCellNumber = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				// "tf-req-uri": `/network/agents?record_count=1&search_value=${mobile}`,
				"tf-req-method": "GET",
			},
			token: accessToken,
		})
			.then((res) => {
				setAgentData(res?.data?.agent_details[0]);
			})
			.catch((error) => {
				console.error("[ProfilePanel] Get Agent Detail Error:", error);
			});
	};

	useEffect(() => {
		fetchStatesList();
		const storedData = JSON.parse(
			localStorage.getItem("oth_last_selected_agent")
		);
		if (storedData !== undefined) {
			setAgentData(storedData);
		} else {
			fetchAgentDataViaCellNumber();
		}
	}, []);

	useEffect(() => {
		let defaultValues = {};

		const _state =
			agentData?.state == "Delhi"
				? "National Capital Territory of Delhi (UT)"
				: agentData?.state;

		const state = findObjectByValue(statesList, _state);

		const ownership_type = findObjectByValue(
			ownership_type_list,
			agentData?.address_details?.ownership_type
		);

		defaultValues.address_line1 = agentData?.line_1;
		defaultValues.address_line2 = agentData?.line_2;
		defaultValues.pincode = agentData?.zip;
		defaultValues.city = agentData?.city;
		defaultValues.country_state = state;
		defaultValues.country = "India";
		defaultValues.shop_ownership_type = ownership_type;

		reset({ ...defaultValues });
	}, [agentData, statesList]);

	const handleFormSubmit = (submittedData) => {
		const keysToFlatten = ["country_state", "shop_ownership_type"];

		const finalData = Object.entries(submittedData).reduce(
			(acc, [key, value]) => {
				if (keysToFlatten.includes(key)) {
					if (value?.value !== undefined && value?.value !== "") {
						acc[key] = value.value;
					}
				} else {
					if (value !== undefined && value !== "") {
						acc[key] = value;
					}
				}
				return acc;
			},
			{}
		);

		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION_JSON,
			{
				headers: {
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": "/network/agents/profile/address/update",
					"tf-req-method": "POST",
				},
				body: { ...finalData, merchant_code: agentData?.eko_code },
				token: accessToken,
			}
		)
			.then((response) => {
				toast({
					title: response?.message,
					status: getStatus(response?.status),
					duration: 2000,
					isClosable: true,
				});

				if (response?.status == 0) {
					router.push(
						"/admin/my-network/profile?mobile=" +
							agentData.agent_mobile
					);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const current_address_parameter_list = [
		{
			name: "address_line1",
			label: "Address Line 1",
		},
		{
			name: "address_line2",
			label: "Address Line 2",
			required: false,
		},
		{
			name: "pincode",
			label: "Postel Code",
			parameter_type_id: ParamType.NUMERIC,
			step: "1",
			maxLength: 6,
		},
		{
			name: "city",
			label: "City",
		},
		{
			name: "country_state",
			label: "State",
			parameter_type_id: ParamType.LIST,
			list_elements: statesList,
		},
		{
			name: "country",
			label: "Country",
			disabled: true,
		},
		{
			name: "shop_ownership_type",
			label: "Ownership Type",
			parameter_type_id: ParamType.LIST,
			list_elements: ownership_type_list,
		},
	];

	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Save",
			loading: isSubmitting,
			disabled: !isValid || !isDirty,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
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

	// const permanentAddressFormFields = [
	// 	{
	// 		name: "permanent_address_line1",
	// 		label: "Address Line 1",
	// 	},
	// 	{
	// 		name: "permanent_address_line2",
	// 		label: "Address Line 2",
	// 		required: false,
	// 	},
	// 	{
	// 		name: "permanent_address_pincode",
	// 		label: "Postel Code",
	// 		parameter_type_id: ParamType.NUMERIC,
	// 		step: "1",
	// 	},
	// 	{
	// 		name: "permanent_address_city",
	// 		label: "City",
	// 	},
	// 	{
	// 		name: "permanent_address_state",
	// 		label: "State",
	// 		parameter_type_id: ParamType.LIST,
	// 		list_elements: statesList,
	// 	},
	// 	{
	// 		name: "permanent_address_country",
	// 		label: "Country",
	// 		disabled: true,
	// 		value: "India",
	// 	},
	// 	{
	// 		name: "permanent_address_shop_ownership_type",
	// 		label: "Ownership Type",
	// 		parameter_type_id: ParamType.LIST,
	// 		list_elements: ownership_type_list,
	// 	},
	// ];

	return (
		<>
			<Headings title="Update Agent Address" />
			<Flex
				direction="column"
				borderRadius={{ base: "0", md: "10px 10px 0 0" }}
				w="100%"
				bg="white"
				p={{ base: "16px", md: "30px 30px 20px" }}
				gap="4"
				fontSize="sm"
				mt={{ base: "-10px", md: "0" }}
			>
				<Flex direction="column" gap="2">
					<Text
						fontSize="2xl"
						color="primary.DEFAULT"
						fontWeight="semibold"
					>
						{agentData?.agent_name}
					</Text>
				</Flex>
				<Divider display={{ base: "none", md: "block" }} />
			</Flex>

			<Box px={{ base: "20px", md: "0" }} mb="16">
				<Flex
					direction="column"
					w="100%"
					bg="white"
					borderRadius={{ base: "10px", md: "0 0 10px 10px" }}
					p={{ base: "20px", md: "0 30px 30px" }}
					marginTop={{ base: "20px", md: "0" }}
					gap="2"
				>
					<form onSubmit={handleSubmit(handleFormSubmit)}>
						<Flex direction="column" gap="8">
							<Form
								{...{
									register,
									control,
									formValues: watcher,
									parameter_list:
										current_address_parameter_list,
									errors,
									templateColumns: {
										base: "1fr",
										lg: "repeat(auto-fit,minmax(500px,1fr))",
									},
									columnGap: 2,
									width: {
										base: "100%",
										lg: "90%",
									},
								}}
							/>

							{/* <Flex align="center" gap="8">
								<Text fontSize="sm" fontWeight="semibold">
									Is your permanent address is same as above ?
								</Text>
								<Switch
									initialValue={true}
									onChange={setIsPermanentAddress}
								/>
							</Flex>

							{!isPermanentAddress && (
								<Form
									{...{
										list_elements: statesList,
										addressFormLabel: "Permanent Address",
										register,
										formState: {
											errors,
										},
										control,
										parameter_list:
											permanentAddressFormFields,
									}}
								/>
							)} */}

							<ActionButtonGroup {...{ buttonConfigList }} />
						</Flex>
					</form>
				</Flex>
			</Box>
		</>
	);
};

export default UpdateSellerAddress;
