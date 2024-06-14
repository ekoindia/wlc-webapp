/**
 * ExpressionEditor Component Module
 *
 * This module defines a React component for visually editing and constructing nested expressions.
 * The ExpressionEditor allows users to create complex expressions by nesting functions
 * within each other, providing a visual interface to manage the structure and parameters
 * of these expressions.
 *
 * The component is designed to be flexible and extensible, accommodating a wide range
 * of expression types and structures as defined in a JSON configuration. This configuration
 * specifies the available functions, their parameters, and whether they support an arbitrary
 * number of arguments, enabling the editor to adapt to different use cases and expression
 * languages.
 *
 * Key Features:
 * - Visual construction of nested expressions: Users can build expressions by adding and
 *   nesting functions in a visual format, enhancing the usability and accessibility of
 *   expression construction.
 * - Dynamic argument handling: Supports both fixed and arbitrary numbers of arguments,
 *   allowing for complex expression structures.
 * - Recursive function nesting: Enables deeply nested functions, allowing users to construct
 *   intricate expressions with multiple levels of nesting.
 * - Configurable through JSON: The editor's functionality and the set of available functions
 *   are defined through a JSON configuration, making it versatile and adaptable to various
 *   expression-building needs.
 *
 * Usage:
 * The component is used in applications where users need to construct or edit expressions
 * visually, such as in programming tools, data analysis software, or any application that
 * requires complex rule or expression definition.
 */
import { AddIcon, DeleteIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
	Box,
	// Button,
	Center,
	Flex,
	Heading,
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Select,
	Switch,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { Button, Input } from "components";
import { useFeatureFlag, useHslColor } from "hooks";
import { Fragment, useEffect, useState } from "react";
import { Md123, MdAbc, MdDataObject, MdMoreVert } from "react-icons/md";
import {
	PiBracketsAngleFill,
	PiBroomBold,
	PiFunctionFill,
	PiListNumbersFill,
	PiTextboxFill,
} from "react-icons/pi";
import { TbMobiledata, TbPlusEqual, TbRegex } from "react-icons/tb";
import functionsConfig from "./functionsConfig";

// Map of function categories to their respective icons.
const functionCategories = {
	"Flow Control": PiListNumbersFill,
	"Logical Operations": PiBracketsAngleFill,
	"Numerical Operations": TbPlusEqual,
	"Other Numerical Operations": TbPlusEqual,
	"String Operations": PiTextboxFill,
	"Data Convertion": TbMobiledata,
	"Regular Expressions": TbRegex,
	"Array/Object": MdDataObject,
	"Other Operations": PiFunctionFill,
};

/**
 * Function to recursively convert the expression to a stack array format
 * @param {object} expr - The expression object to convert
 * @returns {Array} - The stack array representation of the expression
 * @example OUTPUT: ["add", 1, ["mul", 2, 3]]
 */
const convertToStackArray = (expr) => {
	if (expr.nodeType === "function") {
		return [
			expr.functionType,
			...(expr.args || []).map((param) => convertToStackArray(param)),
		];
	} else if (expr.nodeType === "value") {
		let value = expr.value;
		if (expr.dataType === "number" && typeof value === "string") {
			value = parseFloat(value);
		} else if (expr.dataType === "bool" && typeof value === "string") {
			value = value === "true";
		} else if (expr.dataType === "object" && typeof value === "string") {
			try {
				value = JSON.parse(value);
			} catch (e) {
				console.error("Error parsing object value: ", e);
			}
		}
		return value;
	}
};

/**
 * Main component for the Expression Editor. Manages state for selected functions
 * and renders the function selector and expression builder.
 * @param {object} props - Component props.
 * @param {string} props.header - The header text for the editor.
 */
function ExpressionEditor({ header = "Expression Editor" }) {
	// Check if the feature flag is enabled
	const [isFeatureEnabled] = useFeatureFlag("EXPRESSION_EDITOR");

	// State to manage the current expression structure created by the user
	const [expression, setExpression] = useState({
		nodeType: "function", // New expression must start with a function
		types: ["function"], // Only functions are allowed in the root expression
		root: true, // Indicates that this is the root expression block
	});

	// State to manage the stack array representation of the expression.
	// It is auto-calculated whenever the expression changes.
	const [stackArrayExpression, setStackArrayExpression] = useState([]);

	// Update the stack array expression whenever the main expression changes
	useEffect(() => {
		const newStackArray = convertToStackArray(expression);
		setStackArrayExpression(newStackArray);
	}, [expression]);

	/**
	 * Handles changes to the expression structure.
	 * @param {object} newExpressionBlock - The updated sub-expression object at the given path
	 * @param {Array} path - The path to the sub-expression block being changed.
	 */
	const handleExpressionChange = (newExpressionBlock, path) => {
		// Update the expression with the new structure at the given path.
		// The path is an array of indices indicating the position of the expression block.
		// For example, [0, 1, 2] would refer to the third argument of the second argument of the first function.

		console.log("Expression changed:: ", path, newExpressionBlock);

		if (!path || path.length === 0) {
			setExpression(newExpressionBlock);
			console.log("Setting Base Expression: ", newExpressionBlock);
			return;
		}

		let newExpression = { ...expression };

		// Traverse the path to the target expression block
		let currentBlock = newExpression;
		for (let i = 0; i < path.length - 1; i++) {
			currentBlock = currentBlock[path[i]];
		}

		// Update the target expression block
		currentBlock[path[path.length - 1]] = {
			...currentBlock[path[path.length - 1]],
			...newExpressionBlock,
		};

		setExpression(newExpression);
	};

	/**
	 * Handles changes to an (sub)expression parameter value.
	 * @param {any} newValue - The updated value for the sub-expression object (of nodeType "value")
	 * @param {Array} path - The path to the sub-expression block being changed.
	 */
	const handleValueChange = (newValue, path) => {
		console.log("Value changed:: ", path, newValue);

		let newExpression = { ...expression };

		// Traverse the path to the target expression block
		let currentBlock = newExpression;
		for (let i = 0; i < path.length - 1; i++) {
			currentBlock = currentBlock[path[i]];
		}

		// Update the target expression block
		currentBlock[path[path.length - 1]] = {
			...currentBlock[path[path.length - 1]],
			value: newValue,
		};

		setExpression(newExpression);
	};

	/**
	 * Handles removing an argument from a function block at the given path.
	 * @param {Array} path - The path to the argument in a function block which is to be removed.
	 */
	const handleRemoveArg = (path) => {
		console.log("Remove arg:: ", path);

		let newExpression = { ...expression };

		// Traverse the path to the target expression block
		let currentBlock = newExpression;
		for (let i = 0; i < path.length - 2; i++) {
			currentBlock = currentBlock[path[i]];
		}

		// Remove the target argument from the function block
		// console.log(
		// 	"Block to remove arg from: ",
		// 	currentBlock,
		// 	path[path.length - 1],
		// 	currentBlock.args[path[path.length - 1]]
		// );
		currentBlock.args = currentBlock.args.filter(
			(arg, index) => index !== path[path.length - 1]
		);
		setExpression(newExpression);
	};

	// If the feature is disabled, return a message indicating that the feature is not available
	if (!isFeatureEnabled) {
		return <Box p="2em">Feature not available</Box>;
	}

	// Render the main Expression Editor card
	return (
		<Box boxSizing="border-box" w="100%" maxW="100%" p={{ base: 2, md: 6 }}>
			<Box
				boxSizing="border-box"
				p={{ base: 2, md: 6 }}
				w="100%"
				maxW="100%"
				bg="white"
				borderRadius="4px"
				boxShadow="md"
				overflowX="auto"
			>
				<Heading mb={10}>{header}</Heading>

				<ExpressionBlock
					expressionBlock={expression}
					path={[]}
					functionsConfig={functionsConfig}
					onExpressionChange={handleExpressionChange}
					onValueChange={handleValueChange}
					onRemoveArg={handleRemoveArg}
				/>

				<Box as="pre" mt={8} fontSize="9px">
					{JSON.stringify(stackArrayExpression, null, 0)}
				</Box>

				<Box as="pre" mt={8} fontSize="9px">
					{JSON.stringify(expression, null, 2)}
				</Box>
			</Box>
		</Box>
	);
}

/**
 * ExpressionBlock component a single expression block. It could be a function or a value.
 * @param {object} props - Component props.
 * @param {object} props.expressionBlock - The sub-expression object for this block.
 * @param {Function} props.onExpressionChange - Callback to handle changes in the expression.
 * @param {Function} props.onValueChange - Callback to handle changes in the value of the expression block.
 * @param {Function} props.onRemoveArg - Callback to remove the current argument from the expression block.
 * @param {Array} props.path - The path to this expression block in the overall expression.
 * @param {object} props.functionsConfig - Configuration object for all possible functions.
 */
function ExpressionBlock({
	expressionBlock,
	onExpressionChange,
	onValueChange,
	onRemoveArg,
	path,
	functionsConfig,
}) {
	/**
	 * Sets the nodeType of the expression block (function or value).
	 * @param {string} nodeType - The type of the expression block: "function" or "value". Value can be "string", "number", "bool", etc, as per the dataType.
	 * @param {string} dataType - The data type of the expression block (for value type): "string", "number", "bool", etc.
	 */
	const setExpressionType = (nodeType, dataType) => {
		const newExpressionBlock = {
			...expressionBlock,
			nodeType: nodeType,
		};
		if (nodeType === "value") {
			newExpressionBlock.dataType = dataType;
		}
		// if (nodeType === "function") {
		// 	newExpressionBlock.label = "";
		// }
		onExpressionChange(newExpressionBlock, path);
	};

	/**
	 * Sets the value of the expression block.
	 * @param {any} value - The value to set for the expression block.
	 * @param {Array} newPath - The path to the sub-expression block being changed.
	 * If newPath is provided, it will be used as the path instead of the current path.
	 * This is useful when the value is coming from a nested block.
	 * For example, when a nested function block changes its value, it should update the parent function's argument.
	 */
	const setValue = (value, newPath) => {
		console.log("setValue:: ", {
			value,
			newPath,
			path,
			nodeType: expressionBlock.nodeType,
		});

		// if (!(expressionBlock.nodeType === "value")) {
		// 	return;
		// }
		onValueChange(value, newPath ? newPath : path);
	};

	/**
	 * Updates the state of the function block for the expression.
	 * @param {object} newFunctionBlock - The updated function block object.
	 */
	const setFunctionBlock = (newFunctionBlock) => {
		if (!(expressionBlock.nodeType === "function")) {
			return;
		}

		const newExpressionBlock = {
			...expressionBlock,
			...newFunctionBlock,
		};
		onExpressionChange(newExpressionBlock, path);
	};

	if (expressionBlock.nodeType === "function") {
		// RENDER FUNCTION BLOCK
		return (
			<FunctionBlock
				functionBlock={expressionBlock}
				onChange={setFunctionBlock}
				onValueChange={setValue}
				onRemoveArg={(newPath) => onRemoveArg(newPath)}
				functionsConfig={functionsConfig}
				path={path}
			/>
		);
	} else if (expressionBlock.nodeType === "value") {
		// RENDER VALUE BLOCK
		return (
			<ExpressionParamInput
				arg={expressionBlock}
				onChange={setValue}
				onRemove={() => onRemoveArg(path)}
			/>
		);
	} else {
		// RENDER BLOCK TYPE SELECTOR (Function or Value)
		return (
			<ExpressionTypeSelector
				onTypeChange={setExpressionType}
				isRemovable={expressionBlock.additionalParam}
				onRemove={() => onRemoveArg(path)}
			/>
		);
	}
}

/**
 * ExpressionParamInput component to render an input field for a function argument.
 * @param {object} props - Component props.
 * @param {object} props.arg - The argument object.
 * @param {Function} props.onChange - Callback to handle changes in the argument.
 * @param {Function} props.onRemove - Callback to remove the argument.
 */
function ExpressionParamInput({ arg, onChange, onRemove }) {
	return (
		<Flex direction="row" align="center" mt="-4px">
			{arg.dataType === "bool" ? (
				<Flex align={false} fontSize="0.8em">
					<Text>False</Text>
					<Switch
						isChecked={arg.value || false}
						mx={3}
						isRequired={true}
						onChange={(e) => onChange(e.target.checked)}
					/>
					<Text>True</Text>
				</Flex>
			) : (
				<Input
					// label={arg.label}
					value={arg.value}
					description={arg.desc}
					w={{ base: "100%", md: "250px" }}
					size="md"
					labelStyle={{ mb: 1, fontSize: "12px" }}
					type={arg.dataType === "number" ? "number" : "text"}
					maxLength={250}
					required={true} // {arg.optional ? false : true}
					autocomplete="off"
					autocorrect="off"
					autocapitalize="none"
					spellcheck="false"
					leftAddon={
						arg.dataType === "number" ? (
							<Md123 size="24px" />
						) : (
							<MdAbc size="24px" />
						)
					}
					onChange={(e) => onChange(e.target.value)}
				/>
			)}
			{arg.additionalParam ? (
				// Show a delete icon for additionally added parameters
				<DeleteIcoButton
					tooltip="Delete this extra argument"
					onClick={onRemove}
				/>
			) : null}
		</Flex>
	);
}

/**
 * FunctionBlock component to render a function block.
 * It can contain zero or more arguments. Each argument is a nested ExpressionBlock.
 * It shows as a box with the function name and a list of vertically aligned argument blocks.
 * @param {object} props - Component props.
 * @param {string} props.functionBlock - The expression sub-block of nodeType function, containing the function name and arguments.
 * @param {Function} props.onChange - Callback to handle changes in the current function block.
 * @param {Function} props.onValueChange - Callback to handle changes in the value of an argument.
 * @param {Function} props.onRemoveArg - Callback to remove an argument from the function block.
 * @param {object} props.functionsConfig - Configuration object for all possible functions.
 * @param {Array} props.path - The path to this function block in the overall expression.
 */
function FunctionBlock({
	functionBlock,
	onChange,
	onValueChange,
	onRemoveArg,
	functionsConfig,
	path,
}) {
	const { h: hue } = useHslColor(functionBlock.functionType || "function");

	const arg_label = functionBlock.functionType === "seq" ? "Step" : "Arg";

	console.log(
		"HUE:::: ",
		hue,
		functionBlock.functionType || "function",
		functionBlock
	);

	/**
	 * Appends a new argument to the function block (wherever variable number of args are supported).
	 */
	const handleArgAdd = () => {
		if (
			!(functionBlock.add_args && functionBlock.add_args.args?.length > 0)
		) {
			return;
		}

		// Get last parameter to repeat
		// const lastArgs = functionBlock.args[functionBlock.args.length - 1];

		const argsToAdd = functionBlock.add_args.args.map((arg) => ({
			...arg,
			nodeType:
				arg.types.length === 1 && arg.types[0] === "function"
					? "function"
					: "",
			value: "",
			additionalParam: true, // Indicates that this is an additionally added parameter
		}));

		const newArgs = [...functionBlock.args, ...argsToAdd];
		onChange({ ...functionBlock, args: newArgs });
	};

	/**
	 * Handles changes to an argument in the function block.
	 * @param {object} newArgBlock - The updated argument object.
	 * @param {number} index - The index of the argument being changed.
	 */
	const handleParamChange = (newArgBlock, index) => {
		console.log("handleParamChange:: ", newArgBlock, index);

		const newArgs = [...functionBlock.args];
		newArgs[index] = {
			...newArgs[index],
			...newArgBlock,
		};

		onChange({ ...functionBlock, args: newArgs });
	};

	/**
	 * Handle function-type select.
	 * @param {string} selectedFunctionName - The name of the selected function.
	 * @param {object} selectedFunctionBlock - The configuration object for the selected function.
	 */
	const handleFunctionSelect = (
		selectedFunctionName,
		selectedFunctionBlock
	) => {
		const newFunctionBlock = {
			...functionBlock,
			...selectedFunctionBlock,
			functionType: selectedFunctionName,
		};
		newFunctionBlock?.args?.forEach((arg, index) => {
			const isFunctionType =
				arg.types.length === 1 && arg.types[0] === "function";
			newFunctionBlock.args[index] = {
				...newFunctionBlock.args[index],
				// dataType: arg.type,
				nodeType: isFunctionType ? "function" : "",
				// name: arg.type === "function" ? "" : arg.label,
			};
		});
		onChange(newFunctionBlock);
	};

	/**
	 * Handle function reset. Reset type & value of all arguments from the function block.
	 */
	const handleFunctionReset = () => {
		const newFunctionBlock = {
			...functionBlock,
			args: functionBlock.args.map((arg) => ({
				...arg,
				nodeType: "",
				value: "",
			})),
		};
		onChange(newFunctionBlock);
	};

	/**
	 * Handle function delete. Reset the function block and ask user to select the block type again (function or value).
	 */
	const handleFunctionDelete = () => {
		const newFunctionBlock = {
			...functionBlock,
			nodeType:
				functionBlock.types?.length === 1 &&
				functionBlock.types[0] === "function"
					? "function"
					: "",
			functionType: "",
			value: "",
			args: [],
			example: "",
		};
		onChange(newFunctionBlock);
	};

	// Invalid function block
	if (!functionBlock || functionBlock.nodeType !== "function") {
		return null;
	}

	// Initial function block: select function name
	if (!functionBlock.functionType) {
		return (
			<FunctionContainerBox functionBlock={functionBlock}>
				<FunctionSelector
					onFunctionSelect={handleFunctionSelect}
					functionsConfig={functionsConfig}
				/>
			</FunctionContainerBox>
		);
	}

	// Proper function block with the functionType selected...
	return (
		<FunctionContainerBox
			functionBlock={functionBlock}
			hue={hue}
			onReset={handleFunctionReset}
			onDelete={handleFunctionDelete}
		>
			{/* Render Function Parameters */}
			{functionBlock?.args?.map((arg, index) => (
				<Flex direction="column" key={index} gap={3} ml={3}>
					<Flex align="center">
						<Flex
							align="center"
							fontSize="10px"
							fontWeight={700}
							bg={`hsl(${hue},80%,75%)`} // "#b2a429"
							color="#333"
							border={`1px solid hsl(${hue},80%,65%)`}
							borderRadius="full"
							px="4px"
						>
							{arg_label} {index + 1}
						</Flex>
						<Text
							ml={2}
							fontSize="12px"
							fontWeight={600}
							textTransform="capitalize"
						>
							{arg.label}
						</Text>
					</Flex>
					<ExpressionBlock
						key={index}
						expressionBlock={arg}
						onExpressionChange={(newArgBlock) =>
							handleParamChange(newArgBlock, index)
						}
						onValueChange={onValueChange}
						onRemoveArg={onRemoveArg}
						path={[...path, "args", index]}
						functionsConfig={functionsConfig}
					/>
				</Flex>
			))}

			{functionBlock.add_args &&
			functionBlock.add_args.args?.length > 0 ? (
				<Flex justify="space-between" align="center" mt={3}>
					<Button
						variant="accent"
						boxShadow="lg"
						size="sm"
						onClick={handleArgAdd}
					>
						<Icon as={AddIcon} w={3} h={3} mr={2} />
						Add {functionBlock.add_args.label || "Argument"}
					</Button>
				</Flex>
			) : null}
		</FunctionContainerBox>
	);
}

/**
 * ExpressionTypeSelector component allows the user to choose the type of expression block (nodeType).
 * @param {object} props - Component props.
 * @param {Function} props.onTypeChange - Callback function to handle nodeType selection. It passes the new nodeType as an argument (eg: "function" or "value").
 * @param {boolean} props.isRemovable - Indicates whether the block can be removed.
 * @param {Function} props.onRemove - Callback function to remove the block.
 */
function ExpressionTypeSelector({ onTypeChange, isRemovable, onRemove }) {
	// Show two buttons: "Add Function" and "Add Value"
	const expressionTypes = [
		{ label: "Text", nodeType: "value", dataType: "string" },
		{ label: "Number", nodeType: "value", dataType: "number" },
		{ label: "Boolean", nodeType: "value", dataType: "bool" },
		// { label: "External Value", nodeType: "value", dataType: "" },
		{ label: "Sub-Function", nodeType: "function", dataType: "" },
	];

	return (
		<Flex gap={2} align="center">
			{expressionTypes.map((expType) => (
				<Button
					key={expType.label}
					size="sm"
					variant="outline"
					borderColor="accent.light"
					borderWidth="2px"
					onClick={() =>
						onTypeChange(expType.nodeType, expType.dataType)
					}
				>
					{expType.label}
				</Button>
			))}

			{isRemovable ? (
				// Show a delete icon for additionally added parameters
				<DeleteIcoButton
					tooltip="Delete this extra argument"
					onClick={onRemove}
				/>
			) : null}
		</Flex>
	);
}

/**
 * FunctionSelector component renders a list of functions for the user to choose from.
 * @param {object} props - Component props.
 * @param {Function} props.onFunctionSelect - Callback function to handle function selection.
 * @param {object} props.functionsConfig - Configuration object for functions.
 */
function FunctionSelector({ onFunctionSelect, functionsConfig }) {
	// Convert the functionsConfig object into an array of categories with sub-arrays of functions
	let lastCategory = null;
	let acculumatedFunctions = [];
	const functionCategories = Object.entries(functionsConfig).reduce(
		(acc, [funcName, funcConfig], i, func_list) => {
			const category = funcConfig.category || "Other Operations";
			if (category !== lastCategory && acculumatedFunctions.length > 0) {
				// If category changes, add the accumulated functions to the list
				acc.push({
					category: lastCategory,
					functions: acculumatedFunctions,
				});
				acculumatedFunctions = [];
			} else if (i === func_list.length - 1) {
				// If it's the last function in the list, add the accumulated functions & the current (last) function to the list
				acc.push({
					category: category,
					functions: [
						...acculumatedFunctions,
						{ ...funcConfig, name: funcName },
					],
				});
			}

			lastCategory = category;
			acculumatedFunctions.push({
				...funcConfig,
				name: funcName,
			});
			return acc;
		},
		[]
	);

	return (
		<Flex alignItems="center">
			{/* <Icon as={AddIcon} w={5} h={5} mr={2} /> */}
			<Select
				placeholder="Select a Function"
				w={{ base: "100%", md: "250px" }}
				onChange={(e) =>
					onFunctionSelect(
						e.target.value,
						functionsConfig[e.target.value]
					)
				}
			>
				{functionCategories.map((category) => (
					<Fragment key={category.category}>
						<optgroup label={category.category}>
							{category.functions.map((funcConfig) => (
								<option
									key={funcConfig.name}
									value={funcConfig.name}
								>
									{funcConfig.label || funcConfig.name}
								</option>
							))}
						</optgroup>
					</Fragment>
				))}
			</Select>
		</Flex>
	);
}

/**
 * Visual representation of the function block.
 * @param {*} functionBlock - The function object
 * @param {*} hue - The hue value for the function block border, header & toolbars
 * @param {*} onReset - Reset the function block (clear all arguments from this function block)
 * @param {*} onDelete - Delete the function block. Ask user to select the block type again (function or value)
 * @param {*} children
 * @param {*} rest
 */
const FunctionContainerBox = ({
	functionBlock,
	hue,
	onReset,
	onDelete,
	children,
	...rest
}) => {
	const [isValid, setIsValid] = useState(false); // Validation state for the block
	const [error, setError] = useState(""); // Error message for the block
	// const [expanded, setExpanded] = useState(true); // Expanded state for the block

	// Validate the expression block whenever it changes
	useEffect(() => {
		// Check if the functionType is set
		if (!functionBlock.functionType) {
			setIsValid(false);
			setError("Please select a function");
			return;
		}

		// Check if all arguments are have a valid nodeType
		if (functionBlock.args) {
			const valid = functionBlock.args.every((arg) => arg.nodeType);
			setIsValid(valid);
			if (!valid) {
				setError(
					"Select all argument types for this function: a sub-function or a value"
				);
			}
		}
	}, [functionBlock.functionType, functionBlock.args]);

	return (
		<Box
			display="inline-block"
			position="relative"
			border="3px solid"
			borderColor={
				functionBlock.functionType ? `hsl(${hue},80%,75%)` : "#cfd8dc"
			}
			borderRadius="4px"
			bg={isValid ? "#FFF" : "#f9a8b020"}
			p={4}
			pt="35px"
			boxShadow="rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset"
			{...rest}
		>
			{/* FUNCTION HEADER - Name & Toolbar */}
			<Flex
				position="absolute"
				top="0px"
				left="0px"
				right="0px"
				h="25px"
				align="center"
				justify="space-between"
			>
				<Tooltip
					// label={functionBlock.desc}
					// isDisabled={functionBlock.functionType ? false : true}
					label={error}
					isDisabled={isValid}
					openDelay={300}
					hasArrow
				>
					<Center
						px={1}
						h="25px"
						fontSize={12}
						fontWeight={700}
						// bg="#90caf980"
						bg={
							functionBlock.functionType
								? `hsl(${hue},80%,75%)`
								: "#cfd8dc"
						}
						color="#222"
						borderRadius="0  0 4px 0"
					>
						<CategoryIcon
							category={functionBlock.category}
							fontSize={16}
							mr={2}
						/>
						{/* <Icon as={PiFunctionFill} fontSize={16} mr={1} /> */}
						<Text userSelect="none" textTransform="capitalize">
							{functionBlock.functionType
								? functionBlock.label ||
									functionBlock.functionType
								: "Function"}
						</Text>
						{isValid ? null : (
							<WarningTwoIcon
								ml={2}
								fontSize={12}
								color="error"
							/>
						)}
					</Center>
				</Tooltip>

				{/* FUNCTION TOOLBAR - Reset, Delete, etc */}
				{functionBlock.functionType ? (
					<Menu>
						<MenuButton
							as={IconButton}
							isRound
							aria-label="Options"
							size="xs"
							icon={<MdMoreVert size="16px" />}
							variant="ghost"
							bg="transparent"
							boxShadow="none"
							isLazy
						/>
						<MenuList>
							<MenuItem
								icon={<PiBroomBold />}
								color="error"
								onClick={onReset}
							>
								Reset Block
							</MenuItem>
							<MenuItem
								icon={<DeleteIcon />}
								color="error"
								onClick={onDelete}
							>
								Delete Block
							</MenuItem>
						</MenuList>
					</Menu>
				) : null}
			</Flex>

			{/* FUNCTION DESCRIPTION */}
			{functionBlock.functionType && functionBlock.desc ? (
				<Text
					mb={3}
					fontSize={11}
					color="#666"
					maxW={{ base: "100%", md: "350px", lg: "450px" }}
				>
					{functionBlock.desc}
				</Text>
			) : null}

			<Flex
				direction="column"
				w="100%"
				gap={4}
				pt={4}
				borderTop="1px solid #66666610"
			>
				{children}
			</Flex>
		</Box>
	);
};

const CategoryIcon = ({ category, ...rest }) => {
	const CatIcon =
		category in functionCategories
			? functionCategories[category]
			: PiFunctionFill;
	return <Icon as={CatIcon} {...rest} />;
};

/**
 * Delete icon component
 * @param {props} props
 * @param {string} props.tooltip - The tooltip text for the delete icon.
 * @param {Function} props.onClick - The callback function to handle the delete action.
 */
function DeleteIcoButton({ tooltip, onClick }) {
	return (
		<Tooltip label={tooltip || "Remove"} openDelay={300} hasArrow>
			<Center ml={4} cursor="pointer" w="30px" h="30px" onClick={onClick}>
				<DeleteIcon color="error" />
			</Center>
		</Tooltip>
	);
}

export default ExpressionEditor;
