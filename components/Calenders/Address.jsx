// import { Box, Flex, useToast } from "@chakra-ui/react";
// import { Button } from "components";
// import { Endpoints, ParamType, TransactionIds } from "constants";
// import { useSession } from "contexts";
// import { fetcher } from "helpers";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { useForm, useWatch } from "react-hook-form";
// import { Form } from "tf-components";

// const findObjectByValue = (arr, value) => arr.find((obj) => obj.value == value);

// const Address = ({handleSubmit , onSubmit , control}) => {
// 	const [agentData, setAgentData] = useState();
// 	const [statesList, setStatesList] = useState([]);
// 	const { accessToken } = useSession();
// 	const toast = useToast();

// 	const router = useRouter();

// 	const current_address_parameter_list = [
// 		{
// 			name: "address_line1",
// 			label: "Address Line 1",
// 		},
// 		{
// 			name: "address_line2",
// 			label: "Address Line 2",
// 			required: false,
// 		},
// 		{
// 			name: "pincode",
// 			label: "Postel Code",
// 			parameter_type_id: ParamType.NUMERIC,
// 			step: "1",
// 			maxLength: 6,
// 		},
// 		{
// 			name: "city",
// 			label: "City",
// 		},
// 		{
// 			name: "country_state",
// 			label: "State",
// 			parameter_type_id: ParamType.LIST,
// 			list_elements: statesList,
// 		},
// 		{
// 			name: "country",
// 			label: "Country",
// 			disabled: true,
// 		},
// 	];

// 	const {
// 		handleSubmit,
// 		register,
// 		formState: { errors, isSubmitting },
// 		control,
// 		reset,
// 	} = useForm();

// 	const watcher = useWatch({ control });

// 	const fetchStatesList = () => {
// 		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
// 			body: {
// 				interaction_type_id: TransactionIds.STATE_TYPE,
// 			},
// 			token: accessToken,
// 		})
// 			.then((res) => {
// 				if (res.status === 0) {
// 					setStatesList(res?.param_attributes.list_elements);
// 				}
// 			})
// 			.catch((err) => {
// 				console.error("err", err);
// 			});
// 	};

// 	const fetchAgentDataViaCellNumber = () => {
// 		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
// 			headers: {
// 				"tf-req-uri-root-path": "/ekoicici/v1",
// 				// "tf-req-uri": `/network/agents?record_count=1&search_value=${mobile}`,
// 				"tf-req-method": "GET",
// 			},
// 			token: accessToken,
// 		})
// 			.then((res) => {
// 				setAgentData(res?.data?.agent_details[0]);
// 			})
// 			.catch((error) => {
// 				console.error("[ProfilePanel] Get Agent Detail Error:", error);
// 			});
// 	};

// 	useEffect(() => {
// 		fetchStatesList();
// 		const storedData = JSON.parse(
// 			localStorage.getItem("oth_last_selected_agent")
// 		);
// 		if (storedData !== undefined) {
// 			setAgentData(storedData);
// 		} else {
// 			fetchAgentDataViaCellNumber();
// 		}
// 	}, []);

// 	useEffect(() => {
// 		let defaultValues = {};

// 		const _state =
// 			agentData?.state == "Delhi"
// 				? "National Capital Territory of Delhi (UT)"
// 				: agentData?.state;

// 		const state = findObjectByValue(statesList, _state);

// 		defaultValues.address_line1 = agentData?.line_1;
// 		defaultValues.address_line2 = agentData?.line_2;
// 		defaultValues.pincode = agentData?.zip;
// 		defaultValues.city = agentData?.city;
// 		defaultValues.country_state = state;
// 		defaultValues.country = "India";

// 		reset({ ...defaultValues });
// 	}, [agentData, statesList]);

// 	const handleFormSubmit = (submittedData) => {
// 		const keysToFlatten = ["country_state"];

// 		const finalData = Object.entries(submittedData).reduce(
// 			(acc, [key, value]) => {
// 				if (keysToFlatten.includes(key)) {
// 					if (value?.value !== undefined && value?.value !== "") {
// 						acc[key] = value.value;
// 					}
// 				} else {
// 					if (value !== undefined && value !== "") {
// 						acc[key] = value;
// 					}
// 				}
// 				return acc;
// 			},
// 			{}
// 		);

//         console.log("@@@@@ finalData", finalData);
//         onSubmit(finalData);
// 	};

// 	return (
// 		<Box px={{ base: "20px", md: "0" }} >
// 			<Flex
// 				direction="column"
// 				w="100%"
// 				bg="white"
// 				borderRadius="10px"
// 				mt="20px"
// 				gap="4"
// 			>
// 				<form onSubmit={handleSubmit(handleFormSubmit)}>
// 					<Flex direction="column" gap="6">
// 						<Form
// 							{...{
// 								register,
// 								control,
// 								formValues: watcher,
// 								parameter_list: current_address_parameter_list,
// 								errors,
// 								templateColumns: {
// 									base: "1fr",
// 									lg: "repeat(auto-fit, minmax(300px, 1fr))",
// 								},
// 								columnGap: 4,
// 								width: "100%",
// 							}}
// 						/>
// 					</Flex>
// 				</form>
// 			</Flex>
// 		</Box>
// 	);
// };

// export { Address };
