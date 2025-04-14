import { PRICING_TYPE_OPTIONS } from "./pricingConstants";

/**
 * Initial state for the pricing reducer.
 * @constant
 * @type {object}
 * @property {Array} paymentModeOptions - List of available payment modes.
 * @property {Array} categoryListOptions - List of available categories.
 * @property {Array} slabOptions - List of available slabs.
 * @property {Array} pricingTypeList - List of pricing types (e.g., percentage, fixed).
 * @property {object} pricingValidation - Validation rules for pricing (min and max values).
 * @property {number | null} productId - The ID of the product being configured.
 */
export const pricingInitialState = {
	paymentModeOptions: [],
	categoryListOptions: [],
	slabOptions: [],
	pricingTypeList: PRICING_TYPE_OPTIONS,
	pricingValidation: { min: null, max: null },
	productId: null,
	multiSelectLabel: "",
	multiSelectOptions: [],
};

/**
 * Action types for the pricing reducer.
 * @constant
 * @type {object}
 * @property {string} SET_PAYMENT_MODE_OPTIONS - Action to set payment mode options.
 * @property {string} SET_CATEGORY_LIST_OPTIONS - Action to set category list options.
 * @property {string} SET_SLAB_OPTIONS - Action to set slab options.
 * @property {string} SET_PRICING_TYPE_LIST - Action to set pricing type list.
 * @property {string} SET_PRICING_VALIDATION - Action to set pricing validation rules.
 * @property {string} SET_PRODUCT_ID - Action to set the product ID.
 */
export const PRICING_ACTIONS = {
	SET_PAYMENT_MODE_OPTIONS: "SET_PAYMENT_MODE_OPTIONS",
	SET_CATEGORY_LIST_OPTIONS: "SET_CATEGORY_LIST_OPTIONS",
	SET_SLAB_OPTIONS: "SET_SLAB_OPTIONS",
	SET_PRICING_TYPE_LIST: "SET_PRICING_TYPE_LIST",
	SET_PRICING_VALIDATION: "SET_PRICING_VALIDATION",
	SET_PRODUCT_ID: "SET_PRODUCT_ID",
	SET_MULTI_SELECT_LABEL: "SET_MULTI_SELECT_LABEL",
	SET_MULTI_SELECT_OPTIONS: "SET_MULTI_SELECT_OPTIONS",
} as const;

/**
 * Reducer function for managing pricing state.
 * @function
 * @param {typeof pricingInitialState} state - The current state of the pricing configuration.
 * @param {object} action - The action to perform on the state.
 * @param {keyof typeof PRICING_ACTIONS} action.type - The type of action to perform.
 * @param {any} action.payload - The payload associated with the action.
 * @returns {typeof pricingInitialState} - The updated state after applying the action.
 * @description
 * This reducer manages the state for pricing configuration. It handles actions such as updating
 * payment mode options, category list options, slab options, pricing type list, pricing validation rules,
 * and the product ID.
 */
export const pricingReducer = (
	state: typeof pricingInitialState,
	action: { type: keyof typeof PRICING_ACTIONS; payload: any }
): typeof pricingInitialState => {
	switch (action.type) {
		case PRICING_ACTIONS.SET_PAYMENT_MODE_OPTIONS:
			return { ...state, paymentModeOptions: action.payload };
		case PRICING_ACTIONS.SET_CATEGORY_LIST_OPTIONS:
			return { ...state, categoryListOptions: action.payload };
		case PRICING_ACTIONS.SET_SLAB_OPTIONS:
			return { ...state, slabOptions: action.payload };
		case PRICING_ACTIONS.SET_PRICING_TYPE_LIST:
			return { ...state, pricingTypeList: action.payload };
		case PRICING_ACTIONS.SET_PRICING_VALIDATION:
			return { ...state, pricingValidation: action.payload };
		case PRICING_ACTIONS.SET_PRODUCT_ID:
			return { ...state, productId: action.payload };
		case PRICING_ACTIONS.SET_MULTI_SELECT_LABEL:
			return { ...state, multiSelectLabel: action.payload };
		case PRICING_ACTIONS.SET_MULTI_SELECT_OPTIONS:
			return { ...state, multiSelectOptions: action.payload };
		default:
			return state;
	}
};
