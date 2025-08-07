import {
	Box,
	Divider,
	Flex,
	SimpleGrid,
	Text,
	useToast,
} from "@chakra-ui/react";
import { ActionButtonGroup, PageTitle } from "components";
import { Endpoints, ParamType, TransactionIds } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import useLocalStorage from "hooks/useLocalStorage";
import { formatDate } from "libs";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
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

const findObjectByValue = (arr, value) =>
	arr.find((obj) => obj.value === value);

/**
 * Validation patterns for form fields
 */
const VALIDATION_PATTERNS = {
	name: /^(?!(?:(?:([a-z]) *\1(?: *\1)*)|(?:.*?(?:(?:(?:^|[^d])([a-z])\2\2)|(?:d([a-df-z])\3\3)).*)|(?:.*?([a-z]{3,})\4\4).*|(?:.*(?:^|[^a-z])[^aeiou \.]{4,}(?:$|[^a-z]).*))$)(?:[a-z]+\.? ){0,2}[a-z]+$/i,
	shopName: /^[-a-zA-Z0-9 ,./:]*$/,
};

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
 * UpdatePersonalInformation page component for updating agent personal details
 * Includes comprehensive form validation for all input fields
 * @returns {JSX.Element} - The UpdatePersonalInfo component
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
	} = useForm({
		mode: "onChange",
	});

	const watcher = useWatch({
		control,
	});

	const fetchShopTypes = useCallback(() => {
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
	}, [accessToken, setShopTypes]);

	const fetchAgentDataViaCellNumber = useCallback(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents?record_count=1&search_value=${mobile}`,
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
	}, [accessToken]);

	useEffect(() => {
		// if shopTypes is not available, fetch it
		if (!shopTypes?.length) {
			fetchShopTypes();
		}

		// if agentData is not available, fetch it using the cell number
		if (!agentData) {
			fetchAgentDataViaCellNumber();
		}
	}, [agentData, shopTypes?.length]);

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
	}, [agentData, shopTypes, reset]);

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
									(item) => item.value === previewData[key]
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

	/**
	 * Parameter list for the Form component following tf-components pattern
	 */
	const parameter_list = [
		{
			name: "first_name",
			label: "First Name",
			parameter_type_id: ParamType.TEXT,
			required: true,
			validations: {
				pattern: VALIDATION_PATTERNS.name,
				minLength: 2,
				maxLength: 50,
			},
		},
		{
			name: "middle_name",
			label: "Middle Name",
			parameter_type_id: ParamType.TEXT,
			required: false,
			validations: {
				pattern: VALIDATION_PATTERNS.name,
				minLength: 2,
				maxLength: 50,
			},
		},
		{
			name: "last_name",
			label: "Last Name",
			parameter_type_id: ParamType.TEXT,
			required: true,
			validations: {
				pattern: VALIDATION_PATTERNS.name,
				minLength: 2,
				maxLength: 50,
			},
		},
		{
			name: "dob",
			label: "Date of birth",
			parameter_type_id: ParamType.FROM_DATE,
			required: true,
			maxDate: maxDate,
		},
		{
			name: "gender",
			label: "Gender",
			parameter_type_id: ParamType.LIST,
			required: true,
			list_elements: gender_list,
		},
		{
			name: "marital_status",
			label: "Marital Status",
			parameter_type_id: ParamType.LIST,
			required: false,
			list_elements: marital_status_list,
		},
		{
			name: "shop_name",
			label: "Shop Name",
			parameter_type_id: ParamType.TEXT,
			required: true,
			validations: {
				pattern: VALIDATION_PATTERNS.shopName,
				minLength: 2,
				maxLength: 100,
			},
		},
		{
			name: "shop_type",
			label: "Shop Type",
			parameter_type_id: ParamType.LIST,
			required: true,
			list_elements: shopTypes,
		},
	];

	const previewButtonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Preview",
			styles: {
				h: "64px",
				w: {
					base: "100%",
					md: "200px",
				},
			},
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: () => router.back(),
			styles: {
				color: "primary.DEFAULT",
				bg: {
					base: "white",
					md: "none",
				},
				h: {
					base: "64px",
					md: "64px",
				},
				w: {
					base: "100%",
					md: "auto",
				},
				_hover: {
					textDecoration: "none",
				},
			},
		},
	];

	const submitButtonConfigList = [
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
			<PageTitle title="Update Personal Information" />
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
				<Box px={{ base: "20px", md: "0" }} mb="32">
					<Flex
						direction="column"
						w="100%"
						bg="white"
						borderRadius={{ base: "10px", md: "0 0 10px 10px" }}
						p={{ base: "20px", md: "0 30px 30px" }}
						marginTop={{ base: "20px", md: "0" }}
					>
						{!inPreviewMode ? (
							<Flex direction="column" gap="8">
								<Form
									parameter_list={parameter_list}
									register={register}
									formValues={watcher}
									control={control}
									errors={errors}
								/>
								<ActionButtonGroup
									buttonConfigList={previewButtonConfigList}
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

								<ActionButtonGroup
									buttonConfigList={submitButtonConfigList}
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
