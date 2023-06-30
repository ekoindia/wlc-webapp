import {
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { Button, Menus } from "components";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useRouter } from "next/router";
import { useState } from "react";

const statusObj = {
	Active: 16,
	// Close: 17,
	Inactive: 18,
};

const generateMenuList = (list, id, extra) => {
	let _list = [];

	for (const listItem of list) {
		if (id !== undefined && listItem.id !== id) {
			_list.push(listItem);
		}
	}

	_list = [..._list, extra];

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
const NetworkMenuWrapper = ({ eko_code, account_status }) => {
	const [isOpen, setOpen] = useState(false);
	const { onOpen } = useDisclosure();
	const [clickedVal, setClickedVal] = useState();
	const [reason, setReason] = useState("");
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
			id: 17,
			value: "Inactive",
			label: "Mark Inactive",
			onClick: (value) => {
				setOpen(true);
				setClickedVal(value);
			},
		},
	];

	const extraMenuListItem = {
		label: "Change Role",
		onClick: () => {
			router.push("/admin/my-network/profile/change-role");
		},
	};

	const currId = statusObj[account_status];
	const _finalMenuList = generateMenuList(
		menuList,
		currId,
		extraMenuListItem
	);

	const handleSubmit = () => {
		setOpen(false);
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"Content-Type": "application/json",
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents/updateStatus/eko_code:${eko_code}/status_id:${statusObj[clickedVal]}/descrip_note:${reason}`,
				"tf-req-method": "PUT",
			},
			body: {
				user_code: eko_code,
			},
			token: accessToken,
		})
			.then((data) => {
				toast({
					title: data.message,
					status: getStatus(data.status),
					duration: 6000,
					isClosable: true,
				});
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
				size="lg"
				isCentered={true}
			>
				<ModalOverlay />
				<ModalContent
					width={{ base: "100%", md: "465px" }}
					height="auto"
					fontSize="sm"
				>
					<ModalHeader fontSize="lg" fontWeight="semibold">
						<span>Mark {clickedVal}</span>
					</ModalHeader>
					<ModalCloseButton color="hint" size="md" />
					<ModalBody>
						<Text fontWeight="medium">
							Reason for marking {clickedVal?.toLowerCase()}
						</Text>

						<Textarea
							h={{ base: "200px", md: "250px" }}
							width="100%"
							resize="none"
							maxLength={400}
							onChange={(e) => setReason(e.target.value)}
						/>
					</ModalBody>
					<ModalFooter py={{ base: 4, md: 8 }}>
						<Button
							size="lg"
							width="100%"
							fontSize="lg"
							onClick={handleSubmit}
						>
							Save now
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default NetworkMenuWrapper;
