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
} from "@chakra-ui/react";
import { Buttons } from "components/Buttons";
import { Menus } from "components/Menus";
import { Endpoints } from "constants/EndPoints";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useState } from "react";

/**
 * A <NetworkMenuWrapper> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkMenuWrapper></NetworkMenuWrapper>`
 */

const NetworkMenuWrapper = (props) => {
	const { eko_code } = props;
	// console.log("eko_code in networkmenu", eko_code);
	const menuList = [
		{
			item: "Proceed",
			path: "",
		},
		{
			item: "Mark Inactive",
			handleClick: () => {
				setOpen(true);
			},
		},
		{
			item: "Mark Pending",
			handleClick: () => {
				setOpen(true);
			},
		},
		{
			item: "Change Role",
			path: "/admin/my-network/profile/change-role",
		},
	];
	const [isOpen, setOpen] = useState(false);
	const { userData } = useUser();
	const body = {
		initiator_id: "9911572989",
		user_code: "99029899",
		org_id: "1",
		source: "WLC",
		client_ref_id: "202301031354123456",
	};
	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"Content-Type": "application/json",
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents/updateStatus/eko_code:${eko_code}/status_id:17/descrip_note:nkxnakv`,
				"tf-req-method": "PUT",
			},
			body: body,
			token: userData.access_token,
		})
			.then((data) => {
				console.log("data", data);
			})
			.catch((error) => {
				console.error("📡 Fetch Error:", error);
			});
	}, []);
	const { onOpen, onClose } = useDisclosure();
	const [reason, setReason] = useState("");
	const handleSave = () => {
		console.log("Reason for marking inactive:", reason);
		onClose();
	};
	return (
		<div>
			<Menus
				onOpen={onOpen}
				menulist={menuList}
				type="everted"
				as={IconButton}
				iconName="more-vert"
				minH={{ base: "25px", xl: "25px", "2xl": "30px" }}
				minW={{ base: "25px", xl: "25px", "2xl": "30px" }}
				width={{ base: "25px", xl: "25px", "2xl": "30px" }}
				height={{ base: "25px", xl: "25px", "2xl": "30px" }}
				// iconStyles={{ height: "15px", width: "4px" }}
				onClick={(e) => {
					e.stopPropagation();
				}}
			/>
			<Modal isOpen={isOpen} onClose={() => setOpen(false)} size="lg">
				<ModalOverlay />
				<ModalContent
					width={{ base: "100%", md: "465px" }}
					height="auto"
				>
					<ModalHeader>Mark Inactive</ModalHeader>
					<ModalCloseButton color="#D2D2D2" size="lg" />
					<ModalBody>
						<Text>Reason for marking inactive</Text>
						<Textarea
							width="100%"
							h={{ base: "200px", md: "250px" }}
							borderRadius={20}
							resize="none"
							maxLength={400}
							fontSize={{ base: "14px", md: "16px" }}
							onChange={(e) => setReason(e.target.value)}
						/>
					</ModalBody>
					<ModalFooter
						justifyContent="center"
						paddingBottom={{ base: 4, md: 8 }}
					>
						<Buttons
							title="Save"
							h={{ base: "44px", md: "56px" }}
							width="100%"
							fontSize={{ base: "14px", md: "16px" }}
							onClick={handleSave}
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default NetworkMenuWrapper;
