import { getKBarAction } from ".";

/**
 * Get KBar result action after evaluating a math expression
 * @param {object} options
 * @param {string} options.expr - The math expression
 * @param {Function} options.copy - The copy function from useClipboard
 * @param {Function} options.toast - Function to show a toast message
 * @param {Function} options.parse - Function to parse a math expression
 * @param {Function} options.setParse - Function to set the parse function after loading it dynamically
 * @param {string} options.parseLoadState - The load state of the parse function
 * @param {Function} options.setParseLoadState - Function to set the load state of the parse function
 */
export const getCalculatorAction = ({
	expr,
	copy,
	toast,
	parse,
	setParse,
	parseLoadState,
	setParseLoadState,
}) => {
	let result;

	// Lazy load the math parser
	if (parseLoadState === "") {
		setParseLoadState("loading");
		import("/utils/exprParser.js")
			.then((exprParser) => {
				// Update context values once exprParser is loaded
				setParse(() => exprParser.parse);
				setParseLoadState("loaded");
			})
			.catch((error) => {
				console.error(
					"[CalculatorAction] Error loading exprParser:",
					error
				);
				setParseLoadState("error");
			});
	}

	// Parse the expression if the parser is loaded
	if (expr && parse && parseLoadState === "loaded") {
		result = parse(expr);
	}

	return getKBarAction({
		id: "math/parse",
		name: result ? `${result}` : "Calculator",
		subtitle: result
			? `Result of ${expr}  (⏎ to copy)`
			: parseLoadState === "loading"
				? "Loading calculator..."
				: parseLoadState === "error"
					? "Error loading calculator!"
					: expr
						? "Error: Invalid expression!"
						: "Start typing an expression to calculate... (eg: =2+2)",
		icon: "calculator",
		iconSize: "lg",
		iconColor: "#7c3aed",
		perform: () => {
			if (result) {
				copy(result.toString());
				toast({
					title: "Result Copied: " + result,
					status: "success",
					duration: 2000,
				});
			}
		},
	});
};
