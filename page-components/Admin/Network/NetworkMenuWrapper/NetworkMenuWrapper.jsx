import {
	Flex,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { Button, Menus } from "components";
import { ChangeRoleMenuList, Endpoints, ParamType } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

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

	return [..._list, other];
};

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

/**
 * A NetworkMenuWrapper component
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkMenuWrapper></NetworkMenuWrapper>`
 */
const NetworkMenuWrapper = ({
	mobile_number,
	eko_code,
	account_status_id,
	agent_type,
}) => {
	const { onOpen } = useDisclosure();
	const [isOpen, setOpen] = useState(false);
	const [accountStatusId, setAccountStatusId] = useState();
	const { accessToken } = useSession();
	const router = useRouter();
	const toast = useToast();

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting },
	} = useForm();

	const watcher = useWatch({ control });

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

	const others = {
		label: "View Details",
		onClick: () => {
			router.push(`/admin/my-network/profile?mobile=${mobile_number}`);
		},
	};

	let _includeChangeRole = false;

	for (let { global, visibleString } of ChangeRoleMenuList) {
		if (!global && visibleString.includes(agent_type)) {
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
		const { reason, reason_input } = data;

		const _reason =
			(account_status_id == 18 || account_status_id == 13) &&
			reason_input !== undefined
				? reason_input
				: account_status_id == 16 && reason?.value === "999"
					? reason_input
					: reason?.label;

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
				toast({
					title: res.message,
					status: getStatus(res.status),
					duration: 6000,
					isClosable: true,
				});
				if (res.status === 0) {
					setOpen(false);
					router.reload(window.location.pathname);
				}
			})
			.catch((error) => {
				console.error("📡 Fetch Error:", error);
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
				size={{ base: "sm", md: "lg" }}
				isCentered={true}
			>
				<ModalOverlay />
				<ModalContent height="auto" fontSize="sm">
					<ModalHeader fontSize="lg" fontWeight="semibold">
						<span>Mark {statusLabels[accountStatusId]}</span>
					</ModalHeader>
					<ModalCloseButton _hover={{ color: "error" }} />
					<ModalBody>
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
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default NetworkMenuWrapper;
