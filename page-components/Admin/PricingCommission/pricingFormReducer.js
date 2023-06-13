export const INITIAL_FORM_STATE = {
	commission: 2.5,
	commissionFor: "1",
	commissionType: "0",
	// paymentMode: "1",
	// fromMultiSelect: [],
	// fromSelect: [],
	// data: [],
	// finalData: {},
};

export const pricingFormReducer = (state, action) => {
	let _data = [];
	switch (action.type) {
		case "SET_COMMISSION":
			return {
				...state,
				commission: action.payload,
				finalData: calculateFinalData({
					...state,
					commission: action.payload,
				}),
			};
		case "SET_COMMISSION_FOR":
			return {
				...state,
				commissionFor: action.payload,
				finalData: calculateFinalData({
					...state,
					commissionFor: action.payload,
				}),
			};
		case "SET_COMMISSION_TYPE":
			return {
				...state,
				commissionType: action.payload,
				finalData: calculateFinalData({
					...state,
					commissionType: action.payload,
				}),
			};
		case "SET_PAYMENT_MODE":
			return {
				...state,
				paymentMode: action.payload,
				finalData: calculateFinalData({
					...state,
					paymentMode: action.payload,
				}),
			};
		case "SET_FROM_MULTI_SELECT":
			return {
				...state,
				fromMultiSelect: action.payload,
				finalData: calculateFinalData({
					...state,
					fromMultiSelect: action.payload,
				}),
			};
		case "SET_FROM_SLAB_SELECT":
			return {
				...state,
				fromSelect: action.payload,
				finalData: calculateFinalData({
					...state,
					fromSelect: action.payload,
				}),
			};
		case "SET_DATA":
			_data = action.payload.allScspList ?? [];
			// action.for == 1
			// 	? action.payload.allCspList ?? []
			// 	: action.for == 2
			// 	? action.payload.allScspList ?? []
			// 	: [];
			return { ...state, data: _data };
		case "RESET":
			return INITIAL_FORM_STATE;
		default:
			return state;
	}
};

// Calculate the finalData object based on the current state
const calculateFinalData = (_finalData) => {
	// Add your logic here to calculate the finalData object based on the state values
	// Example:
	const {
		commission,
		// commissionFor,
		commissionType,
		paymentMode,
		fromMultiSelect,
		fromSelect,
	} = _finalData;

	let finalData = {};

	if (fromSelect?.length == 2) {
		finalData = {
			...finalData,
			min_slab_amount: fromSelect[0], //select
			max_slab_amount: fromSelect[1], //select
		};
	}

	if (paymentMode) {
		finalData = {
			...finalData,
			payment_mode: paymentMode, //IndoNepal paymentMode
		};
	}

	if (commissionType) {
		finalData = {
			...finalData,
			pricing_type: commissionType, //commissionType
		};
	}

	if (commission) {
		finalData = {
			...finalData,
			actual_pricing: commission, //default input
		};
	}

	if (fromMultiSelect.length > 0) {
		finalData = {
			...finalData,
			csplist: fromMultiSelect.map((num) => Number(num)), //multiselect
		};
	}

	return finalData;
};
