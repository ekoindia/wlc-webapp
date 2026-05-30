import { Box, Flex, FormLabel, Input, Select, Text } from "@chakra-ui/react";
import { Button } from "components";
import { ParamType } from "constants/trxnFramework";
import { Reorder } from "framer-motion";
import { ChangeEvent, useState } from "react";
import { createParameter, PARAM_TYPE_OPTIONS } from "../constants";
import { ConfigParameter, InteractionConfig } from "../types";
import ParameterCard from "./ParameterCard";

interface InteractionConfigEditorProps {
	config: InteractionConfig;
	onChange: (_next: InteractionConfig) => void;
}

/**
 * Visual editor that builds an `interaction_config` object: edit the request label,
 * add fields from the parameter-type palette, reorder them by drag, and tweak each field.
 * All edits are immutable and bubble up via `onChange` (unknown keys preserved).
 * @param {InteractionConfigEditorProps} props - Component props.
 * @returns {JSX.Element} The editor UI.
 */
const InteractionConfigEditor = ({
	config,
	onChange,
}: InteractionConfigEditorProps): JSX.Element => {
	const [typeToAdd, setTypeToAdd] = useState<ParamType>(ParamType.TEXT);

	const params = config.request.parameter_list;

	const updateRequest = (
		patch: Partial<InteractionConfig["request"]>
	): void => {
		onChange({ ...config, request: { ...config.request, ...patch } });
	};

	const setParams = (parameter_list: ConfigParameter[]): void => {
		updateRequest({ parameter_list });
	};

	const handleAddField = (): void => {
		setParams([...params, createParameter(typeToAdd, params)]);
	};

	const handleParamChange = (next: ConfigParameter): void => {
		setParams(params.map((p) => (p.id === next.id ? next : p)));
	};

	const handleParamRemove = (id: number): void => {
		setParams(params.filter((p) => p.id !== id));
	};

	return (
		<Flex direction="column" gap="4" p="4" h="100%" overflowY="auto">
			{/* Request label */}
			<Box>
				<FormLabel fontSize="sm" mb="1">
					Transaction Label
				</FormLabel>
				<Input
					value={config.request.label}
					onChange={(e) => updateRequest({ label: e.target.value })}
					placeholder="e.g. Search Vendor"
				/>
			</Box>

			{/* Add-field palette */}
			<Flex align="flex-end" gap="2" p="3" bg="gray.50" borderRadius="md">
				<Box flex="1">
					<FormLabel fontSize="xs" mb="1">
						Add field
					</FormLabel>
					<Select
						value={typeToAdd}
						onChange={(e: ChangeEvent<HTMLSelectElement>) =>
							setTypeToAdd(Number(e.target.value) as ParamType)
						}
					>
						{PARAM_TYPE_OPTIONS.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</Select>
				</Box>
				<Button onClick={handleAddField}>Add</Button>
			</Flex>

			{/* Parameter list */}
			{params.length === 0 ? (
				<Text fontSize="sm" color="gray.500">
					No fields yet. Use “Add field” to build the transaction
					card.
				</Text>
			) : (
				<Reorder.Group
					axis="y"
					values={params}
					onReorder={setParams}
					style={{ padding: 0, margin: 0 }}
				>
					{params.map((param) => (
						<ParameterCard
							key={param.id}
							param={param}
							allParams={params}
							onChange={handleParamChange}
							onRemove={() => handleParamRemove(param.id)}
						/>
					))}
				</Reorder.Group>
			)}
		</Flex>
	);
};

export default InteractionConfigEditor;
