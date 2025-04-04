import { Flex, useToast } from "@chakra-ui/react";
import { ActionButtonGroup, Icon } from "components";
import { Endpoints, ParamType, productPricingType } from "constants";
import { useSession } from "contexts/";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

/*
    TODO:
        - Multi-select agent list:
            - Show as table with following columns: agent type, agent code, agent name, agent mobile, city, state
            - Download the full list only once (in the PricingCommission/ConfigPageCard main page component) and filter as needed.
            - Also, cache & share the same list with all pricing configuration sub-components.
*/

// TODO: set productId as a fixed parameter in the form

const AGENT_TYPE = {
	RETAILERS: "0",
	DISTRIBUTOR: "2",
};

const operation_type_list = [
	{ value: "3", label: "Whole Network" },
	{ value: "2", label: "Distributor's Network" },
	{ value: "1", label: "Individual Distributor/Retailer" },
];

const PRICING_TYPE = {
	PERCENT: "0",
	FIXED: "1",
};

const pricing_type_list = [
	{
		id: "percentage",
		value: PRICING_TYPE.PERCENT,
		label: "Percentage (%)",
		isDisabled: false,
	},
	{
		id: "fixed",
		value: PRICING_TYPE.FIXED,
		label: "Fixed (₹)",
		isDisabled: false,
	},
];

const OPERATION = {
	SUBMIT: 1,
	FETCH: 0,
};

const _multiselectRenderer = {
	value: "user_code",
	label: "name",
};

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

// Helper function to format slabs
const formatSlabs = (slabs) =>
	slabs?.map((item, index) => ({
		value: `${index}`,
		label:
			item.min === item.max
				? `₹${item.min}`
				: `₹${item.min} - ₹${item.max}`,
		validation: item.validation,
		min_slab_amount: item.min,
		max_slab_amount: item.max,
	})) || [];

// Helper function to update pricing type list
const updatePricingTypeList = (validations, pricingTypeList) => {
	let anyDisabled = false;

	const updatedList = pricingTypeList.map((type) => {
		const isDisabled = !validations?.[type.id];
		if (isDisabled) anyDisabled = true;
		return { ...type, isDisabled };
	});

	const firstNonDisabled = updatedList.find((type) => !type.isDisabled);

	return { updatedList, firstNonDisabled, anyDisabled };
};

// Define initial state
const initialState = {
	paymentModeOptions: [],
	categoryListOptions: [],
	slabOptions: [],
	pricingTypeList: pricing_type_list,
	pricingValidation: { min: null, max: null },
	productId: null,
};

// Define action types
const ACTIONS = {
	SET_PAYMENT_MODE_OPTIONS: "SET_PAYMENT_MODE_OPTIONS",
	SET_CATEGORY_LIST_OPTIONS: "SET_CATEGORY_LIST_OPTIONS",
	SET_SLAB_OPTIONS: "SET_SLAB_OPTIONS",
	SET_PRICING_TYPE_LIST: "SET_PRICING_TYPE_LIST",
	SET_PRICING_VALIDATION: "SET_PRICING_VALIDATION",
	SET_PRODUCT_ID: "SET_PRODUCT_ID",
};

// Reducer function
const reducer = (state, action) => {
	switch (action.type) {
		case ACTIONS.SET_PAYMENT_MODE_OPTIONS:
			return { ...state, paymentModeOptions: action.payload };
		case ACTIONS.SET_CATEGORY_LIST_OPTIONS:
			return { ...state, categoryListOptions: action.payload };
		case ACTIONS.SET_SLAB_OPTIONS:
			return { ...state, slabOptions: action.payload };
		case ACTIONS.SET_PRICING_TYPE_LIST:
			return { ...state, pricingTypeList: action.payload };
		case ACTIONS.SET_PRICING_VALIDATION:
			return { ...state, pricingValidation: action.payload };
		case ACTIONS.SET_PRODUCT_ID:
			return { ...state, productId: action.payload };
		default:
			return state;
	}
};

/**
 * Form sub-component to set pricing/commission for a product (fixed amount or percentage).
 * @param {*} props
 * @param {string} props.agentType - Type of agent (e.g. distributor, retailer, etc.)
 * @param {object} props.productDetails - Pricing/Slab-related details of the product for which pricing/commission is to be set.
 * @returns {JSX.Element}
 */
const PricingForm = ({ agentType, productDetails }) => {
	const { paymentMode, slabs } = productDetails || {};
	console.log("[Pricing] paymentMode", paymentMode);

	// Initialize reducer
	const [state, dispatch] = useReducer(reducer, initialState);

	const {
		handleSubmit,
		register,
		control,
		formState: {
			errors,
			isValid,
			isDirty,
			isSubmitting,
			isSubmitSuccessful,
		},
		reset,
		trigger,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			...{ operation_type: "3" },
		},
	});

	const watcher = useWatch({
		control,
	});
	console.log("[Pricing] watcher", watcher);

	const toast = useToast();
	const router = useRouter();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const [multiSelectLabel, setMultiSelectLabel] = useState(); // move to reducer
	const [multiSelectOptions, setMultiSelectOptions] = useState([]); // move to reducer

	const min = state.pricingValidation?.min;
	const max = state.pricingValidation?.max;

	let prefix = "";
	let suffix = "";

	if (watcher["pricing_type"] === PRICING_TYPE.PERCENT) {
		suffix = "%";
	} else {
		prefix = "₹";
	}

	let helperText = "";

	if (min != undefined) helperText += `Minimum: ${prefix}${min}${suffix}`;
	if (max != undefined)
		helperText += `${
			min != undefined ? " - " : ""
		}Maximum: ${prefix}${max}${suffix}`;

	// Create a list of form parameters based on product, agent-type, and operation-type selected.
	// Create a list of form parameters based on product, agent-type, and operation-type selected.
	const getParameterList = () => {
		const _list = [];

		if (agentType === AGENT_TYPE.RETAILERS) {
			// retailers
			_list.push(
				{
					name: "operation_type",
					label: `Set ${productPricingType.DMT} for`,
					parameter_type_id: ParamType.LIST,
					list_elements: operation_type_list,
				},
				{
					name: "CspList",
					label: `Select ${multiSelectLabel}`,
					parameter_type_id: ParamType.LIST,
					is_multi: true,
					list_elements: multiSelectOptions,
					visible_on_param_name: "operation_type",
					visible_on_param_value: /1|2/,
					multiSelectRenderer: _multiselectRenderer,
				}
			);
		} else if (agentType === AGENT_TYPE.DISTRIBUTOR) {
			// distributors
			_list.push({
				name: "CspList",
				label: "Select Distributor",
				parameter_type_id: ParamType.LIST,
				is_multi: true,
				list_elements: multiSelectOptions,
				multiSelectRenderer: _multiselectRenderer,
			});
		}

		if (state.paymentModeOptions?.length > 0) {
			_list.push({
				name: "payment_mode",
				label: "Select Payment Mode",
				parameter_type_id: ParamType.LIST,
				list_elements: state.paymentModeOptions,
			});
		}

		if (state.categoryListOptions?.length > 0) {
			_list.push({
				name: "category",
				label: "Select Category",
				parameter_type_id: ParamType.LIST,
				list_elements: state.categoryListOptions,
				// meta: {
				// 	force_dropdown: true,
				// },
			});
		}

		if (state.slabOptions?.length > 0) {
			_list.push({
				name: "select",
				label: "Select Slab",
				parameter_type_id: ParamType.LIST,
				list_elements: state.slabOptions,
				meta: {
					force_dropdown: true,
				},
			});
		}

		_list.push(
			{
				name: "pricing_type",
				label: `Select ${productPricingType.DMT} Type`,
				parameter_type_id: ParamType.LIST,
				list_elements: state.pricingTypeList,
				// defaultValue: DEFAULT.pricing_type,
			},
			{
				name: "actual_pricing",
				label: `Define ${productPricingType.DMT} (GST Inclusive)`,
				parameter_type_id: ParamType.NUMERIC, //ParamType.MONEY
				helperText: helperText,
				validations: {
					// required: true,
					min: state.pricingValidation?.min,
					max: state.pricingValidation?.max,
				},
				inputRightElement: (
					<Icon
						name={
							watcher["pricing_type"] == PRICING_TYPE.PERCENT
								? "percent_bg"
								: "rupee_bg"
						}
						size="23px"
						color="primary.DEFAULT"
					/>
				),
			}
		);
		return _list;
	};

	const parameter_list = getParameterList();

	// Fetch the list of agents (retailers, distributors, or both) based on the agent-type and operation-type selected.
	useEffect(() => {
		// TODO: CACHE AGENT LIST
		// TODO: Download full agent list only once and filter as needed

		// Reset agent-list before fetching
		setMultiSelectOptions([]);

		if (
			agentType === AGENT_TYPE.RETAILERS &&
			watcher.operation_type == "3"
		) {
			// No need to fetch list of agents when operation_type is "3" (Whole Network) for Agent's commission
			return;
		}

		/* no need of api call when user clicked on product radio option in select_commission_for field as multiselect option is hidden for this */
		const _tf_req_uri =
			agentType === AGENT_TYPE.DISTRIBUTOR ||
			watcher.operation_type === "2"
				? "/network/agent-list?usertype=1"
				: "/network/agent-list";

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `${_tf_req_uri}`,
				"tf-req-method": "GET",
			},
			token: accessToken,
			generateNewToken,
		})
			.then((res) => {
				const _agents = res?.data?.csp_list ?? [];
				setMultiSelectOptions(_agents);
			})
			.catch((error) => {
				console.error("📡Error fetching network list:", error);
			});

		let _operationTypeList = operation_type_list.filter(
			(item) => item.value == watcher.operation_type
		);
		let _label =
			_operationTypeList.length > 0 && _operationTypeList[0].label;

		setMultiSelectLabel(_label);
	}, [agentType, watcher.operation_type]);

	// Set slabs directly from productDetails if available
	useEffect(() => {
		if (!slabs?.length) return;

		dispatch({
			type: ACTIONS.SET_SLAB_OPTIONS,
			payload: formatSlabs(slabs),
		});
	}, [slabs]);

	// Set PaymentModeOptions based on the fetched paymentMode
	useEffect(() => {
		if (!paymentMode?.length) return;

		if (paymentMode.length === 1 && paymentMode[0].label === "Default") {
			const { slabs, validation, productId } = paymentMode[0];

			// Set slabs if available
			if (slabs) {
				dispatch({
					type: ACTIONS.SET_SLAB_OPTIONS,
					payload: formatSlabs(slabs),
				});
			}

			// Update pricing type list based on validation
			if (validation) {
				const { updatedList, firstNonDisabled } = updatePricingTypeList(
					validation,
					pricing_type_list
				);

				dispatch({
					type: ACTIONS.SET_PRICING_TYPE_LIST,
					payload: updatedList,
				});

				// Set the first non-disabled pricing type as the selected one
				if (firstNonDisabled)
					watcher["pricing_type"] = firstNonDisabled.value;
				reset({ ...watcher });
			}

			// Set productId if available
			if (productId != null) {
				console.log("[Pricing] productId 1", productId);
				dispatch({
					type: ACTIONS.SET_PRODUCT_ID,
					payload: productId,
				});
			}
		} else {
			// Map payment modes to options
			dispatch({
				type: ACTIONS.SET_PAYMENT_MODE_OPTIONS,
				payload: paymentMode.map((item, index) => ({
					value: `${index}`,
					label: item.label,
				})),
			});
		}
	}, [paymentMode]);

	// Set CategoryListOptions or SlabOptions based on selected paymentMode
	// If paymentMode contains CategoryList, set CategoryListOptions
	// Otherwise, set SlabOptions directly
	useEffect(() => {
		console.log("[Pricing] >>>> 1");

		// Handle Radio and Select component differences
		const _paymentMode =
			state.paymentModeOptions?.length > 3
				? watcher?.payment_mode?.value
				: watcher?.payment_mode;

		if (!_paymentMode) return;

		const selectedPaymentMode = paymentMode?.[+_paymentMode];

		// If no categoryList, set slabs directly; otherwise, set categoryListOptions
		if (!selectedPaymentMode?.categoryList) {
			console.log("[Pricing] selectedPaymentMode", selectedPaymentMode);
			console.log("[Pricing] If >>>> 1.1");
			// Update the slabOptions based on selected payment mode
			console.log(
				"[Pricing] selectedPaymentMode?.slabs",
				selectedPaymentMode?.slabs
			);

			const slabs = formatSlabs(selectedPaymentMode?.slabs ?? []);
			const productId = selectedPaymentMode?.productId ?? null;

			// Update the slabOptions based on selected payment mode
			if (slabs?.length > 0) {
				dispatch({
					type: ACTIONS.SET_SLAB_OPTIONS,
					payload: slabs,
				});
			}

			// Update the productId if available
			if (productId != null) {
				console.log("[Pricing] productId 2", productId);
				dispatch({
					type: ACTIONS.SET_PRODUCT_ID,
					payload: productId,
				});
			}

			// Reset Slab value to null and pricing type to null
			watcher["select"] = null;
			watcher["pricing_type"] = null;
			watcher["actual_pricing"] = "";
			reset({ ...watcher });

			// Reset pricing type list
			dispatch({
				type: ACTIONS.SET_PRICING_TYPE_LIST,
				payload: pricing_type_list,
			});

			// Reset pricing validation
			dispatch({
				type: ACTIONS.SET_PRICING_VALIDATION,
				payload: { min: null, max: null },
			});
		} else {
			console.log("[Pricing] Else >>>> 1.2");
			// Update the categoryListOptions based on selected payment mode
			dispatch({
				type: ACTIONS.SET_CATEGORY_LIST_OPTIONS,
				payload: selectedPaymentMode.categoryList.map((item) => ({
					...item,
					value: `${item.productId}`,
				})),
			});

			// // Reset slab value to null, pricing type to null and actual pricing to null
			// watcher["select"] = null;
			// watcher["pricing_type"] = null;
			// watcher["actual_pricing"] = "";
			// reset({ ...watcher });

			// // Reset pricing type list
			// dispatch({
			// 	type: ACTIONS.SET_PRICING_TYPE_LIST,
			// 	payload: pricing_type_list,
			// });

			// // Reset pricing validation
			// dispatch({
			// 	type: ACTIONS.SET_PRICING_VALIDATION,
			// 	payload: { min: null, max: null },
			// });
		}
	}, [state.paymentModeOptions, watcher?.payment_mode]);

	// Set SlabOptions based on selected CategoryListOptions
	useEffect(() => {
		if (!watcher?.category) return;

		console.log("[Pricing] >>>> 2");

		const selectedCategory = state.categoryListOptions?.find(
			(item) => item.value === watcher.category
		);

		if (selectedCategory) {
			console.log("[Pricing] selectedCategory", selectedCategory);

			// // Reset slab value to null, pricing type to null and actual pricing to null
			// watcher["select"] = null;
			// watcher["pricing_type"] = null;
			// watcher["actual_pricing"] = "";
			// reset({ ...watcher });

			// Update SlabOptions based on selected category
			dispatch({
				type: ACTIONS.SET_SLAB_OPTIONS,
				payload: formatSlabs(selectedCategory?.slabs),
			});

			// Reset pricing type list
			dispatch({
				type: ACTIONS.SET_PRICING_TYPE_LIST,
				payload: pricing_type_list,
			});

			// Reset pricing validation
			dispatch({
				type: ACTIONS.SET_PRICING_VALIDATION,
				payload: { min: null, max: null },
			});
		}
	}, [state.categoryListOptions, watcher?.category]);

	// Update pricing type list based on slab selection
	useEffect(() => {
		if (!watcher?.select?.value) return;

		const { validation } = state.slabOptions[+watcher?.select?.value] || {};
		const { updatedList, firstNonDisabled } = updatePricingTypeList(
			validation,
			pricing_type_list
		);

		// Update pricing type list based on slab validation
		dispatch({
			type: ACTIONS.SET_PRICING_TYPE_LIST,
			payload: updatedList,
		});

		// Set the first non-disabled pricing type as the selected one
		if (firstNonDisabled) watcher["pricing_type"] = firstNonDisabled.value;

		// Reset actual pricing to null
		watcher["actual_pricing"] = "";
		reset({ ...watcher });
	}, [watcher?.select?.value]);

	// Update validation state based on selected slab and pricing type
	useEffect(() => {
		const pricingType =
			watcher.pricing_type === PRICING_TYPE.PERCENT
				? "percentage"
				: watcher.pricing_type === PRICING_TYPE.FIXED
					? "fixed"
					: null;

		// Update validation state if slab and pricing type are selected
		const slabIndex = +watcher?.select?.value;
		const slabValidation = state.slabOptions[slabIndex]?.validation;
		const paymentValidation = paymentMode?.[0]?.validation;

		const min =
			slabValidation?.[pricingType]?.min ??
			paymentValidation?.[pricingType]?.min ??
			null;
		const max =
			slabValidation?.[pricingType]?.max ??
			paymentValidation?.[pricingType]?.max ??
			null;

		// Only update state if min or max is not null
		if (min !== null || max !== null) {
			dispatch({
				type: ACTIONS.SET_PRICING_VALIDATION,
				payload: { min, max },
			});
		}
	}, [
		watcher?.pricing_type,
		watcher?.select?.value,
		watcher?.payment_mode,
		watcher?.category,
	]);

	// Reset form values after successful submission
	useEffect(() => {
		if (isSubmitSuccessful) {
			reset(watcher);
		}
		if (isDirty && !isValid) {
			trigger();
		}
	}, [isSubmitSuccessful, isValid]);

	// Function to handle form submit
	// MARK: Form Submit
	const handleFormSubmit = (data) => {
		const _finalData = { ...data };
		console.log("[Pricing] _finalData", _finalData);

		const { min_slab_amount, max_slab_amount } =
			state.slabOptions?.[_finalData?.select?.value] || {};

		console.log(
			"[Pricing] state.slabOptions?.[_finalData?.select?.value]",
			state.slabOptions?.[_finalData?.select?.value]
		);

		_finalData.min_slab_amount = min_slab_amount;
		_finalData.max_slab_amount = max_slab_amount;

		console.log("[Pricing] _finalData >>>> FINAL DATA", _finalData);

		const _CspList = data?.CspList?.map(
			(item) => item[_multiselectRenderer.value]
		);

		if (watcher.operation_type != 3) {
			_finalData.CspList = `${_CspList}`;
		}

		delete _finalData.select;

		const requestOptions = {
			body: {
				interaction_type_id: 838,
				operation: OPERATION.SUBMIT,
				product_id: state.productId,
				..._finalData,
			},
		};

		if (agentType === AGENT_TYPE.DISTRIBUTOR) {
			requestOptions.body.communication = 1;
		}

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			...requestOptions,
			token: accessToken,
			generateNewToken,
		})
			.then((res) => {
				toast({
					title: res.message,
					status: getStatus(res.status),
					duration: 6000,
					isClosable: true,
				});
				// handleReset();
			})
			.catch((error) => {
				console.error("📡Error:", error);
			});
	};

	// Button configurations for the form
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

	// MARK: Render Form
	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex
				direction="column"
				gap="8"
				px={{ base: "6", md: "8" }}
				pt="6"
				pb="8"
				bg="white"
				border="card"
				boxShadow="basic"
				borderRadius="10px"
			>
				<Form
					{...{
						parameter_list: parameter_list,
						formValues: watcher,
						control,
						register,
						errors,
					}}
				/>

				<ActionButtonGroup {...{ buttonConfigList }} />
			</Flex>
		</form>
	);
};

export default PricingForm;
