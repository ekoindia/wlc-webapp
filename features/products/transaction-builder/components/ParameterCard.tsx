import { Box, Flex, FormLabel, Input, Select, Switch } from "@chakra-ui/react";
import { Icon, IcoButton } from "components";
import { ParamType } from "constants/trxnFramework";
import { Reorder, useDragControls } from "framer-motion";
import { ChangeEvent } from "react";
import { createParameter, PARAM_TYPE_OPTIONS } from "../constants";
import { ConfigParameter } from "../types";

interface ParameterCardProps {
	param: ConfigParameter;
	/** Sibling params, used to re-derive defaults / ids when the type changes. */
	allParams: ConfigParameter[];
	onChange: (_next: ConfigParameter) => void;
	onRemove: () => void;
}

/**
 * An editable, draggable card for a single request parameter.
 * Drag is restricted to the handle (dragListener disabled) so the inner inputs stay usable.
 * @param {ParameterCardProps} props - Component props.
 * @returns {JSX.Element} The parameter card.
 */
const ParameterCard = ({
	param,
	allParams,
	onChange,
	onRemove,
}: ParameterCardProps): JSX.Element => {
	const dragControls = useDragControls();

	const update = (patch: Partial<ConfigParameter>): void => {
		onChange({ ...param, ...patch });
	};

	const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
		const nextType = Number(event.target.value) as ParamType;
		// Re-apply ParamMeta defaults for the new type while keeping id/label/name.
		const others = allParams.filter((p) => p.id !== param.id);
		const defaults = createParameter(nextType, others);
		onChange({
			...defaults,
			id: param.id,
			label: param.label,
			name: param.name,
			is_required: param.is_required,
			is_visible: param.is_visible,
		});
	};

	return (
		<Reorder.Item
			value={param}
			dragListener={false}
			dragControls={dragControls}
			style={{ listStyle: "none" }}
		>
			<Box
				borderWidth="1px"
				borderColor="gray.200"
				borderRadius="md"
				bg="white"
				p="3"
				mb="3"
			>
				<Flex align="center" gap="2" mb="2">
					<Box
						as="span"
						cursor="grab"
						onPointerDown={(e) => dragControls.start(e)}
						display="flex"
						alignItems="center"
						title="Drag to reorder"
					>
						<Icon name="drag-handle" size="sm" />
					</Box>
					<Box flex="1" fontWeight="semibold" fontSize="sm">
						{param.label || param.name || "Field"}
					</Box>
					<IcoButton
						iconName="delete"
						size="sm"
						theme="ghost"
						title="Remove field"
						onClick={onRemove}
					/>
				</Flex>

				<Flex gap="3" wrap="wrap">
					<Box flex="1" minW="160px">
						<FormLabel fontSize="xs" mb="1">
							Label
						</FormLabel>
						<Input
							size="sm"
							value={param.label}
							onChange={(e) => update({ label: e.target.value })}
						/>
					</Box>
					<Box flex="1" minW="160px">
						<FormLabel fontSize="xs" mb="1">
							Name
						</FormLabel>
						<Input
							size="sm"
							value={param.name}
							onChange={(e) => update({ name: e.target.value })}
						/>
					</Box>
					<Box flex="1" minW="160px">
						<FormLabel fontSize="xs" mb="1">
							Type
						</FormLabel>
						<Select
							size="sm"
							value={param.parameter_type_id}
							onChange={handleTypeChange}
						>
							{PARAM_TYPE_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</Select>
					</Box>
				</Flex>

				<Flex gap="6" mt="3" align="center">
					<Flex align="center" gap="2">
						<Switch
							size="sm"
							isChecked={param.is_required === "1"}
							onChange={(e) =>
								update({
									is_required: e.target.checked ? "1" : "0",
								})
							}
						/>
						<Box fontSize="sm">Required</Box>
					</Flex>
					<Flex align="center" gap="2">
						<Switch
							size="sm"
							isChecked={param.is_visible}
							onChange={(e) =>
								update({ is_visible: e.target.checked })
							}
						/>
						<Box fontSize="sm">Visible</Box>
					</Flex>
				</Flex>
			</Box>
		</Reorder.Item>
	);
};

export default ParameterCard;
