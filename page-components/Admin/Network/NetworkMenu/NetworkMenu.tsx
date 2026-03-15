import {
	Box,
	IconButton,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Portal,
} from "@chakra-ui/react";
import { Icon } from "components";
import { Endpoints, TransactionTypes } from "constants/index";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import useChangeRoleOptions from "page-components/Admin/ChangeRole/useChangeRoleOptions";
import React, { Fragment, useState } from "react";
import { DeleteDemoUserModal } from "./DeleteDemoUserModal";
import { StatusUpdateModal } from "./StatusUpdateModal";

const status = {
	PENDING_APPROVAL: 13,
	ACTIVE: 16,
	INACTIVE: 18,
	DEMO_USER: 60,
};

const statusLabels: Record<number, string> = {
	13: "Pending Approval",
	16: "Active",
	60: "Demo User",
	18: "Inactive",
};

const generateMenuList = (
	list: any[],
	statusId: number,
	extra: any,
	includeExtra: boolean,
	other: any[]
) => {
	let _list: any[] = [];

	for (const listItem of list) {
		let _isArray = Array.isArray(listItem.id);
		let _id = _isArray ? listItem.id : [listItem.id];

		const currentStatus = +statusId;

		if (
			currentStatus !== status.DEMO_USER &&
			Object.values(status).includes(currentStatus) &&
			!_id.includes(currentStatus)
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

interface NetworkMenuProps {
	mobile_number: string;
	eko_code: string;
	account_status_id: number;
	user_type_id: number;
	variant?:
		| "primary"
		| "accent"
		| "primary_outline"
		| "accent_outline"
		| "ghost"
		| "link";
	onStatusUpdate?: (_eko_code: string, _new_status_id: number) => void;
	onDeleteDemoUser?: (_eko_code: string) => void;
}

export const NetworkMenu: React.FC<NetworkMenuProps> = ({
	mobile_number,
	eko_code,
	account_status_id,
	user_type_id,
	variant = "primary",
	onStatusUpdate,
	onDeleteDemoUser,
}) => {
	const { AGENT_VIEW_TABS } = useChangeRoleOptions();
	const [isOpen, setOpen] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [accountStatusId, setAccountStatusId] = useState<number>(0);
	const { accessToken, isAdmin } = useSession();
	const router = useRouter();

	const downloadAgreement = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id:
					TransactionTypes.DOWNLOAD_NETWORK_AGREEMENT,
				csp_code: eko_code,
			},
			token: accessToken,
		})
			.then((res: any) => {
				window.open(res?.data?.short_url, "_blank");
			})
			.catch((err: any) => {
				console.error("Error: ", err);
			});
	};

	const menuList = [
		{
			id: 16,
			value: 16,
			label: "Mark Active",
			onClick: (value: number) => {
				setOpen(true);
				setAccountStatusId(value);
			},
		},
		{
			id: [13, 18], // 13: Pending Approval, 18: Inactive
			value: 18,
			label: "Mark Inactive",
			onClick: (value: number) => {
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
			visible: account_status_id === status.ACTIVE,
			onClick: () => {
				downloadAgreement();
			},
		},
		{
			label: "Delete Demo User",
			visible: +account_status_id === status.DEMO_USER,
			onClick: () => {
				setDeleteModalOpen(true);
			},
		},
	];

	let _includeChangeRole = false;

	if (isAdmin) {
		_includeChangeRole = AGENT_VIEW_TABS.some((tab: any) =>
			tab.allowedUserTypes.includes(+user_type_id)
		);
	}

	const _finalMenuList = generateMenuList(
		menuList,
		account_status_id,
		changeRoleMenuItem,
		_includeChangeRole,
		others
	);

	if (_finalMenuList?.length < 1) return null;

	return (
		<>
			<Box onClick={(e: any) => e.stopPropagation()}>
				<Menu autoSelect={false} isLazy variant={variant}>
					<MenuButton
						cursor="pointer"
						as={IconButton}
						rounded="8px"
						size="sm"
						variant={variant}
						colorScheme="gray"
						icon={<Icon name="more-vert" />}
					/>
					<Portal>
						<MenuList>
							{_finalMenuList.map((item, index) => (
								<Fragment
									key={item.id ?? `${index}-${item.label}`}
								>
									<MenuItem
										value={item.value}
										onClick={() => item.onClick(item.value)}
									>
										{item.label}
									</MenuItem>
									{index !== _finalMenuList.length - 1 && (
										<MenuDivider margin="auto" w="90%" />
									)}
								</Fragment>
							))}
						</MenuList>
					</Portal>
				</Menu>
			</Box>
			<StatusUpdateModal
				isOpen={isOpen}
				onClose={() => setOpen(false)}
				accountStatusId={accountStatusId}
				currentStatusId={account_status_id}
				eko_code={eko_code}
				accessToken={accessToken}
				statusLabels={statusLabels}
				onStatusUpdate={onStatusUpdate}
			/>
			<DeleteDemoUserModal
				isOpen={isDeleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				eko_code={eko_code}
				accessToken={accessToken}
				onDeleteDemoUser={onDeleteDemoUser}
			/>
		</>
	);
};

export default NetworkMenu;
