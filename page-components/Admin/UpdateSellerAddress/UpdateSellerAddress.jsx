import { Divider, Flex, FormControl, FormLabel, Text } from "@chakra-ui/react";
import {
	Button,
	Headings,
	Input,
	InputLabel,
	Select,
	Switch,
} from "components";
import { Endpoints, ParamType, TransactionIds } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const ownershipList = [
	{ label: "Owned", value: "Owned" },
	{ label: "Rented", value: "Rented" },
];

/**
 * A UpdateSellerAddress page-component
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<UpdateSellerAddress></UpdateSellerAddress>`
 */
const UpdateSellerAddress = () => {
	const [agentData, setAgentData] = useState();
	const [statesList, setStatesList] = useState();
	const [isPermanentAddress, setIsPermanentAddress] = useState(true);
	const { accessToken } = useSession();

	const {
		handleSubmit,
		register,
		formState: { errors /* isSubmitting */ },
		control,
		reset,
	} = useForm();

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
				// "tf-req-uri": `/network/agents?record_count=1&search_value=${cellnumber}`,
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
			localStorage.getItem("network_seller_details")
		);
		if (storedData !== undefined) {
			setAgentData(storedData);
		} else {
			fetchAgentDataViaCellNumber();
		}
	}, []);

	useEffect(() => {
		let defaultValues = {};
		defaultValues.address_line1 = agentData?.line_1;
		defaultValues.address_line2 = agentData?.line_2;
		defaultValues.pincode = agentData?.zip;
		defaultValues.city = agentData?.city;
		defaultValues.country_state =
			agentData?.state == "Delhi"
				? "National Capital Territory of Delhi (UT)"
				: agentData?.state;
		defaultValues.shop_ownership_type =
			agentData?.address_details?.ownership_type;

		reset({ ...defaultValues });
	}, [agentData]);

	const handleFormSubmit = (submittedData) => {
		const finalData = Object.entries(submittedData).reduce(
			(acc, [key, value]) => {
				if (value !== undefined && value !== "") {
					acc[key] = value;
				}
				return acc;
			},
			{}
		);

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"Content-type": "application/json",
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agents/profile/address/update",
				"tf-req-method": "PUT",
			},
			body: finalData,
			token: accessToken,
		})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const currentAddressFormFields = [
		{
			id: "address_line1",
			label: "Address Line 1",
			required: true,
			parameter_type_id: ParamType.TEXT,
		},
		{
			id: "address_line2",
			label: "Address Line 2",
			required: false,
			parameter_type_id: ParamType.TEXT,
		},
		{
			id: "pincode",
			label: "Postel Code",
			required: true,
			parameter_type_id: ParamType.NUMERIC,
		},
		{
			id: "city",
			label: "City",
			required: true,
			parameter_type_id: ParamType.TEXT,
		},
		{
			id: "country_state",
			label: "State",
			required: true,
			parameter_type_id: ParamType.LIST,
			list_elements: statesList,
		},
		{
			id: "country",
			label: "Country",
			required: true,
			parameter_type_id: ParamType.TEXT,
			disabled: true,
			value: "India",
		},
		{
			id: "shop_ownership_type",
			label: "Ownership Type",
			required: true,
			parameter_type_id: ParamType.LIST,
			list_elements: ownershipList,
		},
	];

	const permanentAddressFormFields = [
		{
			id: "permanent_address_line1",
			label: "Address Line 1",
			required: true,
			parameter_type_id: ParamType.TEXT,
		},
		{
			id: "permanent_address_line2",
			label: "Address Line 2",
			required: false,
			parameter_type_id: ParamType.TEXT,
		},
		{
			id: "permanent_address_pincode",
			label: "Postel Code",
			required: true,
			parameter_type_id: ParamType.NUMERIC,
		},
		{
			id: "permanent_address_city",
			label: "City",
			required: true,
			parameter_type_id: ParamType.TEXT,
		},
		{
			id: "permanent_address_state",
			label: "State",
			required: true,
			parameter_type_id: ParamType.LIST,
			list_elements: statesList,
		},
		{
			id: "permanent_address_country",
			label: "Country",
			required: true,
			parameter_type_id: ParamType.TEXT,
			disabled: true,
			value: "India",
		},
		{
			id: "permanent_address_shop_ownership_type",
			label: "Ownership Type",
			required: true,
			parameter_type_id: ParamType.LIST,
			list_elements: ownershipList,
		},
	];

	// if (agentData == undefined) {
	// 	return <div>Loading...</div>;
	// }

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
			>
				<Flex direction="column" gap="2">
					<Text
						fontSize="2xl"
						color="accent.DEFAULT"
						fontWeight="semibold"
					>
						{agentData?.agent_name}
					</Text>
					<span>
						Edit the fields below and click Preview. Click Cancel to
						return to Client HomePage without submitting
						information.
					</span>
				</Flex>
				<Divider display={{ base: "none", md: "block" }} />
			</Flex>

			<Flex direction="column" px={{ base: "20px", md: "0" }}>
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
									statesList,
									register,
									formState: { errors /* isSubmitting */ },
									control,
									renderer: currentAddressFormFields,
								}}
							/>

							<Flex align="center" gap="8">
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
										statesList,
										addressFormLabel: "Permanent Address",
										register,
										formState: {
											errors /* isSubmitting */,
										},
										control,
										renderer: permanentAddressFormFields,
									}}
								/>
							)}

							<Flex
								direction={{ base: "column", md: "row" }}
								gap={{ base: "4", md: "16" }}
							>
								<Button
									h="64px"
									fontWeight="bold"
									w={{ base: "100%", md: "140px" }}
									type="submit"
								>
									Save Changes
								</Button>
								<Button
									h="64px"
									variant="link"
									color="accent.DEFAULT"
									fontWeight="bold"
									_hover={{ textDecoration: "none" }}
								>
									Cancel
								</Button>
							</Flex>
						</Flex>
					</form>
				</Flex>
			</Flex>
		</>
	);
};

export default UpdateSellerAddress;

const Form = ({
	addressFormLabel = "Current Address",
	renderer,
	register,
	formState: { errors /* isSubmitting */ },
	control,
}) => {
	return (
		<Flex direction="column" gap="4">
			<InputLabel fontSize="lg" fontWeight="medium" mb="0" required>
				{addressFormLabel}
			</InputLabel>
			<Flex direction="column" gap="8">
				<Flex gap="8" wrap="wrap" maxW="1200px">
					{renderer?.map(
						({
							id,
							label,
							required,
							value,
							disabled,
							list_elements,
							parameter_type_id,
						}) => {
							switch (parameter_type_id) {
								case ParamType.LIST:
									return (
										<FormControl
											id={id}
											w={{ base: "100%", md: "500px" }}
											isInvalid={errors.priority}
										>
											<FormLabel>{label}</FormLabel>
											<Controller
												name={id}
												control={control}
												render={({
													field: { onChange, value },
												}) => {
													return (
														<Select
															value={value}
															options={
																list_elements
															}
															onChange={onChange}
														/>
													);
												}}
											/>
										</FormControl>
									);
								case ParamType.NUMERIC:
								case ParamType.TEXT:
									return (
										<FormControl
											key={id}
											w={{
												base: "100%",
												md: "500px",
											}}
										>
											<Input
												id={id}
												label={label}
												required={required}
												value={value}
												type={
													parameter_type_id ===
													ParamType.NUMERIC
														? "number"
														: "text"
												}
												fontSize="sm"
												disabled={disabled}
												{...register(id)}
											/>
										</FormControl>
									);
							}
						}
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};
