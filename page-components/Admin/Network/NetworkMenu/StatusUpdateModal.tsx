import { Flex, useToast } from "@chakra-ui/react";
import { Button, Modal } from "components";
import { Endpoints, ParamType } from "constants/index";
import { fetcher } from "helpers";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

const reasons = [
	{ value: "0", label: "Not Transacting anymore" },
	{ value: "1", label: "Wants to create a new account" },
	{ value: "2", label: "Management Request" },
	{ value: "3", label: "Requested by the person themself" },
	{ value: "4", label: "Suspected Fraud" },
	{ value: "999", label: "Other" },
];

const AGENT_STATUS_UPDATE_SUCCESSFULL = 1831;

interface StatusUpdateModalProps {
	isOpen: boolean;
	onClose: () => void;
	accountStatusId: number;
	currentStatusId: number;
	eko_code: string;
	accessToken: string;
	statusLabels: Record<number, string>;
	onStatusUpdate?: (_eko_code: string, _new_status_id: number) => void;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
	isOpen,
	onClose,
	accountStatusId,
	currentStatusId,
	eko_code,
	accessToken,
	statusLabels,
	onStatusUpdate,
}) => {
	const toast = useToast();

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting },
	} = useForm();

	const watcher = useWatch({ control });

	const parameter_list = [
		{
			name: "reason",
			label: `Reason for marking ${statusLabels[accountStatusId]}`,
			parameter_type_id: ParamType.LIST,
			list_elements: reasons,
			meta: {
				force_dropdown: true,
			},
			is_inactive: currentStatusId === 18 || currentStatusId === 13,
		},
		{
			name: "reason_input",
			label: "Additional Details",
			required: true,
			lines_min: 3,
			is_inactive:
				currentStatusId === 16
					? watcher["reason"]?.value !== "999"
					: currentStatusId === 18 || currentStatusId === 13
						? false
						: true,
		},
	];

	const handleFormSubmit = async (data: any) => {
		const { reason, reason_input } = data || {};

		const _reason =
			(currentStatusId === 18 || currentStatusId === 13) &&
			reason_input !== undefined
				? reason_input
				: currentStatusId === 16 && reason?.value === "999"
					? reason_input
					: reason?.label;

		const previousStatusId = currentStatusId;
		const newStatusId = accountStatusId;

		onClose();

		if (onStatusUpdate) {
			onStatusUpdate(eko_code, newStatusId);
		}

		try {
			const res = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL +
					Endpoints.TRANSACTION_JSON,
				{
					headers: {
						"tf-req-uri-root-path": "/ekoicici/v1",
						"tf-req-uri": `/network/agents/updateStatus`,
						"tf-req-method": "POST",
					},
					body: {
						csp_code: eko_code,
						agentAccountStatus: accountStatusId,
						updateStatusNote: _reason,
					},
					token: accessToken,
				}
			);

			const isSuccess =
				res.response_type_id === AGENT_STATUS_UPDATE_SUCCESSFULL &&
				res.status === 0;

			if (isSuccess) {
				toast({
					title: res.message || "Updated Status Successfully!",
					status: "success",
					duration: 6000,
					isClosable: true,
				});
			} else {
				toast({
					title: res.message || "Failed to update status",
					status: "error",
					duration: 6000,
					isClosable: true,
				});
				if (onStatusUpdate) {
					onStatusUpdate(eko_code, previousStatusId);
				}
			}
		} catch (error) {
			console.error("📡 Fetch Error:", error);
			toast({
				title: "Network error. Please try again.",
				status: "error",
				duration: 6000,
				isClosable: true,
			});
			if (onStatusUpdate) {
				onStatusUpdate(eko_code, previousStatusId);
			}
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Mark ${statusLabels[accountStatusId]}`}
		>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<Flex direction="column" gap="8" pb="4">
					<Form
						parameter_list={parameter_list}
						register={register}
						control={control}
						formValues={watcher}
						errors={errors}
					/>
					<Button
						type="submit"
						size="lg"
						width="100%"
						fontSize="lg"
						loading={isSubmitting}
					>
						Save
					</Button>
				</Flex>
			</form>
		</Modal>
	);
};
