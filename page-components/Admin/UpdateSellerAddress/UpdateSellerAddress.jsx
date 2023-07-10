import { Divider, Flex, FormControl, FormLabel, Text } from "@chakra-ui/react";
import {
	Button,
	Headings,
	Input,
	InputLabel,
	Select,
	Switch,
} from "components";
import { Endpoints } from "constants";
import { TransactionIds } from "constants/EpsTransactions";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

/**
 * A UpdateSellerAddress page-component
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<UpdateSellerAddress></UpdateSellerAddress>`
 */
const UpdateSellerAddress = () => {
	const [agentData, setAgentData] = useState();
	// const [finalData, setFinalData] = useState();
	const [statesList, setStatesList] = useState();
	const [isPermanentAddress, setIsPermanentAddress] = useState(true);
	const { accessToken } = useSession();

	const {
		handleSubmit,
		register,
		formState: { errors /* isSubmitting */ },
		control,
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
		if (storedData) {
			setAgentData(storedData);
		} else {
			fetchAgentDataViaCellNumber();
		}
	}, []);

	const handleFormSubmit = (data) => {
		console.log("data", data);
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"Content-type": "application/json",
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agents/profile/address/update",
				"tf-req-method": "PUT",
			},
			body: data,
			token: accessToken,
		})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<>
			<Headings title="Update Seller Address" />
			<Flex
				direction="column"
				borderRadius={{ base: "0", md: "10px 10px 0 0" }}
				w="100%"
				bg="white"
				p={{ base: "30px", md: "30px 30px 20px" }}
				gap="4"
				fontSize="sm"
			>
				<div>
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
				</div>
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
							<AddressForm
								{...{
									statesList,
									register,
									formState: { errors /* isSubmitting */ },
									control,
								}}
							/>

							<Flex align="center" gap="8">
								<Text fontWeight="semibold">
									Is your permanent address is same as above ?
								</Text>
								<Switch
									initialValue={true}
									onChange={setIsPermanentAddress}
								/>
							</Flex>

							{!isPermanentAddress && (
								<AddressForm
									{...{
										statesList,
										addressFormLabel: "Permanent Address",
										register,
										formState: {
											errors /* isSubmitting */,
										},
										control,
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

const AddressForm = ({
	statesList,
	addressFormLabel = "Current Address",
	register,
	formState: { errors /* isSubmitting */ },
	control,
}) => {
	const formAddressInputList = [
		{ id: "address_line1", label: "Address Line 1", required: true },
		{ id: "address_line2", label: "Address Line 2", required: false },
		// { id: "address_line3", label: "Address Line 3", required: false },
		{ id: "pincode", label: "Postel Code", required: true },
		{ id: "city", label: "City", required: true },
	];
	return (
		<>
			<Flex w="100%" justify="space-between" align="baseline">
				<InputLabel fontSize="lg" fontWeight="medium" mb="0" required>
					{addressFormLabel}
				</InputLabel>
				{/* <Text fontSize="lg" fontWeight="medium">
					Current Address
				</Text> */}
				{/* <Text fontSize="sm" color="error">
					* Mandatory
				</Text> */}
			</Flex>
			<Flex direction="column" gap="8">
				<Flex gap="8" wrap="wrap" maxW="1200px">
					{formAddressInputList.map(
						({ id, label, required, value, disabled }) => (
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
									disabled={disabled}
									{...register(id)}
								/>
							</FormControl>
						)
					)}
				</Flex>
				<FormControl
					id="country_state"
					w={{ base: "100%", md: "500px" }}
					isInvalid={errors.priority}
				>
					<FormLabel>State</FormLabel>
					<Controller
						name="country_state"
						control={control}
						render={({ field: { onChange, value } }) => {
							return (
								<Select
									value={value}
									options={statesList}
									onChange={onChange}
								/>
							);
						}}
					/>
				</FormControl>
				<FormControl
					id="shop_ownership_type"
					w={{ base: "100%", md: "500px" }}
					isInvalid={errors.priority}
				>
					<FormLabel>Ownership Type</FormLabel>
					<Controller
						name="shop_ownership_type"
						control={control}
						render={({ field: { onChange, value } }) => {
							return (
								<Select
									value={value}
									options={statesList}
									onChange={onChange}
								/>
							);
						}}
					/>
				</FormControl>
			</Flex>
		</>
	);
};
