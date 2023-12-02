import { getKBarAction } from ".";

/**
 * Get Kbar result actions for searching in Transaction History based on the numeric query input.
 * For example, if the user types a number matching a phone number pattern, then show an action to search History by phone number.
 * @param {Object} Options
 * @param {string} Options.queryValue - The query value to search for
 * @param {boolean} Options.isAdmin - Whether the user is an admin
 * @param {object} Options.router - The router object
 */
export const getHistorySearchActions = ({
	queryValue = "",
	router,
	isAdmin,
}) => {
	// Show other actions based on numeric search...

	// Show Genric Transaction History Search Action if no query is entered
	if (queryValue?.length === 0) {
		// Show Genric Transaction History Search Action for Non-Admin users only
		return [
			// getKBarAction({
			// 	id: "chat",
			// 	name: "Chat with AI",
			// 	subtitle:
			// 		"Ask anything about your business, transactions, etc.",
			// 	keywords: "",
			// 	icon: "chat-outline", // "tid"
			// 	shortcut: ["Beta"],
			// 	// section: "History",
			// 	perform: () => router.push("/history"),
			// }),
			getKBarAction({
				id: "historySearch",
				name: "View Transaction History",
				subtitle:
					"Start typing TID, mobile, amount, etc., to search in History...",
				keywords: "",
				icon: "", // "tid"
				// section: "History",
				perform: () => router.push("/history"),
			}),
		];
	}

	// Remove formatters (commas and spaces) from the number query
	const unformattedNumberQuery = queryValue?.replace(/(?<=[0-9])[ ,]/g, "");
	const len = unformattedNumberQuery?.length ?? 0;
	const isDecimal = unformattedNumberQuery?.includes(".");
	const numQueryVal = Number(unformattedNumberQuery);

	// Check if the query is a valid number
	const isValidNumQuery =
		numQueryVal && Number.isFinite(numQueryVal) && len >= 1 && len <= 18;

	const results = [];

	if (isValidNumQuery) {
		// Show Transaction History Search Actions for Non-Admin users only

		if (len === 10 && /^[6-9]/.test(queryValue) && !isDecimal) {
			// Mobile number
			results.push(
				getKBarAction({
					id: "historySearch/mobile",
					name: "Search Transaction History by Mobile",
					subtitle: `Customer's Mobile = ${numQueryVal}`,
					// keywords: queryValue,
					icon: "", // "mobile"
					perform: () => {
						console.log("Mobile search clicked", router);
						const prefix = isAdmin ? "/admin" : "";
						router.push(
							`${prefix}/history?customer_mobile=${numQueryVal}`
						);
					},
				})
			);
		}

		if (len <= 7) {
			// Amount
			results.push(
				getKBarAction({
					id: "historySearch/amount",
					name: "Search Transaction History by Amount",
					subtitle: `Amount = ₹${numQueryVal}`,
					// keywords: queryValue,
					icon: "", // "amount"
					// section: "History",
					perform: () => {
						const prefix = isAdmin ? "/admin" : "";
						router.push(`${prefix}/history?amount=${numQueryVal}`);
					},
				})
			);
		}

		if (len === 10 && !isDecimal) {
			// TID
			results.push(
				getKBarAction({
					id: "historySearch/tid",
					name: "Search Transaction History by TID",
					subtitle: `TID = ${numQueryVal}`,
					// keywords: queryValue,
					icon: "", // "tid"
					// section: "History",
					perform: () => {
						const prefix = isAdmin ? "/admin" : "";
						router.push(`${prefix}/history?tid=${numQueryVal}`);
					},
				})
			);
		}

		if (len >= 9 && len <= 18 && !isDecimal) {
			// Account Number
			results.push(
				getKBarAction({
					id: "historySearch/account",
					name: "Search Transaction History by Account Number",
					subtitle: `Account Number = ${numQueryVal}`,
					// keywords: queryValue,
					icon: "", // "tid"
					// section: "History",
					perform: () => {
						const prefix = isAdmin ? "/admin" : "";
						router.push(`${prefix}/history?account=${numQueryVal}`);
					},
				})
			);
		}
	}

	return results;
};
