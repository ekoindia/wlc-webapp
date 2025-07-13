import { Box, Flex, useToast } from "@chakra-ui/react";
import { ActionButtonGroup, PageTitle } from "components";
import { ParamType } from "constants/trxnFramework";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components/Form";
import { BbpsContext } from "./context/BbpsContext";
import { useBbpsApi } from "./hooks/useBbpsApi";
import { useBbpsNavigation } from "./hooks/useBbpsNavigation";
import { BbpsProduct, SearchFieldDef } from "./types";

export const Search = ({ product }: { product: BbpsProduct }) => {
	const { state, dispatch } = useContext(BbpsContext);
	const nav = useBbpsNavigation();
	const toast = useToast();

	const {
		fetchBills,
		processBillFetchResponse,
		fetchOperators,
		fetchDynamicFields,
		isLoadingBills,
	} = useBbpsApi(product);

	const {
		useMockData,
		operators,
		selectedOperator,
		dynamicFields,
		isLoadingDynamicData,
	} = state;

	// Determine if we need operator selection
	const needsOperatorSelection = !!product.categoryId;

	// Set mock data flag based on product configuration
	useEffect(() => {
		if (product?.useMockData !== useMockData) {
			dispatch({
				type: "SET_MOCK_DATA_FLAG",
				useMockData: product?.useMockData || false,
			});
		}
	}, [product?.useMockData, useMockData, dispatch]);

	// Reset state when product changes or component mounts
	useEffect(() => {
		// Reset all dynamic state to ensure fresh parameterList
		dispatch({ type: "RESET_DYNAMIC_FORM" });
		dispatch({ type: "SET_OPERATORS", payload: [] });
		dispatch({ type: "SET_SELECTED_OPERATOR", payload: null });
		dispatch({ type: "SET_DYNAMIC_FIELDS", payload: [] });
		dispatch({ type: "SET_LOADING_DYNAMIC_DATA", value: false });
	}, [product.categoryId, product.searchFields, dispatch]);

	// Handle operator selection change
	const handleOperatorChange = useCallback(
		(operatorId: string) => {
			const operator = operators.find(
				(op) => op.operator_id === parseInt(operatorId)
			);
			if (operator) {
				// Reset dynamic form when operator changes
				dispatch({ type: "RESET_DYNAMIC_FORM" });
				dispatch({ type: "SET_SELECTED_OPERATOR", payload: operator });
			}
		},
		[operators, dispatch]
	);

	// Fetch operators when categoryId is available
	useEffect(() => {
		if (
			needsOperatorSelection &&
			product.categoryId &&
			operators.length === 0
		) {
			const loadOperators = async () => {
				dispatch({ type: "SET_LOADING_DYNAMIC_DATA", value: true });

				try {
					const { data: operatorsData, error } = await fetchOperators(
						product.categoryId
					);

					if (error) {
						toast({
							title: "Error",
							description:
								"Failed to load operators. Please try again.",
							status: "error",
							duration: 5000,
							isClosable: true,
						});
						return;
					}

					dispatch({ type: "SET_OPERATORS", payload: operatorsData });
				} catch (error) {
					console.error("[BBPS] Error loading operators:", error);
					toast({
						title: "Error",
						description:
							"Failed to load operators. Please try again.",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
				} finally {
					dispatch({
						type: "SET_LOADING_DYNAMIC_DATA",
						value: false,
					});
				}
			};

			loadOperators();
		}
	}, [
		needsOperatorSelection,
		product.categoryId,
		operators.length,
		fetchOperators,
		dispatch,
		toast,
	]);

	// Fetch dynamic fields when operator is selected
	useEffect(() => {
		if (selectedOperator && dynamicFields.length === 0) {
			const loadDynamicFields = async () => {
				dispatch({ type: "SET_LOADING_DYNAMIC_DATA", value: true });

				try {
					const { data: fieldsData, error } =
						await fetchDynamicFields(selectedOperator.operator_id);

					if (error) {
						toast({
							title: "Error",
							description:
								"Failed to load dynamic fields. Please try again.",
							status: "error",
							duration: 5000,
							isClosable: true,
						});
						return;
					}

					dispatch({
						type: "SET_DYNAMIC_FIELDS",
						payload: fieldsData,
					});
				} catch (error) {
					console.error(
						"[BBPS] Error loading dynamic fields:",
						error
					);
					toast({
						title: "Error",
						description:
							"Failed to load dynamic fields. Please try again.",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
				} finally {
					dispatch({
						type: "SET_LOADING_DYNAMIC_DATA",
						value: false,
					});
				}
			};

			loadDynamicFields();
		}
	}, [
		selectedOperator,
		dynamicFields.length,
		fetchDynamicFields,
		dispatch,
		toast,
	]);

	// Create combined parameter list (static + operator + dynamic fields)
	const parameterList = useMemo((): SearchFieldDef[] => {
		const params: SearchFieldDef[] = [...product.searchFields];

		// Add operator selection field if needed
		if (needsOperatorSelection) {
			const operatorField: SearchFieldDef = {
				name: "operator_id",
				label: "Select Operator",
				parameter_type_id: ParamType.LIST,
				required: true,
				list_elements: Array.isArray(operators)
					? operators.map((op) => ({
							value: op.operator_id.toString(),
							label: op.name,
						}))
					: [],
			};
			params.push(operatorField);
		}

		// Add dynamic fields if available
		if (dynamicFields.length > 0) {
			const dynFields: SearchFieldDef[] = dynamicFields.map((field) => ({
				name: field.param_name,
				label: field.param_label,
				parameter_type_id:
					field.param_type === "Numeric"
						? ParamType.NUMERIC
						: ParamType.TEXT,
				required: true,
				validations:
					field.regex && field.regex.length > 0
						? {
								pattern: {
									value: new RegExp(field.regex),
									message:
										field.error_message ||
										"Invalid input format",
								},
							}
						: undefined,
			}));
			params.push(...dynFields);
		}

		return params;
	}, [
		product.searchFields,
		needsOperatorSelection,
		operators,
		dynamicFields,
	]);

	console.log("[BBPS] parameterList", parameterList);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
		watch,
		unregister,
	} = useForm({
		mode: "onChange",
		// Merge product defaults with previously stored search data
		// This ensures form is prefilled when returning from status screen
		defaultValues: {
			...product.defaultSearchValues,
			...state.searchFormData,
		},
	});

	const watchedOperatorId = watch("operator_id");

	// Add this useEffect
	useEffect(() => {
		if (
			watchedOperatorId &&
			watchedOperatorId !== state.selectedOperator?.operator_id.toString()
		) {
			handleOperatorChange(watchedOperatorId);
		}
	}, [
		watchedOperatorId,
		state.selectedOperator?.operator_id,
		handleOperatorChange,
		dispatch,
	]); // Add dependencies

	const prevDynamicFieldsRef = useRef<string[]>([]);

	useEffect(() => {
		const currentNames = dynamicFields.map((field) => field.param_name);
		const removed = prevDynamicFieldsRef.current.filter(
			(name) => !currentNames.includes(name)
		);
		removed.forEach((name) => unregister(name));
		prevDynamicFieldsRef.current = currentNames;
	}, [dynamicFields, unregister]);

	console.log("[BBPS] Search errors", errors);
	console.log("[BBPS] Search isValid", isValid);

	const onSubmit = async (payload: Record<string, string>) => {
		console.log("[BBPS] onSubmit", payload);

		// Store search form payload in context
		dispatch({ type: "SET_SEARCH_PAYLOAD", payload: payload });

		// Show loading state
		dispatch({ type: "SET_LOADING", value: true });

		try {
			// Fetch bills (will use mock if product.useMockData is true)
			const { data: response, error } = await fetchBills(payload);

			// Handle error case
			if (error || !response) {
				dispatch({
					type: "SET_ERROR",
					message:
						error || "Failed to fetch bills. Please try again.",
				});
				return;
			}

			// Success case: status === 0
			if (response.status === 0 && response.data) {
				// Transform and store the validation response
				const transformedData = processBillFetchResponse(response);

				if (transformedData) {
					console.log(
						"[BBPS Search] Setting validation response and navigating to preview:",
						transformedData
					);
					dispatch({
						type: "SET_VALIDATION_RESPONSE",
						payload: transformedData,
					});

					console.log("[BBPS] Transformed response", transformedData);
					nav.goPreview();
				} else {
					dispatch({
						type: "SET_ERROR",
						message:
							"No bills found. Please check your input and try again.",
					});
				}
			} else {
				// Error case: status !== 0
				const errorMessage =
					response.message ||
					"Failed to fetch bills. Please check your input and try again.";
				dispatch({ type: "SET_ERROR", message: errorMessage });
			}
		} catch (error) {
			console.error("[BBPS] Error in onSubmit:", error);
			dispatch({
				type: "SET_ERROR",
				message: "An unexpected error occurred. Please try again.",
			});
		} finally {
			// Hide loading state
			dispatch({ type: "SET_LOADING", value: false });
		}
	};

	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Proceed",
			loading: isSubmitting || isLoadingBills || isLoadingDynamicData,
			disabled: !isValid,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: nav.goPreviousStep,
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
		<Flex direction="column">
			<PageTitle
				title="Search"
				subtitle="Fetch customer's pending bills"
				onBack={nav.goPreviousStep}
				toolComponent={
					useMockData && (
						<Box
							px={2}
							py={1}
							bg="yellow.100"
							color="yellow.800"
							borderRadius="md"
							fontSize="sm"
							fontWeight="medium"
						>
							Mock Mode
						</Box>
					)
				}
			/>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex
					direction="column"
					px={{ base: "6", md: "8" }}
					mx={{ base: "4", md: "0" }}
					pt="6"
					pb="8"
					bg="white"
					gap="8"
					border="card"
					boxShadow="basic"
					borderRadius="10px"
				>
					<Form
						parameter_list={parameterList}
						register={register}
						formValues={state.searchFormData}
						control={control}
						errors={errors}
					/>
					<ActionButtonGroup buttonConfigList={buttonConfigList} />
				</Flex>
			</form>
		</Flex>
	);
};
