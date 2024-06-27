import jsep from "jsep";

/**
 * Parse and evaluate a simple mathematical expression.
 * It supports the following operations: addition, subtraction, multiplication, division, and exponentiation. It also support parentheses.
 * @param {string} expression - The mathematical expression to parse and evaluate.
 * @returns {number} The result of the expression.
 * @example
 * 	parse("1 + 2 * 3"); // 7
 */
export const parse = (expression) => {
	if (!expression) return "";

	try {
		// Parse the expression
		const tree = jsep(expression);

		// Evaluate the tree
		return evaluate(tree);
	} catch (error) {
		console.error("exprParser Error: ", error);
		return "";
	}
};

/**
 * Evaluate the given tree.
 * @param {object} tree - The tree to evaluate.
 * @returns {number} The result of the tree.
 * @example
 * evaluate({ value: "+", left: "1", right: { value: "*", left: "2", right: "3" } }); // 7
 */
const evaluate = (tree) => {
	// If the tree is a number, return it.
	// if (!isNaN(tree)) {
	// 	return Number(tree);
	// }
	if (tree.type === "Literal") {
		return Number(tree.value);
	}

	// Otherwise, the tree is an operation.
	// Evaluate the left and right sides of the operation.
	let left = evaluate(tree.left);
	let right = evaluate(tree.right);

	// Perform the operation and return the result.
	if (tree.type === "BinaryExpression") {
		switch (tree.operator) {
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
	} else if (tree.type === "UnaryExpression") {
		switch (tree.operator) {
			case "+":
				return +right;
			case "-":
				return -right;
		}
	}
};
