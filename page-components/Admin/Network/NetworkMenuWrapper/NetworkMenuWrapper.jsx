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

const statusObj = {
	Active: 16,
	// Close: 17,
	Inactive: 18,
};

const reasons = [
	{ value: "0", label: "Not Transacting anymore" },
	{ value: "1", label: "Wants to create a new account" },
	{ value: "2", label: "Management Request" },
	{ value: "3", label: "Requested by the person themself" },
	{ value: "4", label: "Suspected Fraud" },
	{ value: "999", label: "Other" },
];

const generateMenuList = (list, currId, extra, includeExtra) => {
	let _list = [];

	for (const listItem of list) {
		if (currId != undefined && listItem.id != currId) {
			_list.push(listItem);
		}
	}

	if (includeExtra) {
		_list.push(extra);
	}

	return _list;
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
	account_status,
	agent_type,
}) => {
	const { onOpen } = useDisclosure();
	const [isOpen, setOpen] = useState(false);
	const [clickedVal, setClickedVal] = useState();
	const { accessToken } = useSession();
	const router = useRouter();
	const toast = useToast();

	const menuList = [
		{
			id: 16,
			value: "Active",
			label: "Mark Active",
			onClick: (value) => {
				setOpen(true);
				setClickedVal(value);
			},
		},
		{
			id: 18,
			value: "Inactive",
			label: "Mark Inactive",
			onClick: (value) => {
				setOpen(true);
				setClickedVal(value);
			},
		},
	];

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting },
	} = useForm();

	const watcher = useWatch({ control });

	const changeRoleMenuItem = {
		label: "Change Role",
		onClick: () => {
			router.push(
				`/admin/my-network/profile/change-role?mobile=${mobile_number}`
			);
		},
	};

	const currId = statusObj[account_status];

	let _includeChangeRole = false;

	for (let { global, visibleString } of ChangeRoleMenuList) {
		if (!global && visibleString.includes(agent_type)) {
			_includeChangeRole = true;
			break;
		}
	}

	const _finalMenuList = generateMenuList(
		menuList,
		currId,
		changeRoleMenuItem,
		_includeChangeRole
	);

	const parameter_list = [
		{
			name: "reason",
			label: `Reason for marking ${clickedVal?.toLowerCase()}`,
			parameter_type_id: ParamType.LIST,
			list_elements: reasons,
			meta: {
				force_dropdown: true,
			},
			is_inactive: currId == 18,
		},
		{
			name: "reason_input",
			label: "Additional Details",
			required: true,
			lines_min: 3,
			// visible_on_param_name: "reason",
			// visible_on_param_value: /999/, // Ideally this should be the code, need to fix select return value
			validations: {
				required: true,
			},
			is_inactive:
				currId == 16
					? watcher["reason"]?.value !== "999"
					: currId == 18
					? false
					: true, // hack until I fix select
		},
	];

	const handleFormSubmit = (data) => {
		const { reason, reason_input } = data;

		const _reason =
			currId == 18 && reason_input !== undefined
				? reason_input
				: currId == 16 && reason?.value === "999"
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
					agentAccountStatus: statusObj[clickedVal],
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
						<span>Mark {clickedVal}</span>
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
