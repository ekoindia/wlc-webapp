import {
	Box,
	Flex,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { Button, InputLabel, Menus, Select } from "components";
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

const reasons = [
	{ value: "0", label: "Not Transacting anymore" },
	{ value: "1", label: "Wants to create a new account" },
	{ value: "2", label: "Management Request" },
	{ value: "3", label: "Requested by the person himself/herself" },
	{ value: "4", label: "Suspected Fraud" },
	{ value: "999", label: "Other" },
];

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

const getReason = (list, value) => {
	for (let item of list) {
		if (item.value === value) {
			return item.label;
		}
	}
	return null;
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
	const [reasonSelect, setReasonSelect] = useState(null);
	const [reasonInput, setReasonInput] = useState(null);
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
		const _reason =
			reasonSelect !== "999"
				? getReason(reasons, reasonSelect)
				: reasonInput;

		setOpen(false);
		setReasonSelect(null);

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"Content-Type": "application/json",
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents/updateStatus/eko_code:${eko_code}/status_id:${statusObj[clickedVal]}/descrip_note:${_reason}`,
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

	const handleSelect = (event) => {
		setReasonSelect(event.target.value);
	};

	const handleReasonInput = (event) => {
		setReasonInput(event.target.value);
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
						<Flex direction="column" gap="8">
							<Box>
								<InputLabel
									htmlFor="status-reason-select"
									fontWeight="medium"
									required
								>
									Reason for marking{" "}
									{clickedVal?.toLowerCase()}
								</InputLabel>
								<Select
									id="status-reason-select"
									options={reasons}
									onChange={handleSelect}
								></Select>
							</Box>
							{reasonSelect === "999" && (
								<Box>
									<InputLabel
										htmlFor="status-textarea"
										fontWeight="medium"
										required
									>
										Additional Details
									</InputLabel>
									<Textarea
										id="status-textarea"
										width="100%"
										resize="none"
										noOfLines={2}
										maxLength={100}
										onChange={handleReasonInput}
									/>
								</Box>
							)}
						</Flex>
					</ModalBody>
					<ModalFooter py="8">
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
