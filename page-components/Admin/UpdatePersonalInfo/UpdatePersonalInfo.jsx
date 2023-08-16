import {
	Divider,
	Flex,
	FormControl,
	FormLabel,
	SimpleGrid,
	Text,
} from "@chakra-ui/react";
import { Button, Calenders, Headings, Input, Radio, Select } from "components";
import { Endpoints, TransactionIds } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const nameSplitter = (name) => {
	let nameList = name.split(" ");
	let nameListLength = nameList.length;

	let firstName = nameList[0];
	let lastName = nameListLength > 1 ? nameList[nameListLength - 1] : "";
	let middleName = "";

	if (nameListLength === 3) {
		middleName = nameList[1];
	} else if (nameListLength > 3) {
		middleName = nameList.slice(1, nameListLength - 1).join(" ");
	}

	return {
		first_name: firstName,
		middle_name: middleName,
		last_name: lastName,
	};
};

const finalDataList = [
	{ key: "first_name", label: "First Name" },
	{ key: "middle_name", label: "Middle Name" },
	{ key: "last_name", label: "Last Name" },
	{ key: "dob", label: "Date of birth" },
	{ key: "gender", label: "Gender" },
	{ key: "marital_status", label: "Marital Status" },
	{ key: "shop_name", label: "Shop Name" },
	{ key: "shop_type", label: "Shop Type" },
];

/**
 * A UpdatePersonalInformation page-component
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<UpdatePersonalInfo></UpdatePersonalInfo>`
 */
const UpdatePersonalInfo = () => {
	const [agentData, setAgentData] = useState();
	const [shopTypesData, setShopTypesData] = useState();
	const [inPreviewMode, setInPreviewMode] = useState(false);
	const [previewDataList, setPreviewDataList] = useState();
	const [finalData, setFinalData] = useState();
	const { accessToken } = useSession();

	const {
		handleSubmit,
		register,
		formState: { errors /* isSubmitting */ },
		control,
		reset,
	} = useForm();

	useEffect(() => {
		fetchShopTypes();
		const storedData = JSON.parse(
			localStorage.getItem("network_seller_details")
		);
		if (storedData) {
			setAgentData(storedData);
		} else {
			fetchAgentDataViaCellNumber();
		}
	}, []);

	useEffect(() => {
		if (agentData !== undefined) {
			let defaultValues = {};
			const agentName = nameSplitter(agentData.agent_name);
			defaultValues.first_name = agentName?.first_name;
			defaultValues.middle_name = agentName?.middle_name;
			defaultValues.last_name = agentName?.last_name;
			defaultValues.dob = agentData?.personal_information?.date_of_birth;
			defaultValues.marital_status =
				agentData?.personal_information?.marital_status;
			defaultValues.shop_name = agentData?.profile?.shop_name;
			defaultValues.shop_type = agentData?.profile?.shop_type;
			defaultValues.gender = agentData?.personal_information?.gender;

			reset({ ...defaultValues });
		}
	}, [agentData]);

	const handleFormPreview = (previewData) => {
		let _previewData = [];
		setFinalData(previewData);
		setInPreviewMode(!inPreviewMode);
		finalDataList.map(({ key }, index) => {
			if (previewData[key]) {
				let _previewDataObj = finalDataList[index];
				_previewDataObj = {
					..._previewDataObj,
					["value"]:
						_previewDataObj.key !== "shop_type"
							? previewData[key]
							: shopTypesData?.find(
									(item) => item.value == previewData[key]
							  )?.label,
				};
				_previewData.push(_previewDataObj);
			}
		});
		setPreviewDataList(_previewData);
	};

	const fetchShopTypes = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionIds.SHOP_TYPE,
			},
			token: accessToken,
		})
			.then((res) => {
				if (res.status === 0) {
					setShopTypesData(res?.param_attributes.list_elements);
				}
			})
			.catch((err) => {
				console.error("err", err);
			});
	};

	const handleFormSubmit = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"Content-type": "application/json",
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agents/profile/personalInfo/update",
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

	const formNameInputList = [
		{
			id: "first_name",
			label: "First Name",
			required: true,
			defaultValue: agentData?.agent_name,
		},
		{ id: "middle_name", label: "Middle Name", required: false },
		{ id: "last_name", label: "Last Name", required: false },
	];

	const formGenderRadioList = [
		{ value: "Male", label: "Male" },
		{ value: "Female", label: "Female" },
		{ value: "Other", label: "Other" },
	];

	const formMaritalStatusSelectOptions = [
		{ value: "Single", label: "Single" },
		{ value: "Married", label: "Married" },
	];

	return (
		<>
			<Headings title="Update Personal Information" />
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
						color="primary.DEFAULT"
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
			<form onSubmit={handleSubmit(handleFormPreview)}>
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
						<Flex w="100%" justify="space-between" align="baseline">
							<Text fontSize="lg" fontWeight="medium">
								Merchant Information
							</Text>
							<Text fontSize="sm" color="error">
								* Mandatory
							</Text>
						</Flex>

						{!inPreviewMode ? (
							<Flex direction="column" gap="8">
								{/* TODO DRAG & DROP */}

								{/* Name */}
								<Flex wrap="wrap" gap="8">
									{formNameInputList.map(
										({
											id,
											label,
											required,
											value,
											defaultValue,
										}) => (
											<FormControl
												key={id}
												w={{
													base: "100%",
													md: "315px",
												}}
											>
												<Input
													id={id}
													label={label}
													required={required}
													value={value}
													defaultValue={defaultValue}
													fontSize="sm"
													{...register(id)}
												/>
											</FormControl>
										)
									)}
								</Flex>
								{/* DOB */}
								<FormControl w={{ base: "100%", md: "500px" }}>
									<Controller
										name="dob"
										control={control}
										render={({
											field: { onChange, value },
										}) => (
											<Calenders
												label="Date of birth"
												onChange={onChange}
												value={value}
												required
											/>
										)}
									/>
								</FormControl>

								{/* Gender */}
								<FormControl>
									<FormLabel>Gender</FormLabel>
									<Controller
										name="gender"
										control={control}
										render={({
											field: { onChange, value },
										}) => (
											<Radio
												options={formGenderRadioList}
												value={value}
												onChange={onChange}
											/>
										)}
									/>
								</FormControl>

								{/* Marital Status */}
								<FormControl
									id="select"
									w={{ base: "100%", md: "500px" }}
									isInvalid={errors.priority}
								>
									<FormLabel>Marital Status</FormLabel>
									<Controller
										name="marital_status"
										control={control}
										render={({
											field: { onChange, value },
										}) => {
											return (
												<Select
													options={
														formMaritalStatusSelectOptions
													}
													value={value}
													onChange={onChange}
												/>
											);
										}}
									/>
								</FormControl>

								<Flex wrap="wrap" gap="8">
									<FormControl
										w={{ base: "100%", md: "315px" }}
									>
										<Input
											id="shop_name"
											label="Shop Name"
											fontSize="sm"
											required
											{...register("shop_name")}
										/>
									</FormControl>
									<FormControl
										id="shop_type"
										w={{ base: "100%", md: "315px" }}
										isInvalid={errors.priority}
									>
										<FormLabel>Shop Type</FormLabel>
										<Controller
											name="shop_type"
											control={control}
											render={({
												field: { onChange, value },
											}) => {
												return (
													<Select
														value={value}
														options={shopTypesData}
														onChange={onChange}
													/>
												);
											}}
										/>
									</FormControl>
								</Flex>

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
										Preview
									</Button>
									<Button
										h="64px"
										variant="link"
										color="primary.DEFAULT"
										fontWeight="bold"
										_hover={{ textDecoration: "none" }}
									>
										Cancel
									</Button>
								</Flex>
							</Flex>
						) : (
							<Flex direction="column" gap="8">
								<SimpleGrid
									gap="8"
									columns={{ base: "1", md: "2" }}
									w={{ base: "100%", lg: "60%" }}
								>
									{previewDataList?.map(
										({ key, label, value }) => (
											<Flex direction="column" key={key}>
												<Text
													color="light"
													fontSize="sm"
												>
													{label}
												</Text>
												<Text
													color="dark"
													fontSize="md"
													fontWeight="semibold"
												>
													{value}
												</Text>
											</Flex>
										)
									)}
								</SimpleGrid>

								<Flex
									direction={{ base: "column", md: "row" }}
									gap={{ base: "4", md: "16" }}
								>
									<Button
										h="64px"
										fontWeight="bold"
										w={{ base: "100%", md: "140px" }}
										onClick={handleFormSubmit}
									>
										Submit
									</Button>
									<Button
										h="64px"
										variant="link"
										color="primary.DEFAULT"
										fontWeight="bold"
										_hover={{ textDecoration: "none" }}
										onClick={() =>
											setInPreviewMode(!inPreviewMode)
										}
									>
										Cancel
									</Button>
								</Flex>
							</Flex>
						)}
					</Flex>
				</Flex>
			</form>
		</>
	);
};

export default UpdatePersonalInfo;
