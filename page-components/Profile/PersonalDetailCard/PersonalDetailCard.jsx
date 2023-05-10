import {
	Flex,
	Grid,
	GridItem,
	Select,
	Text,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { Calenders, IconButtons, Modal } from "components";
import { Endpoints, TransactionIds } from "constants";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { useCallback, useState } from "react";

/**
 * A <PersonalDetailCard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<PersonalDetailCard></PersonalDetailCard>` TODO: Fix example
 */
const PersonalDetailCard = () => {
	const { userData, updatePersonalDetail } = useUser();
	const [disabled, setDisabled] = useState(false);
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const data = userData.personalDetails;
	const genderoOptions = ["Male", "Female", "Other"];
	const qualificationOptions = [
		"Below 10th",
		"10th",
		"12th",
		"Graduate",
		"Post-Graduate",
		"Above Post-Graduate",
	];
	const martialStatusOptions = ["Single", "Married"];

	const personalDetailObj = {
		gender: data ? data.gender : "Gender",
		dob: data ? data.dob : "Date of Birth",
		qualification: data ? data.qualification : "Qualification",
		marital_status: data ? data.marital_status : "Marital Status",
	};
	const [formState, setFormState] = useState(personalDetailObj);
	const { generateNewToken } = useRefreshToken();
	const labelStyle = {
		fontSize: { base: "md" },
		color: "inputlabel",
		pl: "0",
		fontWeight: "600",
	};
	const inputConstStyle = {
		h: { base: "3rem" },
		w: "100%",
		pos: "relative",
		alignItems: "center",
		mb: { base: 2, "2xl": "1rem" },
	};
	const onEditClick = () => {
		onOpen();
	};
	const hitQuery = useCallback(() => {
		setDisabled(true);
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
				body: {
					interaction_type_id: TransactionIds.USER_PROFILE,
					user_id: userData.userId,
					section: "personal_detail",
					...formState,
				},
				timeout: 30000,
			},
			generateNewToken
		)
			.then((data) => {
				setDisabled(false);
				updatePersonalDetail(formState);
				toast({
					title: data.message,
					status: "success",
					duration: 2000,
				});
				onClose();
			})
			.catch((err) => {
				setDisabled(false);
				toast({
					title: data.message,
					status: "error",
					duration: 2000,
				});
				console.error("error: ", err);
			});
	}, [formState, userData?.access_token, userData?.userId]);

	const onSubmit = () => {
		hitQuery();
	};

	const handleChange = (e) => {
		setFormState({ ...formState, [e.target.name]: e.target.value });
	};

	return (
		<Flex
			w="100%"
			h={{ base: "400px" }}
			bg="white"
			direction="column"
			borderRadius="10px"
			border="1px solid #D2D2D2"
			boxShadow="0px 5px 15px #0000000D"
			p="5"
		>
			<Flex justify="space-between">
				<Text fontWeight="semibold" fontSize={{ base: "18px" }}>
					Personal Details
				</Text>
				<IconButtons
					onClick={onEditClick}
					iconName="mode-edit"
					iconStyle={{ height: "12px", width: "12px" }}
				/>
			</Flex>
			<Grid templateColumns="repeat(2, 1fr)" mt="20px" rowGap="20px">
				{Object.entries(personalDetailObj).map(([key], index) =>
					data[key] != "" ? (
						<GridItem key={index} colSpan={1} rowSpan={1}>
							<Flex key={index} direction="column">
								<Text>
									{key
										.replace(/_/g, " ")
										.replace(/\b\w/g, (c) =>
											c.toUpperCase()
										)}
								</Text>
								<Text fontWeight="semibold">{data[key]}</Text>
							</Flex>
						</GridItem>
					) : null
				)}
			</Grid>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Edit Personal Details"
				submitText="Save now"
				onSubmit={onSubmit}
				disabled={disabled}
			>
				<form>
					<Text fontSize={{ base: "md", md: "md" }} fontWeight="bold">
						Gender
					</Text>
					<Select
						name="gender"
						value={formState.gender}
						onChange={handleChange}
						labelStyle={labelStyle}
						inputContStyle={inputConstStyle}
						mb={{ base: 2, "2xl": "1rem" }}
						h="3rem"
					>
						{genderoOptions.map((data, idx) => {
							return (
								<option key={`${data}_${idx}`}>{data}</option>
							);
						})}
					</Select>
					<Calenders
						label="DOB"
						labelStyle={labelStyle}
						value={formState.dob}
						onChange={handleChange}
						name="dob"
						mb={{ base: 2, "2xl": "1rem" }}
					/>
					<Text fontSize={{ base: "md", md: "md" }} fontWeight="bold">
						Qualification
					</Text>
					<Select
						name="qualification"
						value={formState.qualification}
						onChange={handleChange}
						labelStyle={labelStyle}
						inputContStyle={inputConstStyle}
						mb={{ base: 2, "2xl": "1rem" }}
						h="3rem"
					>
						{qualificationOptions.map((data, idx) => {
							return (
								<option key={`${data}_${idx}`}>{data}</option>
							);
						})}
					</Select>
					<Text fontSize={{ base: "md", md: "md" }} fontWeight="bold">
						Martial Status
					</Text>
					<Select
						name="marital_status"
						value={formState.marital_status}
						onChange={handleChange}
						labelStyle={labelStyle}
						inputContStyle={inputConstStyle}
					>
						{martialStatusOptions.map((data, idx) => {
							return (
								<option key={`${data}_${idx}`}>{data}</option>
							);
						})}
					</Select>
				</form>
			</Modal>
		</Flex>
	);
};

export default PersonalDetailCard;
