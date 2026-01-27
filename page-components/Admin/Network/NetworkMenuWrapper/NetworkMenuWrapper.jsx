import { Flex, IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import { Button, Menus, Modal } from "components";
import {
	ChangeRoleMenuList,
	Endpoints,
	ParamType,
	TransactionTypes,
} from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

const AGENT_STATUS_UPDATE_SUCCESSFULL = 1831;

const status = {
	PENDING_APPROVAL: 13,
	ACTIVE: 16,
	// CLOSE: 17,
	INACTIVE: 18,
};

const statusLabels = {
	13: "Pending Approval",
	16: "Active",
	// 17: "Close",
	18: "Inactive",
};

const reasons = [
	{ value: "0", label: "Not Transacting anymore" },
	{ value: "1", label: "Wants to create a new account" },
	{ value: "2", label: "Management Request" },
	{ value: "3", label: "Requested by the person themself" },
	{ value: "4", label: "Suspected Fraud" },
	{ value: "999", label: "Other" },
];

const generateMenuList = (list, statusId, extra, includeExtra, other) => {
	let _list = [];

	for (const listItem of list) {
		let _isArray = Array.isArray(listItem.id);
		let _id = _isArray ? listItem.id : [listItem.id];
		if (
			Object.values(status).includes(+statusId) &&
			!_id.includes(+statusId)
		) {
			_list.push(listItem);
		}
	}

	if (includeExtra) {
		_list.push(extra);
	}

	for (const ele of other) {
		if (ele?.visible) _list.push(ele);
	}

	return [..._list];
};

// const getStatus = (status) => {
// 	switch (status) {
// 		case 0:
// 			return "success";
// 		default:
// 			return "error";
// 	}
// };

/**
 * NetworkMenuWrapper component that provides a menu for managing agent network status and actions.
 * Allows admins to mark agents as Active/Inactive, change roles, view details, and download agreements.
 * @param {object} props - Component properties
 * @param {string} props.mobile_number - Mobile number of the agent
 * @param {string} props.eko_code - Unique EKO code identifier for the agent
 * @param {number} props.account_status_id - Current account status ID (13: Pending Approval, 16: Active, 18: Inactive)
 * @param {string} props.agent_type - Type/role of the agent
 * @param {Function} props.onStatusUpdate - Callback function invoked when status is updated. Receives (eko_code, new_status_id)
 * @returns {JSX.Element|undefined} Menu component or undefined if no menu items are available
 * @example
 * <NetworkMenuWrapper
 *   mobile_number="9876543210"
 *   eko_code="EKO123"
 *   account_status_id={16}
 *   agent_type="retailer"
 *   onStatusUpdate={(code, status) => console.log(code, status)}
 * />
 */
const NetworkMenuWrapper = ({
	mobile_number,
	eko_code,
	account_status_id,
	agent_type,
	onStatusUpdate,
}) => {
	const { onOpen } = useDisclosure();
	const [isOpen, setOpen] = useState(false);
	const [accountStatusId, setAccountStatusId] = useState();
	const { accessToken, isAdmin } = useSession();
	const router = useRouter();
	const toast = useToast();

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting },
	} = useForm();

	const watcher = useWatch({ control });

	const downloadAgreement = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id:
					TransactionTypes.DOWNLOAD_NETWORK_AGREEMENT,
				csp_code: eko_code,
			},
			token: accessToken,
		})
			.then((res) => {
				window.open(res?.data?.short_url, "_blank");
			})
			.catch((err) => {
				console.error("Error: ", err);
			});
	};

	const menuList = [
		{
			id: 16,
			value: 16,
			label: "Mark Active",
			onClick: (value) => {
				setOpen(true);
				setAccountStatusId(value);
			},
		},
		{
			id: [13, 18], // 13: Pending Approval, 18: Inactive
			value: 18,
			label: "Mark Inactive",
			onClick: (value) => {
				setOpen(true);
				setAccountStatusId(value);
			},
		},
	];

	const changeRoleMenuItem = {
		label: "Change Role",
		onClick: () => {
			router.push(
				`/admin/my-network/profile/change-role?mobile=${mobile_number}`
			);
		},
	};

	const others = [
		{
			label: "View Details",
			visible: true,
			onClick: () => {
				const pathname = isAdmin
					? "/admin/my-network/profile"
					: "/my-network/profile";
				router.push(`${pathname}?mobile=${mobile_number}`);
			},
		},
		{
			label: "Download Agreement",
			visible: account_status_id == status.ACTIVE,
			onClick: () => {
				downloadAgreement();
			},
		},
	];

	let _includeChangeRole = false;

	for (let { global, visibleString } of ChangeRoleMenuList) {
		if (isAdmin && !global && visibleString.includes(agent_type)) {
			_includeChangeRole = true;
			break;
		}
	}

	const _finalMenuList = generateMenuList(
		menuList,
		account_status_id,
		changeRoleMenuItem,
		_includeChangeRole,
		others
	);

	const parameter_list = [
		{
			name: "reason",
			label: `Reason for marking ${statusLabels[accountStatusId]}`,
			parameter_type_id: ParamType.LIST,
			list_elements: reasons,
			meta: {
				force_dropdown: true,
			},
			is_inactive: account_status_id == 18 || account_status_id == 13,
		},
		{
			name: "reason_input",
			label: "Additional Details",
			required: true,
			lines_min: 3,
			// visible_on_param_name: "reason",
			// visible_on_param_value: /999/, // Ideally this should be the code, need to fix select return value
			is_inactive:
				account_status_id == 16
					? watcher["reason"]?.value !== "999"
					: account_status_id == 18 || account_status_id == 13
						? false
						: true, // hack until I fix select
		},
	];

	const handleFormSubmit = (data) => {
		const { reason, reason_input } = data || {};

		const _reason =
			(account_status_id == 18 || account_status_id == 13) &&
			reason_input !== undefined
				? reason_input
				: account_status_id == 16 && reason?.value === "999"
					? reason_input
					: reason?.label;

		// Store previous status for rollback on failure
		const previousStatusId = account_status_id;
		const newStatusId = accountStatusId;

		// Close modal immediately - don't block user
		setOpen(false);

		// Optimistic update: Update UI immediately for all status changes
		if (onStatusUpdate) {
			onStatusUpdate(eko_code, newStatusId);
		}

		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION_JSON,
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
		)
			.then((res) => {
				// Check for successful response
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
					// API returned error - revert optimistic update
					toast({
						title: res.message || "Failed to update status",
						status: "error",
						duration: 6000,
						isClosable: true,
					});
					// Revert the optimistic update
					if (onStatusUpdate) {
						onStatusUpdate(eko_code, previousStatusId);
					}
				}
			})
			.catch((error) => {
				console.error("📡 Fetch Error:", error);
				// Revert optimistic update on network error
				toast({
					title: "Network error. Please try again.",
					status: "error",
					duration: 6000,
					isClosable: true,
				});
				if (onStatusUpdate) {
					onStatusUpdate(eko_code, previousStatusId);
				}
			});
	};

	if (_finalMenuList?.length < 1) return;

	return (
		<div>
			<Menus
				onOpen={onOpen}
				menulist={_finalMenuList}
				type="everted"
				as={IconButton}
				iconName="more-vert"
				minH={{ base: "25px", "2xl": "30px" }}
				minW={{ base: "25px", "2xl": "30px" }}
				width={{ base: "25px", "2xl": "30px" }}
				height={{ base: "25px", "2xl": "30px" }}
				onClick={(e) => {
					e.stopPropagation();
				}}
			/>
			<Modal
				isOpen={isOpen}
				onClose={() => setOpen(false)}
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
		</div>
	);
};

export default NetworkMenuWrapper;
