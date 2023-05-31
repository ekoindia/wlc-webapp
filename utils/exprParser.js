/**
 * Parse and evaluate a simple mathematical expression.
 * It supports the following operations: addition, subtraction, multiplication, division, and exponentiation. It also support parentheses.
 * @param {string} expression - The mathematical expression to parse and evaluate.
 * @returns {number} The result of the expression.
 * @example
 * 	parse("1 + 2 * 3"); // 7
 */
export const parse = (expression) => {
	try {
		// Tokenize the expression
		const tokens = tokenize(expression);

		// Parse the tokens into a tree
		const tree = parseTokens(tokens);

		// Evaluate the tree
		return evaluate(tree);
	} catch (error) {
		console.error("exprParser Error: ", error);
		return "";
	}
};

/**
 * Tokenize the given mathematical expression into numbers and operators.
 * @param {string} expression - The mathematical expression to tokenize.
 * @returns {Array} An array of numbers and operators in the expression.
 * @example
 * tokenize("1 + 2 * 3"); // ["1", "+", "2", "*", "3"]
 */
const tokenize = (expression) => {
	// The output array of tokens.
	let result = [];
	// Buffer to collect the digits of a number while scanning through the expression.
	let numberBuffer = [];

	// Iterate over each character in the expression.
	for (let char of expression) {
		// If the character is a digit, add it to the number buffer.
		if ("0123456789".includes(char)) {
			numberBuffer.push(char);
		} else {
			// If the character is not a digit, it must be an operator or a parenthesis.
			// Flush the number buffer to the result if it's not empty.
			if (numberBuffer.length) {
				result.push(numberBuffer.join(""));
				numberBuffer = [];
			}
			// Add the operator or parenthesis to the result.
			if ("+-*/%^()".includes(char)) {
				result.push(char);
			}
		}
	}

	// If there are still digits in the buffer after scanning the entire expression, flush them to the result.
	if (numberBuffer.length) {
		result.push(numberBuffer.join(""));
	}

	return result;
};

/**
 * Parse the given tokens into a tree.
 * @param {Array} tokens - The tokens to parse.
 * @returns {Object} The tree representing the tokens.
 * @example
 * parseTokens(["1", "+", "2", "*", "3"]); // { value: "+", left: "1", right: { value: "*", left: "2", right: "3" } }
 * 			// { value: "+", left: "1", right: { value: "*", left: "2", right: "3" } }
 * 			// { value: "*", left: "2", right: "3" }
 */
const parseTokens = (tokens) => {
	// The current index in the tokens array.
	let index = 0;

	// A helper function to parse an expression with operations of at least the given precedence.
	const parse = (precedence) => {
		// If the precedence is 0, the expression is a number.
		if (precedence === 0) {
			// Parse the number and return it.
			return parseNumber();
		}

		// Otherwise, the expression is an operation.
		// Parse the left side of the operation with the next precedence level.
		let left = parse(precedence - 1);

		// If the next token is an operator of the current precedence level, parse it.
		while (
			index < tokens.length &&
			precedenceOf(tokens[index]) === precedence
		) {
			// Parse the operator.
			let operator = parseOperator();

			// Parse the right side of the operation with the next precedence level.
			let right = parse(precedence - 1);

			// Combine the left and right sides into a tree.
			left = { value: operator, left, right };
		}

		// Return the left side of the operation.
		return left;
	};

	// A helper function to parse a number.
	const parseNumber = () => {
		// If the current token is a number, parse it.
		if (index < tokens.length && !isNaN(tokens[index])) {
			return tokens[index++];
		}
		// Otherwise, throw an error.
		throw new Error("Expected number: " + tokens[index]);
	};

	// A helper function to parse an operator.
	const parseOperator = () => {
		// If the current token is an operator, parse it.
		if (index < tokens.length && "+-*/%^".includes(tokens[index])) {
			return tokens[index++];
		}
		// Otherwise, throw an error.
		throw new Error("Expected operator");
	};

	// Parse the tokens with the highest precedence.
	return parse(3);
};

/**
 * Evaluate the given tree.
 * @param {Object} tree - The tree to evaluate.
 * @returns {number} The result of the tree.
 * @example
 * evaluate({ value: "+", left: "1", right: { value: "*", left: "2", right: "3" } }); // 7
 */
const evaluate = (tree) => {
	// If the tree is a number, return it.
	if (!isNaN(tree)) {
		return Number(tree);
	}

	// Otherwise, the tree is an operation.
	// Evaluate the left and right sides of the operation.
	let left = evaluate(tree.left);
	let right = evaluate(tree.right);

	// Perform the operation and return the result.
	switch (tree.value) {
		case "+":
			return left + right;
		case "-":
			return left - right;
		case "*":
			return left * right;
		case "/":
			return left / right;
		case "%":
			return left % right;
		case "^":
			return left ** right;
	}
};

const precedenceOf = (operator) => {
	switch (operator) {
		case "+":
		case "-":
			return 1;
		case "*":
		case "/":
		case "%":
			return 2;
		case "^":
			return 3;
	}
};
