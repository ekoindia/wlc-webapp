import { Flex, useToast } from "@chakra-ui/react";
import { ActionButtonGroup, Icon } from "components";
import {
	Endpoints,
	ParamType,
	productPricingType,
	TransactionTypes,
} from "constants";
import { useSession } from "contexts/";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useMemo, useReducer, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";
import {
	AGENT_TYPES,
	formatSlabs,
	getStatus,
	OPERATION,
	OPERATION_TYPE_OPTIONS,
	PRICING_ACTIONS,
	PRICING_TYPE_OPTIONS,
	PRICING_TYPES,
	pricingInitialState,
	pricingReducer,
} from ".";

/*
    TODO:
        - Multi-select agent list:
            - Show as table with following columns: agent type, agent code, agent name, agent mobile, city, state
            - Download the full list only once (in the PricingCommission/ConfigPageCard main page component) and filter as needed.
            - Also, cache & share the same list with all pricing configuration sub-components.
*/

// TODO: set productId as a fixed parameter in the form
// TODO: set operation_type to 4 in case of distributor's commission
// TODO: fix form reset when selecting different payment modes, slabs and everything
// INFO: No need to send payment_mode or category in the final API call, just send product_id from these fields

const _multiselectRenderer = {
	value: "user_code",
	label: "name",
};

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

/**
 * Defines the dependencies for each field in the form and their default reset values.
 * When a field changes, its dependent fields are reset to their default values.
 * @constant
 * @type {Object<string, Array<{ key: string, defaultValue: any }>>}
 * @property {Array<{ key: string, defaultValue: any }>} payment_mode - Dependencies for the `payment_mode` field.
 * @property {Array<{ key: string, defaultValue: any }>} category - Dependencies for the `category` field.
 * @property {Array<{ key: string, defaultValue: any }>} select - Dependencies for the `select` field.
 * @property {Array<{ key: string, defaultValue: any }>} pricing_type - Dependencies for the `pricing_type` field.
 */
const FIELD_DEPENDENCIES = {
	payment_mode: [
		{ key: "category", defaultValue: null },
		{ key: "select", defaultValue: null },
		{ key: "pricing_type", defaultValue: {} },
		{ key: "actual_pricing", defaultValue: "" },
	],
	category: [
		{ key: "select", defaultValue: null },
		{ key: "pricing_type", defaultValue: {} },
		{ key: "actual_pricing", defaultValue: "" },
	],
	select: [
		{ key: "pricing_type", defaultValue: {} },
		{ key: "actual_pricing", defaultValue: "" },
	],
	pricing_type: [{ key: "actual_pricing", defaultValue: "" }],
};

/**
 * Form sub-component to set pricing/commission for a product (fixed amount or percentage).
 * @param {*} props
 * @param {string} props.agentType - Type of agent (e.g. distributor, retailer, etc.)
 * @param {object} props.productDetails - Pricing/Slab-related details of the product for which pricing/commission is to be set.
 * @returns {JSX.Element}
 */
const PricingForm = ({ agentType, productDetails }) => {
	const { paymentMode, slabs, categoryList, productId } =
		productDetails || {};

	// Initialize reducer
	const [state, dispatch] = useReducer(pricingReducer, pricingInitialState);

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

	if (watcher["pricing_type"] === PRICING_TYPES.PERCENT) {
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
	const parameter_list = useMemo(() => {
		const _list = [];

		if (agentType === AGENT_TYPES.RETAILERS) {
			// retailers
			_list.push(
				{
					name: "operation_type",
					label: `Set Pricing for`,
					parameter_type_id: ParamType.LIST,
					list_elements: OPERATION_TYPE_OPTIONS,
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
		} else if (agentType === AGENT_TYPES.DISTRIBUTOR) {
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
				meta: {
					force_dropdown: true,
				},
			});
		}

		if (state.categoryListOptions?.length > 0) {
			_list.push({
				name: "category",
				label: "Select Category",
				parameter_type_id: ParamType.LIST,
				list_elements: state.categoryListOptions,
				meta: {
					force_dropdown: true,
				},
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
							watcher["pricing_type"] == PRICING_TYPES.PERCENT
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
	}, [
		agentType,
		multiSelectLabel,
		multiSelectOptions,
		state.paymentModeOptions,
		state.categoryListOptions,
		state.slabOptions,
		state.pricingTypeList,
		state.pricingValidation,
		watcher.pricing_type,
		helperText,
	]);

	/**
	 * Resets the dependent fields of a given field to their default values and executes an optional callback.
	 * @param {string} fieldName - The name of the field whose dependencies need to be reset.
	 * @param {() => void} [callback] - Optional callback function to execute after resetting the fields.
	 * @returns {void}
	 */
	const resetDependentFields = (fieldName, callback) => {
		const dependencies = FIELD_DEPENDENCIES[fieldName] ?? [];

		if (!dependencies.length) return;

		// need to create a final object, then reset in one go
		const resetValues = dependencies.reduce(
			(acc, { key, defaultValue }) => {
				acc[key] = defaultValue;
				return acc;
			},
			{}
		);
		reset({ ...watcher, ...resetValues });

		if (callback) {
			callback();
		}
	};

	// Fetch the list of agents (retailers, distributors, or both) based on the agent-type and operation-type selected.
	useEffect(() => {
		// TODO: CACHE AGENT LIST
		// TODO: Download full agent list only once and filter as needed

		// Reset agent-list before fetching
		setMultiSelectOptions([]);

		if (
			agentType === AGENT_TYPES.RETAILERS &&
			watcher.operation_type == "3"
		) {
			// No need to fetch list of agents when operation_type is "3" (Whole Network) for Agent's commission
			return;
		}

		/* no need of api call when user clicked on product radio option in select_commission_for field as multiselect option is hidden for this */
		const _tf_req_uri =
			agentType === AGENT_TYPES.DISTRIBUTOR ||
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

		let _operationTypeList = OPERATION_TYPE_OPTIONS.filter(
			(item) => item.value == watcher.operation_type
		);
		let _label =
			_operationTypeList.length > 0 && _operationTypeList[0].label;

		setMultiSelectLabel(_label);
	}, [agentType, watcher.operation_type]);

	// Set ProductId directly from productDetails if available
	useEffect(() => {
		if (!productId) return;
		dispatch({
			type: PRICING_ACTIONS.SET_PRODUCT_ID,
			payload: productId,
		});
	}, [productId]);

	// Set slabs directly from productDetails if available
	useEffect(() => {
		if (!slabs?.length) return;
		dispatch({
			type: PRICING_ACTIONS.SET_SLAB_OPTIONS,
			payload: formatSlabs(slabs),
		});
	}, [slabs]);

	// Set categoryList directly from productDetails if available
	useEffect(() => {
		if (!categoryList?.length) return;

		dispatch({
			type: PRICING_ACTIONS.SET_CATEGORY_LIST_OPTIONS,
			payload: categoryList.map((item) => ({
				...item,
				value: `${item.productId}`,
			})),
		});
	}, [categoryList]);

	// Set PaymentModeOptions based on the fetched paymentMode
	useEffect(() => {
		if (!paymentMode || paymentMode.length === 0) return;

		const handleSingleDefaultPaymentMode = (mode) => {
			const { productId, slabs, validation } = mode;

			// Set productId, if available
			if (productId != null) {
				dispatch({
					type: PRICING_ACTIONS.SET_PRODUCT_ID,
					payload: productId,
				});
			}

			// Set slabs, if available
			if (slabs) {
				dispatch({
					type: PRICING_ACTIONS.SET_SLAB_OPTIONS,
					payload: formatSlabs(slabs),
				});
			}

			// Update pricing type list based on validation
			if (validation) {
				const { updatedList, firstNonDisabled } = updatePricingTypeList(
					validation,
					PRICING_TYPE_OPTIONS
				);

				dispatch({
					type: PRICING_ACTIONS.SET_PRICING_TYPE_LIST,
					payload: updatedList,
				});

				// Set the first non-disabled pricing type as the selected one
				if (firstNonDisabled) {
					watcher["pricing_type"] = firstNonDisabled.value;
					reset({ ...watcher });
				}
			}
		};

		const handleMultiplePaymentModes = (modes) => {
			const _paymentModeOptions = modes.map((item, index) => ({
				...item,
				value: `${index}`,
			}));

			dispatch({
				type: PRICING_ACTIONS.SET_PAYMENT_MODE_OPTIONS,
				payload: _paymentModeOptions,
			});
		};

		if (paymentMode.length === 1 && paymentMode[0].label === "Default") {
			handleSingleDefaultPaymentMode(paymentMode[0]);
		} else {
			handleMultiplePaymentModes(paymentMode);
		}
	}, [paymentMode]);

	// Set CategoryListOptions or SlabOptions based on selected paymentMode
	useEffect(() => {
		const _paymentMode = watcher?.payment_mode;

		if (!_paymentMode) return;

		const { slabs, categoryList, productId } = _paymentMode ?? {};

		if (categoryList?.length > 0) {
			const _categoryOptions = categoryList.map((item) => ({
				...item,
				value: `${item.productId}`,
			}));

			resetDependentFields("payment_mode", () => {
				// Update the categoryListOptions based on selected payment mode
				dispatch({
					type: PRICING_ACTIONS.SET_CATEGORY_LIST_OPTIONS,
					payload: _categoryOptions,
				});

				// Reset the slabOptions when payment mode changes
				dispatch({
					type: PRICING_ACTIONS.SET_SLAB_OPTIONS,
					payload: [],
				});

				// Reset the pricing type list when payment mode changes
				dispatch({
					type: PRICING_ACTIONS.SET_PRICING_TYPE_LIST,
					payload: PRICING_TYPE_OPTIONS,
				});

				// Reset the pricing validation when payment mode changes
				dispatch({
					type: PRICING_ACTIONS.SET_PRICING_VALIDATION,
					payload: {},
				});
			});
		}
		if (slabs?.length > 0) {
			const formattedSlabs = formatSlabs(slabs ?? []);

			resetDependentFields("payment_mode", () => {
				// Update the slabOptions based on selected payment mode
				dispatch({
					type: PRICING_ACTIONS.SET_SLAB_OPTIONS,
					payload: formattedSlabs,
				});

				// Reset the pricing type list when payment mode changes
				dispatch({
					type: PRICING_ACTIONS.SET_PRICING_TYPE_LIST,
					payload: PRICING_TYPE_OPTIONS,
				});

				// Reset the pricing validation when payment mode changes
				dispatch({
					type: PRICING_ACTIONS.SET_PRICING_VALIDATION,
					payload: {},
				});
			});
		}
		// Update the productId if available
		if (productId != null) {
			// Update the productId in the state
			dispatch({
				type: PRICING_ACTIONS.SET_PRODUCT_ID,
				payload: productId,
			});
		}
	}, [watcher?.payment_mode?.value]);

	// Set SlabOptions based on selected CategoryListOptions
	useEffect(() => {
		const _category = watcher?.category;

		if (!_category) return;

		const { productId, slabs } = _category ?? {};

		// Set productId if available
		if (productId != null) {
			dispatch({
				type: PRICING_ACTIONS.SET_PRODUCT_ID,
				payload: productId,
			});
		}

		resetDependentFields("category", () => {
			if (slabs?.length > 0) {
				const formattedSlabs = formatSlabs(slabs ?? []);

				// Update the slabOptions based on selected category
				dispatch({
					type: PRICING_ACTIONS.SET_SLAB_OPTIONS,
					payload: formattedSlabs,
				});

				// Reset the pricing type list when category changes
				dispatch({
					type: PRICING_ACTIONS.SET_PRICING_TYPE_LIST,
					payload: PRICING_TYPE_OPTIONS,
				});

				// Reset the pricing validation when category changes
				dispatch({
					type: PRICING_ACTIONS.SET_PRICING_VALIDATION,
					payload: {},
				});
			}
		});
	}, [watcher?.category?.value]);

	// Update pricing type list based on slab selection
	useEffect(() => {
		const _select = watcher?.select;

		if (!_select) return;

		const { validation } = _select ?? {};

		if (!validation) {
			return;
		}

		// Reset dependent fields and execute subsequent logic in the callback
		resetDependentFields("select", () => {
			const { updatedList, firstNonDisabled } = updatePricingTypeList(
				validation,
				PRICING_TYPE_OPTIONS
			);

			// Update pricing type list based on slab validation
			dispatch({
				type: PRICING_ACTIONS.SET_PRICING_TYPE_LIST,
				payload: updatedList,
			});

			// Reset the pricing validation when slab changes
			dispatch({
				type: PRICING_ACTIONS.SET_PRICING_VALIDATION,
				payload: {},
			});

			// Set the first non-disabled pricing type as the selected one
			if (firstNonDisabled) {
				reset({
					...watcher,
					pricing_type: firstNonDisabled.value, // Explicitly set the first non-disabled value
				});
			}
		});
	}, [watcher?.select?.value]);

	// Update validation state based on selected slab and pricing type
	useEffect(() => {
		const pricingType =
			watcher.pricing_type === PRICING_TYPES.PERCENT
				? "percentage"
				: watcher.pricing_type === PRICING_TYPES.FIXED
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
				type: PRICING_ACTIONS.SET_PRICING_VALIDATION,
				payload: { min, max },
			});

			// Reset the actual_pricing field to trigger validation
			resetDependentFields("pricing_type");
		}
	}, [watcher?.pricing_type, watcher?.select?.value]);

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

		const { min_slab_amount, max_slab_amount } =
			state.slabOptions?.[_finalData?.select?.value] || {};

		_finalData.min_slab_amount = min_slab_amount;
		_finalData.max_slab_amount = max_slab_amount;

		let _cspList = [];

		if (_finalData?.CspList?.length > 0) {
			_cspList = _finalData?.CspList?.map(
				(item) => item[_multiselectRenderer.value]
			);
			_finalData.CspList = `${_cspList}`;
		} else {
			delete _finalData.CspList;
		}

		delete _finalData.select;
		delete _finalData.payment_mode;
		delete _finalData.category;

		const requestOptions = {
			body: {
				interaction_type_id: TransactionTypes.SET_PRICING,
				operation: OPERATION.SUBMIT,
				product_id: state.productId,
				..._finalData,
			},
		};

		if (agentType === AGENT_TYPES.DISTRIBUTOR) {
			requestOptions.body.communication = 1;
			requestOptions.body.operation_type = 4; // Todo: Make this fixed parameter
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
