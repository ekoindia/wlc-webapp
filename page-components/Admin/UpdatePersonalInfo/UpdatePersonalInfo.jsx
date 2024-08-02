import {
	Box,
	Divider,
	Flex,
	FormControl,
	SimpleGrid,
	Text,
	useToast,
} from "@chakra-ui/react";
import {
	ActionButtonGroup,
	Calenders,
	Headings,
	Input,
	Radio,
	Select,
} from "components";
import { Endpoints, TransactionIds } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import useLocalStorage from "hooks/useLocalStorage";
import { formatDate } from "libs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

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

const findObjectByValue = (arr, value) => arr.find((obj) => obj.value == value);

const gender_list = [
	{ value: "Male", label: "Male" },
	{ value: "Female", label: "Female" },
	{ value: "Other", label: "Other" },
];

const marital_status_list = [
	{ value: "Single", label: "Single" },
	{ value: "Married", label: "Married" },
];

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

let currentDate = new Date();

// Subtract 13 years from today's date
let thirteenYearsAgo = new Date();
thirteenYearsAgo.setFullYear(currentDate.getFullYear() - 13);

/**
 * A UpdatePersonalInformation page-component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<UpdatePersonalInfo></UpdatePersonalInfo>`
 */
const UpdatePersonalInfo = () => {
	const [agentData, setAgentData] = useLocalStorage(
		"oth_last_selected_agent"
	);
	const [shopTypes, setShopTypes] = useLocalStorage("oth-shop-types");
	const [inPreviewMode, setInPreviewMode] = useState(false);
	const [previewDataList, setPreviewDataList] = useState();
	const [finalData, setFinalData] = useState();
	const [maxDate] = useState(formatDate(thirteenYearsAgo, "yyyy-MM-dd"));
	const { accessToken } = useSession();
	const toast = useToast();
	const router = useRouter();

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		control,
		reset,
	} = useForm();

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

		if (!agentData) {
			fetchAgentDataViaCellNumber();
		}
	}, []);

	useEffect(() => {
		if (agentData !== undefined) {
			let defaultValues = {};
			const agentName = nameSplitter(agentData.agent_name);

			const marital_status = findObjectByValue(
				marital_status_list,
				agentData?.personal_information?.marital_status
			);

			const shop_type_value =
				agentData?.personal_information?.shop_type ??
				agentData?.profile?.shop_type;

			const shop_type =
				shopTypes?.length > 0 &&
				findObjectByValue(shopTypes, shop_type_value);

			const dob =
				agentData?.personal_information?.dob ??
				agentData?.personal_information?.date_of_birth;

			defaultValues.first_name = agentName?.first_name;
			defaultValues.middle_name = agentName?.middle_name;
			defaultValues.last_name = agentName?.last_name;
			defaultValues.dob = dob;
			defaultValues.marital_status = marital_status;
			defaultValues.shop_name =
				agentData?.personal_information?.shop_name ??
				agentData?.profile?.shop_name;
			defaultValues.shop_type = shop_type;
			defaultValues.gender = agentData?.personal_information?.gender;

			reset({ ...defaultValues });
		}
	}, [agentData, shopTypes]);

	const handleFormPreview = (previewData) => {
		console.log("previewData", previewData);
		const keysToFlatten = ["shop_type", "marital_status"];
		Object.entries(previewData).map(([key, value]) => {
			if (keysToFlatten.includes(key)) {
				previewData[key] = value?.value;
			}
		});

		let _previewData = [];
		setFinalData({ ...previewData, merchant_code: agentData?.eko_code });
		setInPreviewMode(!inPreviewMode);
		finalDataList.map(({ key }, index) => {
			if (previewData[key]) {
				let _previewDataObj = finalDataList[index];
				_previewDataObj = {
					..._previewDataObj,
					["value"]:
						_previewDataObj.key !== "shop_type"
							? previewData[key]
							: shopTypes?.find(
									(item) => item.value == previewData[key]
								)?.label,
				};
				_previewData.push(_previewDataObj);
			}
		});
		setPreviewDataList(_previewData);
	};

	const handleFormSubmit = () => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION_JSON,
			{
				headers: {
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": "/network/agents/profile/personalInfo/update",
					"tf-req-method": "POST",
				},
				body: finalData,
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

				let storedData = JSON.parse(
					localStorage.getItem("oth_last_selected_agent")
				);

				let personal_info = {
					...storedData.personal_information,
				};

				Object.entries(finalData).map(([key, value]) => {
					personal_info[key] = value;
				});

				storedData.personal_information = personal_info;

				localStorage.setItem(
					"oth_last_selected_agent",
					JSON.stringify({ ...storedData })
				);

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
			validation: { required: "⚠ Required" },
		},
		{ id: "middle_name", label: "Middle Name", required: false },
		{
			id: "last_name",
			label: "Last Name",
			required: true,
			validation: { required: "⚠ Required" },
		},
	];

	const PreviewButtonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Preview",
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

	const SubmitButtonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Save",
			onClick: () => handleFormSubmit(),
			loading: isSubmitting,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: () => setInPreviewMode(!inPreviewMode),
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
			<form onSubmit={handleSubmit(handleFormPreview)}>
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
						<Flex w="100%" justify="space-between" align="baseline">
							<Text fontSize="lg" fontWeight="medium">
								Retailer Information
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
											validation,
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
													{...register(id, {
														...validation,
													})}
												/>
												{errors[id] && (
													<Text
														fontSize="xs"
														fontWeight="medium"
														color={
															errors[id]
																? "error"
																: "primary.dark"
														}
													>
														{errors[id].message}
													</Text>
												)}
											</FormControl>
										)
									)}
								</Flex>
								{/* DOB */}
								<FormControl w={{ base: "100%", md: "500px" }}>
									<Controller
										name="dob"
										control={control}
										rules={{ required: "⚠ Required" }}
										render={({
											field: { onChange, value },
										}) => (
											<>
												<Calenders
													label="Date of birth"
													onChange={onChange}
													value={value}
													maxDate={maxDate}
													required
												/>
												{errors.dob && (
													<Text
														fontSize="xs"
														fontWeight="medium"
														color={
															errors.dob
																? "error"
																: "primary.dark"
														}
													>
														{errors.dob.message}
													</Text>
												)}
											</>
										)}
									/>
								</FormControl>

								{/* Gender */}
								<FormControl>
									<Controller
										name="gender"
										control={control}
										rules={{ required: "⚠ Required" }}
										render={({
											field: { onChange, value },
										}) => (
											<>
												<Radio
													label="Gender"
													options={gender_list}
													value={value}
													onChange={onChange}
													required
												/>

												{errors.gender && (
													<Text
														fontSize="xs"
														fontWeight="medium"
														color={
															errors.gender
																? "error"
																: "primary.dark"
														}
													>
														{errors.gender.message}
													</Text>
												)}
											</>
										)}
									/>
								</FormControl>

								{/* Marital Status */}
								<FormControl
									id="select"
									w={{ base: "100%", md: "500px" }}
								>
									<Controller
										name="marital_status"
										control={control}
										render={({
											field: { onChange, value },
										}) => {
											return (
												<Select
													label="Marital Status"
													options={
														marital_status_list
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
											{...register("shop_name", {
												required: "⚠ Required",
											})}
										/>
										{errors.shop_name && (
											<Text
												fontSize="xs"
												fontWeight="medium"
												color={
													errors.shop_name
														? "error"
														: "primary.dark"
												}
											>
												{errors.shop_name.message}
											</Text>
										)}
									</FormControl>
									<FormControl
										id="shop_type"
										w={{ base: "100%", md: "315px" }}
									>
										<Controller
											name="shop_type"
											control={control}
											rules={{ required: "⚠ Required" }}
											render={({
												field: { onChange, value },
											}) => {
												return (
													<Select
														label="Shop Type"
														value={value}
														options={shopTypes}
														onChange={onChange}
														required
													/>
												);
											}}
										/>
										{errors.shop_type && (
											<Text
												fontSize="xs"
												fontWeight="medium"
												color={
													errors.shop_type
														? "error"
														: "primary.dark"
												}
											>
												{errors.shop_type.message}
											</Text>
										)}
									</FormControl>
								</Flex>
								{/* <Flex
									direction={{
										base: "row-reverse",
										md: "row",
									}}
									w={{ base: "100%", md: "500px" }}
									position={{ base: "fixed", md: "initial" }}
									gap={{ base: "0", md: "16" }}
									align="center"
									bottom="0"
									left="0"
								>
									<Button
										type="submit"
										size="lg"
										h="64px"
										w={{ base: "100%", md: "200px" }}
										fontWeight="bold"
										borderRadius={{
											base: "none",
											md: "10",
										}}
									>
										Preview
									</Button>

									<Button
										h={{ base: "64px", md: "auto" }}
										w={{ base: "100%", md: "initial" }}
										bg={{ base: "white", md: "none" }}
										variant="link"
										fontWeight="bold"
										color="primary.DEFAULT"
										_hover={{ textDecoration: "none" }}
										borderRadius={{
											base: "none",
											md: "10",
										}}
										onClick={() => router.back()}
									>
										Cancel
									</Button>
								</Flex> */}

								<ActionButtonGroup
									buttonConfigList={PreviewButtonConfigList}
								/>
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

								{/* <Flex
									direction={{
										base: "row-reverse",
										md: "row",
									}}
									w={{ base: "100%", md: "500px" }}
									position={{ base: "fixed", md: "initial" }}
									gap={{ base: "0", md: "16" }}
									align="center"
									bottom="0"
									left="0"
								>
									<Button
										type="submit"
										size="lg"
										h="64px"
										w={{ base: "100%", md: "200px" }}
										fontWeight="bold"
										borderRadius={{
											base: "none",
											md: "10",
										}}
										onClick={handleFormSubmit}
										loading={isSubmitting}
									>
										Save
									</Button>

									<Button
										h={{ base: "64px", md: "auto" }}
										w={{ base: "100%", md: "initial" }}
										bg={{ base: "white", md: "none" }}
										variant="link"
										fontWeight="bold"
										color="primary.DEFAULT"
										_hover={{ textDecoration: "none" }}
										borderRadius={{
											base: "none",
											md: "10",
										}}
										onClick={() =>
											setInPreviewMode(!inPreviewMode)
										}
									>
										Cancel
									</Button>
								</Flex> */}

								<ActionButtonGroup
									buttonConfigList={SubmitButtonConfigList}
								/>
							</Flex>
						)}
					</Flex>
				</Box>
			</form>
		</>
	);
};

export default UpdatePersonalInfo;
