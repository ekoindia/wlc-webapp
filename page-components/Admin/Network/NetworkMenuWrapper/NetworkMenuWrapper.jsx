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
import { Button, Menus } from "components";
import { Endpoints } from "constants/EndPoints";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useState } from "react";

/**
 * A <NetworkMenuWrapper> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkMenuWrapper></NetworkMenuWrapper>`
 */

const NetworkMenuWrapper = (props) => {
	const { userData } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const { eko_code, account_status } = props;
	const { onOpen, onClose } = useDisclosure();
	const [reason, setReason] = useState("");
	const menuList = [
		{
			item: "Proceed",
			path: `/admin/my-network/profile?ekocode=${eko_code}`,
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
	const handleSave = () => {
		// API call
		const body = {
			initiator_id: userData.accountDetails.mobile,
			user_code: userData.accountDetails.code,
			org_id: orgDetail.org_id,
		};
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"Content-Type": "application/json",
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents/updateStatus/eko_code:${eko_code}/status_id:17/descrip_note:${reason}`,
				"tf-req-method": "PUT",
			},
			body: body,
			token: userData.access_token,
		})
			.then(() => {
				onClose();
			})
			.catch((error) => {
				console.error("📡 Fetch Error:", error);
			});
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
				>
					<ModalHeader>Mark {account_status}</ModalHeader>
					<ModalCloseButton color="#D2D2D2" size="lg" />
					<ModalBody>
						<Text>
							Reason for marking {account_status?.toLowerCase()}
						</Text>
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
						<Button
							h={{ base: "44px", md: "56px" }}
							width="100%"
							fontSize={{ base: "14px", md: "16px" }}
							onClick={handleSave}
						>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default NetworkMenuWrapper;
