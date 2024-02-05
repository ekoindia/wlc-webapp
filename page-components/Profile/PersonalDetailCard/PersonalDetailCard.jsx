import {
	Flex,
	Grid,
	GridItem,
	Text,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { Button, Modal } from "components";
import { Endpoints, ParamType, TransactionIds } from "constants";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { formatDate } from "libs/dateFormat";
import { WidgetBase } from "page-components/Home";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

const gender_list = [
	{ value: "Male", label: "Male" },
	{ value: "Female", label: "Female" },
	{ value: "Other", label: "Other" },
];

const marital_status_list = [
	{ value: "Single", label: "Single" },
	{ value: "Married", label: "Married" },
];

const qualification_list = [
	{ value: "Below 10th", label: "Below 10th" },
	{ value: "10th", label: "10th" },
	{ value: "12th", label: "12th" },
	{ value: "Graduate", label: "Graduate" },
	{ value: "Post-Graduate", label: "Post-Graduate" },
	{ value: "Above Post-Graduate", label: "Above Post-Graduate" },
];

const findObjectByValue = (arr, value) => arr.find((obj) => obj.value == value);

/**
 * A PersonalDetailCard page-component
 */
const PersonalDetailCard = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { userData, refreshUser } = useUser();
	const [personalDetails, setPersonalDetails] = useState({});
	const [today] = useState(() => {
		const _today = new Date();
		return formatDate(_today, "yyyy-MM-dd");
	});
	const toast = useToast();
	const { generateNewToken } = useRefreshToken();

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isValid, isDirty, isSubmitting },
		reset,
	} = useForm({
		mode: "onChange",
	});

	const watcher = useWatch({
		control,
	});

	const keyToUiKeyMap = {
		gender: "gender_ui",
		marital_status: "marital_status_ui",
		qualification: "qualification_ui",
	};

	const personal_detail_parameter_list = [
		{
			key: "gender_ui", //using this key to show data on UI
			name: "gender",
			label: "Gender",
			parameter_type_id: ParamType.LIST,
			list_elements: gender_list,
			meta: {
				force_dropdown: true,
			},
		},
		{
			key: "dob",
			name: "dob",
			label: "Date of Birth",
			parameter_type_id: ParamType.FROM_DATE,
			maxDate: today,
		},
		{
			key: "qualification_ui",
			name: "qualification",
			label: "Qualification",
			parameter_type_id: ParamType.LIST,
			list_elements: qualification_list,
			required: false,
		},
		{
			key: "marital_status_ui",
			name: "marital_status",
			label: "Marital Status",
			parameter_type_id: ParamType.LIST,
			list_elements: marital_status_list,
			meta: {
				force_dropdown: true,
			},
			required: false,
		},
	];

	useEffect(() => {
		const data = userData.personalDetails;

		const _gender = data?.gender
			? findObjectByValue(gender_list, data.gender)
			: null;
		const _marital_status = data?.marital_status
			? findObjectByValue(marital_status_list, data.marital_status)
			: null;
		const _qualification = data?.qualification
			? findObjectByValue(qualification_list, data.qualification)
			: null;

		let _personalDetails = {
			dob: data?.dob ?? null,
			gender: _gender,
			gender_ui: data?.gender ?? null,
			marital_status: _marital_status,
			marital_status_ui: data?.marital_status ?? null,
			qualification: _qualification,
			qualification_ui: data?.qualification ?? null,
		};

		setPersonalDetails({ ..._personalDetails });

		reset({ ..._personalDetails });
	}, [userData?.personalDetails]);

	const handleFormSubmit = (data) => {
		const _finalData = { ...data };

		Object.keys(keyToUiKeyMap).forEach((key) => {
			_finalData[key] = _finalData[key]?.value;
			delete _finalData[keyToUiKeyMap[key]];
		});

		_finalData["dob"] = parseInt(formatDate(_finalData["dob"], "ddMMyyyy"));

		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
				body: {
					interaction_type_id: TransactionIds.USER_PROFILE,
					user_id: userData.userId,
					section: "personal_detail",
					..._finalData,
				},
				timeout: 30000,
			},
			generateNewToken
		)
			.then((res) => {
				refreshUser();
				toast({
					title: res.message,
					status: "success",
					duration: 6000,
				});
				onClose();
			})
			.catch((error) => {
				toast({
					title: data.message,
					status: "error",
					duration: 6000,
				});
				console.error("📡Error:", error);
			});
	};

	return (
		<WidgetBase
			title="Personal Details"
			iconName="mode-edit"
			linkOnClick={() => onOpen()}
		>
			<Grid
				templateColumns="repeat(2, 1fr)"
				rowGap="20px"
				fontSize={{ base: "14px" }}
			>
				{personal_detail_parameter_list.map(({ key, label }) => (
					<GridItem key={key} colSpan={1} rowSpan={1}>
						<Flex direction="column">
							<Text>{label}</Text>
							<Text fontWeight="semibold">
								{personalDetails[key]}
							</Text>
						</Flex>
					</GridItem>
				))}
			</Grid>

			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Edit Personal Details"
			>
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<Flex direction="column" gap="8" pb="4">
						<Form
							{...{
								parameter_list: personal_detail_parameter_list,
								formValues: watcher,
								control,
								register,
								errors,
							}}
						/>
						<Button
							type="submit"
							size="lg"
							width="100%"
							fontSize="lg"
							loading={isSubmitting}
							disabled={!isValid || !isDirty}
						>
							Save
						</Button>
					</Flex>
				</form>
			</Modal>
		</WidgetBase>
	);
};

export default PersonalDetailCard;
